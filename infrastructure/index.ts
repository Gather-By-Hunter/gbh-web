import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { createWebsiteBucket } from "./src/s3";
import { uploadFiles } from "./src/uploadFiles";

const config = new pulumi.Config();

const env = config.require("env");

const domain = config.require("domain");
const subdomain = config.require("subdomain");

const networkHostedZoneId = config.require("networkHostedZoneId");
const networkRoleArn = config.require("networkRoleArn");

const networkProvider = new aws.Provider("networkProvider", {
  assumeRoles: [
    {
      roleArn: networkRoleArn,
    },
  ],
  region: "us-east-1",
});

const usEastProvider = new aws.Provider("us-east-1-provider", {
  region: "us-east-1",
});

const bucket = createWebsiteBucket(env);

const fullDomain = subdomain ? `${subdomain}.${domain}` : domain;
const cert = new aws.acm.Certificate(
  "cert",
  {
    domainName: fullDomain,
    validationMethod: "DNS",
  },
  { provider: usEastProvider }
);

const certValidationRecord = new aws.route53.Record(
  "cert-validation-record",
  {
    name: cert.domainValidationOptions[0].resourceRecordName,
    zoneId: networkHostedZoneId,
    type: cert.domainValidationOptions[0].resourceRecordType,
    records: [cert.domainValidationOptions[0].resourceRecordValue],
    ttl: 300,
  },
  { provider: networkProvider }
);

const certValidation = pulumi
  .all([certValidationRecord.fqdn, cert.arn])
  .apply(([fqdn, certArn]: [string, string]) => {
    const certValidation = new aws.acm.CertificateValidation(
      "cert-validation",
      {
        certificateArn: certArn,
        validationRecordFqdns: [fqdn],
      },
      { provider: usEastProvider }
    );

    return certValidation;
  });

const timestamp = new Date().toISOString().replace(/[:.]/g, "");
const prefix = timestamp;

const objects = uploadFiles(bucket, prefix);

const oai = new aws.cloudfront.OriginAccessIdentity("oai");

new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: bucket.id,
  policy: pulumi.all([oai.iamArn, bucket.arn]).apply(([oaiArn, bucketArn]: [string, string]) =>
    JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            AWS: oaiArn,
          },
          Action: "s3:GetObject",
          Resource: `${bucketArn}/*`,
        },
      ],
    })
  ),
});

const cdn = new aws.cloudfront.Distribution(
  "cdn",
  {
    enabled: true,
    origins: [
      {
        domainName: bucket.bucketRegionalDomainName,
        originId: bucket.arn,
        originPath: `/${prefix}`,
        s3OriginConfig: {
          originAccessIdentity: oai.cloudfrontAccessIdentityPath,
        },
      },
    ],
    defaultCacheBehavior: {
      allowedMethods: ["GET", "HEAD"],
      cachedMethods: ["GET", "HEAD"],
      targetOriginId: bucket.arn,
      viewerProtocolPolicy: "redirect-to-https",
      forwardedValues: {
        queryString: false,
        cookies: { forward: "none" },
      },
    },
    viewerCertificate: {
      acmCertificateArn: certValidation.certificateArn,
      sslSupportMethod: "sni-only",
    },
    defaultRootObject: "index.html",
    aliases: [fullDomain],
    restrictions: {
      geoRestriction: { restrictionType: "none" },
    },
    priceClass: "PriceClass_100",
  },
  {
    dependsOn: objects,
  }
);

new aws.route53.Record(
  "gbh-a-record",
  {
    name: fullDomain,
    zoneId: networkHostedZoneId,
    type: "A",
    aliases: [
      {
        name: cdn.domainName,
        zoneId: cdn.hostedZoneId,
        evaluateTargetHealth: true,
      },
    ],
  },
  { provider: networkProvider }
);
