import { Header, HomeHeader, Main } from "@components/index.ts";
import { Services } from "./Services.tsx";
import { ServiceArea } from "./ServiceArea.tsx";
import { Carousel } from "./Carousel.tsx";
import { HomeStore } from "@stores/home/HomeStore.ts";

// @ts-ignore
const ASSET_BUCKET_URL: string = import.meta.env.VITE_ASSETS_BUCKET_URL;

export const Home: React.FC = () => {
  const featuredPhotos = new HomeStore([
    {
      id: 1,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9338.jpg`,
      alt: "",
      objectPosition: "center 75%",
    },
    {
      id: 2,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9341.jpg`,
      alt: "",
      objectPosition: "center 80%",
    },
    {
      id: 4,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9514.jpg`,
      alt: "",
      objectPosition: "center 75%",
    },
    {
      id: 5,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_9525.jpg`,
      alt: "",
      objectPosition: "center 50%",
    },
    {
      id: 6,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1539.jpeg`,
      alt: "",
      objectPosition: "center 70%",
    },
    {
      id: 7,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1540.jpeg`,
      alt: "",
      objectPosition: "center 50%",
    },
    {
      id: 8,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1545.jpeg`,
      alt: "",
      objectPosition: "center 50%",
    },
    {
      id: 9,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1546.jpeg`,
      alt: "",
      objectPosition: "center 50%",
    },
    {
      id: 10,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1549.jpeg`,
      alt: "",
      objectPosition: "center 40%",
    },
    {
      id: 11,
      url: `${ASSET_BUCKET_URL}/photos/featured/IMG_1551.jpeg`,
      alt: "",
      objectPosition: "center 50%",
    },
  ]).featuredPhotos();

  return (
    <>
      <HomeHeader />
      <Header />
      <Main>
        <Carousel featuredPhotos={featuredPhotos} />
        <ServiceArea />
        <Services />
      </Main>
    </>
  );
};

export default Home;
