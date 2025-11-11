## Gather By Hunter

Description: A website to rent party, wedding, event decore

Goals: A website where a user can select items they want to rent for a specific time frame, "match their vibe" by sharing a pinterest board, and checkout automatically. A website where an admin can add, remove, or update items, as well as create packages, discounts, message users, etc.

Technologies:

- Code storage: Github
- Code deployment: Github actions, AWS
- Website front end: Typescript/react, tailwindcss, vite. Stored on AWS S3, distributed by AWS Cloudfront
- Website back end: Rust app with a postgres database, redis for cache. Deployed on AWS EC2
- Pinterest "match your vibe": AWS S3 for temp image storage, AWS Titan G1 for image embedding, and Postgres for vector lookups

```
┌────────────┐
│  Pinterest │
│   API      │
└────┬───────┘
     │ fetch image URLs
┌────▼─────┐
│ EC2 Rust │
│ backend  │
└────┬─────┘
     │ download & resize
     ▼
┌──────────────┐
│ Upload to S3 │
└────┬─────────┘
     │ generate list of S3 URIs
     ▼
┌─────────────────────────┐
│ Bedrock Titan G1 (batch)│
└────┬────────────────────┘
     │ embeddings → Vec<f32>
     ▼
┌─────────────┐
│  Postgres   │
│ + pgvector  │
└────┬────────┘
     │ centroid clustering
     ▼
┌───────────────┐
│ Return top N  │
│ similar images│
└───────────────┘
```

Goals: Working UI, "match your vibe" functions. Maybe not the admin portal, probably not enough time for that

| DATE  | DESCRIPTION                                                 | HOURS |
| ----- | ----------------------------------------------------------- | ----- |
| 11/03 | Set up AWS, Google workspace, Github. Acquired domain names | 2.5   |
| 11/10 | Made initial design                                         | 1.5   |
