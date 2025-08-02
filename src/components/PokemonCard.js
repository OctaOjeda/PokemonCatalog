import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import typeColors from '../constants';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import ModalPoke from "./ModalPoke";

const PokemonCard = ({ pokemon, onClose, pokemons, setPokemons, setSelectedPokemon }) => {
  const navigate = useNavigate();
  const {userInfo} = useUser();
  const [mostrarModal, setMostrarModal] = useState(false)

  if (!pokemon) return null;

  const handleEdit = () => {
    navigate(`/edit/${pokemon._id}`);
    onClose(); // Cerramos el modal
  }; 

    const handleDelete = async () => {
      //if (!window.confirm('Are you sure you want delete')) return;

      try {
        await axios.delete(`http://localhost:3001/api/pokemons/${pokemon._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`, 
          },
        });
        setPokemons(pokemons?.filter((p) => p._id !== pokemon._id));
        setMostrarModal(false)
        setSelectedPokemon(undefined)
      } catch (error) {
        console.log('Error')
        console.log(error)
      }
    }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
          aria-label="Close modal"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-purple-600 capitalize">
          {pokemon.name}
        </h2>
        <img
          src={pokemon.img || pokemon.image}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto mb-4 object-contain"
        />
        <p className="text-center text-gray-700">ID: {pokemon._id}</p>
        <p className="text-center text-gray-700 capitalize">
          Types: 
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
        </p>
        <p className="text-center mt-2">
          {pokemon.state === 'Legendary' ? '🌟 Legendary Pokémon' : 'Normal Pokémon'}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleEdit}
            className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-100 transition"
            aria-label={`Edit ${pokemon.name}`}
          >
            ✏️ Edit
          </button>
        
          <ModalPoke
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={handleDelete}
        mensaje="¿Estás seguro que querés continuar con esta acción?"
      />

          <button
            onClick={() => setMostrarModal(true)}
            className="px-4 py-1 border border-red-500 text-red-500 rounded hover:bg-red-100 transition"
            aria-label={`Remove ${pokemon.name}`}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;


