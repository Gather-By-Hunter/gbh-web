import { useState, useEffect } from "react";
import { MediaMetadata, MediaResolution, MediaVersion } from "@model/index.ts";

interface LazyMediaProps {
  media: MediaMetadata;
  versions?: MediaVersion[];
  preferredResolution?: MediaResolution;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export const LazyMedia = ({
  media,
  versions = [],
  preferredResolution = "medium",
  className = "",
  alt,
  style,
}: LazyMediaProps) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    setLoaded(false);
    setCurrentSrc(undefined);

    if (!versions || versions.length === 0) {
      return () => {
        active = false;
      };
    }

    let version = versions.find((v) => v.resolution === preferredResolution);

    if (!version) {
      version = versions.find((v) => v.resolution === "original");
    }

    if (!version) {
      return () => {
        active = false;
      };
    }

    const url = version.url;
    const img = new Image();
    img.src = url;
    if (version) {
      img.onload = () => {
        if (!active) return;
        setCurrentSrc(url);
        setLoaded(true);
      };
      img.onerror = () => {
        if (!active) return;
        setCurrentSrc(url);
        setLoaded(true);
      };
    }

    return () => {
      active = false;
    };
  }, [media.id, versions, preferredResolution]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {media.blurData && (
        <img
          src={media.blurData}
          alt={alt || media.title || media.name}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
          style={{ filter: "blur(10px)", transform: "scale(1.1)" }}
        />
      )}

      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt || media.title || media.name}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: media.objectPosition || "center" }}
        />
      )}
    </div>
  );
};
