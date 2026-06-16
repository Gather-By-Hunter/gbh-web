import { useEffect, useState } from "react";
import { MediaMetadata, MediaVersion } from "@model/index.ts";
import { LazyMedia } from "@components/media/LazyMedia.tsx";

interface MediaCarouselProps {
  images: MediaMetadata[];
  versions?: Record<number, MediaVersion[]>;
  className?: string;
}

export const MediaCarousel = ({
  images,
  versions = {},
  className = "",
}: MediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div
        className={`bg-gbh-cream flex items-center justify-center text-gbh-black/45 font-montserrat-light ${className}`}
      >
        No Image
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const safeIndex = currentIndex < images.length ? currentIndex : 0;
  const currentImage = images[safeIndex]!;

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <LazyMedia
        media={currentImage}
        versions={versions[currentImage.id]}
        preferredResolution="large"
        className="w-full h-full"
        alt={currentImage.title || currentImage.name}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gbh-black/45 hover:bg-gbh-green text-gbh-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gbh-black/45 hover:bg-gbh-green text-gbh-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            →
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === safeIndex ? "bg-gbh-white" : "bg-gbh-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
