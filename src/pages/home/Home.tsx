import { Header, HomeHeader, Main } from "@components/index.ts";
import { Services } from "./Services.tsx";
import { ServiceArea } from "./ServiceArea.tsx";
import { Carousel } from "./Carousel.tsx";
import { useEffect, useRef } from "react";
import { useHomePresenter, useStores } from "@context/index.ts";
import { useStore } from "@stores/useStore.ts";
import { displayError, displayMessage } from "@pages/common.ts";
import { useNavigate } from "react-router-dom";
import { HomePresenter, type HomeView } from "@presenters/HomePresenter.ts";

export const Home: React.FC = () => {
  const stores = useStores();
  const homeStore = useStore(stores.home);
  const navigate = useNavigate();

  const viewRef = useRef<HomeView>({
    displayError,
    displayMessage,
    navigate,
  });
  const view = viewRef.current;
  const presenter = useHomePresenter(view);

  useEffect(() => {
    presenter.loadFeaturedPhotos();
  }, [presenter]);

  return (
    <>
      <HomeHeader />
      <Header />
      <Main>
        {homeStore.loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : homeStore.featuredPhotos.length > 0 ? (
          <Carousel
            featuredPhotos={homeStore.featuredPhotos}
            mediaVersions={homeStore.mediaVersions}
          />
        ) : (
          <div className="h-[85vh] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic">
            No featured photos found
          </div>
        )}
        <ServiceArea />
        <Services />
      </Main>
    </>
  );
};

export default Home;
