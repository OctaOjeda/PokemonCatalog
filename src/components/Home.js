import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const pokemons = [
  {
    name: 'All Pokemon',
    img: '/allpokes.jpg',
  },
  {
    name: 'Main Pokemon',
    img: '/mainpokes.jpg',
  },
  {
    name: 'Pokeball',
    img: '/pokeball.jpeg',
  },
];

const Home = () => {
  return (
    <div className=" bg-white flex flex-col items-center">
      {/* Título original en púrpura */}
      <h1 className="text-4xl font-bold text-purple-500 mb-4">Do you want to be a Pokemon Master?</h1>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="w-full h-[700px]"
      >
        {pokemons.map((poke, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center bg-purple-50 rounded-lg shadow-md h-full"
          >
            <img src={poke.img} alt={poke.name} className="w-full h-full object-cover rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;