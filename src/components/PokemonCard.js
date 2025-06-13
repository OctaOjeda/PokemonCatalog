import React from 'react';
import { Link } from 'react-router-dom';

const PokemonCard = ({ pokemon, onClose, onRemove }) => {
  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-purple-600 capitalize">
          {pokemon.name}
        </h2>
        <img
          src={pokemon.img || pokemon.image}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto mb-4"
        />
        <p className="text-center text-gray-700">ID: {pokemon.id}</p>
        <p className="text-center text-gray-700 capitalize">
          Types: {pokemon.types.join(', ')}
        </p>
        <p className="text-center mt-2">
          {pokemon.isLegendary ? '🌟 Legendary Pokémon' : 'Normal Pokémon'}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to={`/edit/${pokemon.id}`}
            className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-100 transition"
          >
            Edit
          </Link>
          <button
            onClick={onRemove}
            className="px-4 py-1 border border-red-500 text-red-500 rounded hover:bg-red-100 transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;