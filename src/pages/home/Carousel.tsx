import { LazyMedia } from "@components/media/LazyMedia.tsx";
import { HomeMedia, HomeMediaDisplay, MediaVersion } from "@model/index.ts";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Explicitly import styles in the component - handled in index.css

export const Carousel = ({
  featuredPhotos,
  mediaVersions,
}: {
  featuredPhotos: HomeMediaDisplay[];
  mediaVersions: Record<number, MediaVersion[]>;
}) => (
  <div className="w-full min-h-[400px]">
    <Swiper
      navigation
      modules={[Pagination, Navigation, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="w-full h-[85vh] overflow-hidden rounded-lg shadow-lg"
    >
      {featuredPhotos.map((photo) => {
        const media = photo.media;

        return (
          <SwiperSlide key={photo.id} className="w-full h-full">
            {media && (
              <LazyMedia
                media={media}
                versions={mediaVersions?.[photo.mediaMetadataId]}
                preferredResolution="large"
                className="w-full h-full object-cover"
                alt={media.title || media.name}
              />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div>
);
