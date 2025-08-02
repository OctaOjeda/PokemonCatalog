import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import typeColors from '../constants';
import axios from 'axios';

const itemsPerPage = 12;

const PokemonCatalog = () => {
  const [search, setSearch] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {

    const fetchPokemons = async () => {
      const res = await axios.get('http://localhost:3001/api/pokemons');
      // console.log(res.data);
      setPokemons(res.data);
    };

    fetchPokemons();
  }, []);

  const filteredPokemons = pokemons?.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
      pokemon.type?.toLowerCase().includes(search.toLowerCase()) ||
      pokemon.type2?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPokemons = filteredPokemons.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="py-10 px-6">
      <h2 className="text-5xl font-bold text-center text-purple-600 mb-10">Pokemon Catalog</h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or type"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border border-gray-300 rounded px-4 py-2 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentPokemons?.map((pokemon) => (
          <div
            key={pokemon._id}
            className="bg-white shadow-md rounded overflow-hidden cursor-pointer transition transform hover:scale-105"
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <img src={pokemon.image} alt={pokemon.name} className="w-full h-40 object-contain bg-gray-100" />
            <div className="p-4">
              <h3 className="text-xl font-bold capitalize">{pokemon.name}</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {pokemon.type &&
                  <span
                    key={pokemon.type}
                    className={`px-2 py-0.5 rounded text-black text-sm ${typeColors[pokemon.type] || 'bg-gray-200'}`}
                  >
                    {pokemon.type}
                  </span>
                }
                {pokemon.type2 &&
                  <span
                    key={pokemon.type2}
                    className={`px-2 py-0.5 rounded text-black text-sm ${typeColors[pokemon.type2] || 'bg-gray-200'}`}
                  >
                    {pokemon.type2}
                  </span>
                }
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {pokemon.state === 'Legendary' ? '🌟 Legendary Pokémon' : 'Normal Pokémon'} - Level: {pokemon.level}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
        >
          Prev
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {selectedPokemon && (
        <PokemonCard
          pokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          pokemons={pokemons}
          setPokemons={setPokemons}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
};

export default PokemonCatalog;