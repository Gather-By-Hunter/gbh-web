import { Media } from "@components/index.ts";

export const ServiceArea = () => (
  <div className="h-full w-full p-5 mt-5">
    <h2 className="w-full font-perandory text-5xl text-left text-gbh-gold">
      Lets plan your next event
    </h2>
    <div>
      <p className="text-left font-montserrat-light text-xl text-gbh-black">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </div>
    <div className="flex h-[600px] items-center justify-center">
      <div className="relative z-10 h-5/6 w-3/5">
        <Media
          src="/photos/home/service-locations.jpeg"
          className="h-full w-full object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="relative -ml-20 mt-30 h-3/4 w-3/5 bg-gbh-gold p-10 flex flex-col items-end rounded-lg shadow-lg">
        <h3 className="font-perandory text-6xl text-white mb-10">
          Areas of Service
        </h3>
        <h4 className="font-perandory text-4xl text-white">Free Delivery</h4>
        <div className="font-montserrat-light text-white text-2xl mb-10">
          Emmett & surrounding area
        </div>
        <h4 className="font-perandory text-4xl text-white">
          Pickup / Paid delivery
        </h4>
        <div className="font-montserrat-light text-white text-2xl">
          Eagle, Boise, Meridian, Star, & surrounding areas
        </div>
      </div>
    </div>
  </div>
);
