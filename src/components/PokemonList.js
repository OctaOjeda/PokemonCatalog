import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from './PokemonCard'; // Asegúrate que la ruta es correcta

const PokemonList = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const itemsPerPage = 20;

  // Diccionario de colores por tipo
  const typeColors = {
    fire: 'bg-orange-400',
    water: 'bg-blue-300',
    grass: 'bg-green-300',
    electric: 'bg-yellow-300',
    poison: 'bg-purple-300',
    flying: 'bg-indigo-200',
    bug: 'bg-lime-300',
    normal: 'bg-gray-300',
    ground: 'bg-yellow-500',
    fairy: 'bg-pink-300',
    fighting: 'bg-red-400',
    psychic: 'bg-pink-200',
    rock: 'bg-yellow-600',
    ghost: 'bg-indigo-400',
    ice: 'bg-cyan-200',
    dragon: 'bg-indigo-300',
    dark: 'bg-gray-600',
    steel: 'bg-gray-400',
  };

  // Traer los primeros 150 Pokémon
  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
      const results = response.data.results;
      const detailedPromises = results.map(pokemon => axios.get(pokemon.url));
      const detailedResults = await Promise.all(detailedPromises);
      const finalData = detailedResults.map(res => ({
        id: res.data.id,
        name: res.data.name,
        img: res.data.sprites.front_default,
        types: res.data.types.map(t => t.type.name),
      }));
      setAllPokemons(finalData);
    };
    fetchPokemons();
  }, []);

  // Filtrar por nombre o tipo
  const filtered = allPokemons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.types.some(type => type.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Función para eliminar Pokémon de la lista
  const removePokemon = (id) => {
    setAllPokemons((prev) => prev.filter(p => p.id !== id));
    setSelectedPokemon(null);
  };

  return (
    <div className="bg-white text-black p-6 rounded shadow-md max-w-6xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pokémon List</h2>
        <input
          type="text"
          placeholder="Search Pokémon or type"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-1"
        />
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2">#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Type(s)</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pokemon) => (
            <tr key={pokemon.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
              <td className="py-2">{pokemon.id}</td>
              <td>
                <img src={pokemon.img} alt={pokemon.name} className="w-10 h-10" />
              </td>
              <td className="capitalize">{pokemon.name}</td>
              <td className="capitalize flex gap-1 flex-wrap">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className={`px-2 py-0.5 rounded text-black text-sm ${typeColors[type] || 'bg-gray-200'}`}
                  >
                    {type}
                  </span>
                ))}
              </td>
              <td className="text-center">
              <button
                onClick={() => setSelectedPokemon(pokemon)}
                className="text-black hover:text-purple-600 transition"
                title="View"
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
              </svg>
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-end mt-4">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-black border-gray-300'
              } hover:bg-purple-100 transition`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Pokémon */}
      {selectedPokemon && (
        <PokemonCard
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onRemove={() => removePokemon(selectedPokemon.id)}
        />
      )}
    </div>
  );
};

export default PokemonList;