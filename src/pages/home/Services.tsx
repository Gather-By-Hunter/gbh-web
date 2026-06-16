import { Media } from "@components/index.ts";

export const Services = () => (
  <div className="w-full p-5 mt-10">
    <h2 className="w-full font-perandory text-4xl text-center text-gbh-gold mb-10">
      Our Services
    </h2>
    <div className="flex flex-col md:flex-row justify-center gap-8">
      <div className="md:w-1/3 flex flex-col items-center text-center">
        <div className="w-full h-96">
          <Media
            src="/photos/home/services-1.jpeg"
            className="w-full h-full object-cover rounded-lg shadow-lg"
            style={{ objectPosition: "center 75%" }}
          />
        </div>
        <div className="p-4 mt-4">
          <h3 className="font-perandory text-3xl text-gbh-green">
            Full Service Planning
          </h3>
          <p className="font-montserrat-light text-lg text-gbh-green mt-2">
            From start to finish, we handle every detail to create a seamless
            and unforgettable event experience.
          </p>
        </div>
      </div>
      <div className="md:w-1/3 flex flex-col items-center text-center">
        <div className="w-full h-96">
          <Media
            src="/photos/home/services-2.jpeg"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="p-4 mt-4">
          <h3 className="font-perandory text-3xl text-gbh-green">
            Partial Planning
          </h3>
          <p className="font-montserrat-light text-lg text-gbh-green mt-2">
            Perfect for when you&apos;ve started planning but need expert help
            to tie up loose ends and execute your vision.
          </p>
        </div>
      </div>
      <div className="md:w-1/3 flex flex-col items-center text-center">
        <div className="w-full h-96">
          <Media
            src="/photos/home/services-3.jpeg"
            className="w-full h-full object-cover rounded-lg shadow-lg"
            style={{ objectPosition: "center 60%" }}
          />
        </div>
        <div className="p-4 mt-4">
          <h3 className="font-perandory text-3xl text-gbh-green">
            Event Rentals
          </h3>
          <p className="font-montserrat-light text-lg text-gbh-green mt-2">
            Browse our curated collection of unique and stylish rentals to bring
            your event to life.
          </p>
        </div>
      </div>
    </div>
  </div>
);
