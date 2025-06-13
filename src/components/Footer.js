import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-purple-600 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        {/* Información general */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-bold mb-3">Information</h3>
          <p>
            Pokémon is a franchise that includes video games, animated series, movies, trading cards, and much more. It was created by Satoshi Tajiri and launched by Nintendo in 1996. The main goal is to catch, train, and battle creatures called Pokémon.
          </p>
        </div>

        {/* Historia corta */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-bold mb-3">History</h3>
          <p>
            The Pokémon adventure begins in the Kanto region, where young trainers start their journey to become Pokémon masters. Over the years, the saga has grown and evolved, capturing the imagination of millions worldwide.
          </p>
        </div>
      </div>

      <div className="text-center text-sm mt-8 opacity-70">
        &copy; {new Date().getFullYear()} PokéApp. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;