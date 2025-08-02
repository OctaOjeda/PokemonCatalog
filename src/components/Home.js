import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const pokemons = [
  {
    name: 'Pikachu',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  {
    name: 'Charmander',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
  },
  {
    name: 'Squirtle',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
  },
  {
    name: 'Bulbasaur',
    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
];

const Home = () => {
  return (
    <div className=" bg-white flex flex-col items-center py-10 px-4">
      {/* Título original en púrpura */}
      <h1 className="text-4xl font-bold text-purple-500 mb-8">Pokemon Catalog</h1>

      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="w-full max-w-4xl h-[500px]"
      >
        {pokemons.map((poke, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col items-center justify-center bg-purple-50 p-8 rounded-lg shadow-md h-full"
          >
            <img src={poke.img} alt={poke.name} className="w-40 h-40 mb-6" />
            {/* Nombre del Pokémon en púrpura */}
            <h2 className="text-2xl font-semibold text-purple-600">{poke.name}</h2>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;