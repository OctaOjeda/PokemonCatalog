import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import { useNavigate } from 'react-router-dom';
import typeColors from '../constants';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const PokemonList = () => {
  const [search, setSearch] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const navigate = useNavigate();
  const { userInfo } = useUser();
  const itemsPerPage = 20;

  useEffect(() => {

    const fetchPokemons = async () => {
      const res = await axios.get('http://localhost:3001/api/pokemons');
      // console.log(res.data);
      setPokemons(res.data);
    };

    fetchPokemons();
  }, []);

  const filtered = pokemons?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type?.toLowerCase().includes(search.toLowerCase()) ||
    p.type2?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const removePokemon = (id) => {
    setSelectedPokemon(null);
  };

  return (
    <div className="bg-white text-black p-6 rounded shadow-md max-w-6xl mx-auto mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Pokémon List</h2>

        <div className="flex items-center gap-3">
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

          {userInfo && (
            <button
              onClick={() => navigate('/create')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded transition"
            >
              + Create Pokémon
            </button>
          )}
          {!userInfo && (
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded transition"
              title="Please login to create Pokemon"
            >
              Login to Create
            </button>
          )}
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-left">
            <th className="py-2">#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Type(s)</th>
            <th>Class</th>
            <th>Level</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((pokemon) => (
            <tr key={pokemon._id} className="border-b border-gray-200 hover:bg-gray-100 transition">
              <td className="py-2">{pokemon.id}</td>
              <td>
                <img src={pokemon.image} alt={pokemon.name} className="w-10 h-10" />
              </td>
              <td className="capitalize">{pokemon.name}</td>
              <td className="capitalize flex gap-1 flex-wrap items-center h-12">
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
              </td>
              <td className="capitalize">
                {pokemon.state === 'Legendary' ? '🌟 Legendary Pokémon' : 'Normal Pokémon'}
              </td>
              <td className="capitalize">
                {pokemon.level}
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
                    className="w-5 h-5 inline"
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

      {selectedPokemon && (
        <PokemonCard
          pokemon={selectedPokemon}
          setSelectedPokemon={setSelectedPokemon}
          pokemons={pokemons}
          setPokemons={setPokemons}
          onClose={() => setSelectedPokemon(null)}
          // onRemove={() => removePokemon(selectedPokemon.id)}
        />
      )}
    </div>
  );
};

export default PokemonList;
