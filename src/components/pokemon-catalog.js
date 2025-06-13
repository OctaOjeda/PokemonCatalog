import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';

const itemsPerPage = 12;

const typeColors = {
  fire: 'bg-orange-400',
  water: 'bg-blue-400',
  grass: 'bg-green-400',
  electric: 'bg-yellow-300',
  poison: 'bg-purple-400',
  bug: 'bg-lime-400',
  flying: 'bg-sky-300',
  normal: 'bg-gray-300',
  ground: 'bg-yellow-600',
  rock: 'bg-stone-400',
  ghost: 'bg-indigo-400',
  psychic: 'bg-pink-400',
  ice: 'bg-cyan-200',
  dragon: 'bg-indigo-600',
  fairy: 'bg-pink-300',
  fighting: 'bg-red-500',
  dark: 'bg-gray-700',
  steel: 'bg-gray-400',
};

const PokemonCatalog = () => {
  const [pokemons, setPokemons] = useState([]);
  const [deletedPokemons, setDeletedPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const countEvolutions = (chain, currentName, depth = 1) => {
      if (chain.species.name === currentName) return depth;
      for (let evo of chain.evolves_to) {
        const result = countEvolutions(evo, currentName, depth + 1);
        if (result) return result;
      }
      return null;
    };

    const fetchPokemons = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
      const data = await response.json();
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const detail = await res.json();
          const speciesRes = await fetch(detail.species.url);
          const speciesData = await speciesRes.json();
          const evolutionRes = await fetch(speciesData.evolution_chain.url);
          const evolutionData = await evolutionRes.json();

          const totalEvolutions = countEvolutions(evolutionData.chain, detail.name);
          const isLegendary = speciesData.is_legendary;

          return {
            id: detail.id,
            name: detail.name,
            image: detail.sprites.front_default,
            types: detail.types.map((t) => t.type.name),
            evolutionDepth: totalEvolutions,
            isLegendary,
          };
        })
      );
      setPokemons(detailedPokemons);
    };

    fetchPokemons();
  }, []);

  const removePokemon = (id) => {
    setPokemons((prev) => {
      const toDelete = prev.find((p) => p.id === id);
      setDeletedPokemons((del) => [...del, toDelete]);
      return prev.filter((p) => p.id !== id);
    });
  };

  const restoreLastDeleted = () => {
    if (deletedPokemons.length === 0) return;
    const last = deletedPokemons[deletedPokemons.length - 1];
    setPokemons((prev) => [...prev, last]);
    setDeletedPokemons((prev) => prev.slice(0, -1));
  };

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
      pokemon.types.some((type) => type.toLowerCase().includes(search.toLowerCase()))
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
          className="border border-gray-300 rounded px-4 py-2 w-80"
        />
        <button
          onClick={restoreLastDeleted}
          disabled={deletedPokemons.length === 0}
          className="text-sm underline text-black hover:text-green-600 disabled:opacity-40"
        >
          Restore last deleted
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center relative hover:shadow-xl transition"
          >
            <div className="absolute top-2 right-2 flex gap-1">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`px-2 py-1 rounded text-sm font-medium text-black ${
                    typeColors[type] || 'bg-gray-200'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>

            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="w-28 h-28 mb-4"
            />
            <h3 className="text-xl font-semibold text-purple-600 capitalize mb-4">
              {pokemon.name}
            </h3>

            <div className="flex gap-1 mb-6">
              {Array.from({ length: pokemon.evolutionDepth }).map((_, idx) => (
                <svg
                  key={idx}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-6 h-6 ${
                    pokemon.isLegendary
                      ? 'text-gradient bg-gradient-to-r from-gray-300 via-white to-gray-500 text-transparent bg-clip-text'
                      : 'text-yellow-400'
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.27l4.18 2.19-1.64-5.03L18 8.24l-5.19-.42L10 3 7.19 7.82 2 8.24l4.46 4.19-1.64 5.03L10 15.27z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>

            <button
              onClick={() => setSelectedPokemon(pokemon)}
              className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-100 transition"
            >
              View
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition disabled:opacity-50"
        >
          ← Previous
        </button>

        <span className="text-lg font-medium text-purple-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {selectedPokemon && (
        <PokemonCard
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onRemove={() => {
            removePokemon(selectedPokemon.id);
            setSelectedPokemon(null);
          }}
        />
      )}
    </div>
  );
};

export default PokemonCatalog;