// CreatePokemon.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonForm from './PokemonForm';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const CreatePokemon = () => {
  const [pokemonData, setPokemonData] = useState({
    name: '',
    image: '',
    type: '',
    type2: '',
    isLegendary: false,
    isNormal: true,
  });
  const [types, setTypes] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/type');
        const data = await res.json();
        const validTypes = data.results
          .map((t) => t.name)
          .filter((t) => !['shadow', 'unknown', 'stellar', 'typeless'].includes(t));
        setTypes(validTypes);
      } catch (error) {
        console.error('Error fetching types:', error);
        setTypes([]); // fallback
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPokemonData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'isLegendary' && checked
        ? { isNormal: false }
        : name === 'isNormal' && checked
        ? { isLegendary: false }
        : {}),
    }));
  };

  const createPokemon = async (payload) => {
    const rsp = await axios.post('http://localhost:3001/api/pokemons',
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
    setPokemonData(rsp.data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pokemonData.name.trim() || !pokemonData.image.trim() || !pokemonData.type) {
      alert('Please fill in at least name, image, and type 1.');
      return;
    }

    if (pokemonData.type === pokemonData.type2 && pokemonData.type2 !== '') {
      alert('Type 1 and Type 2 cannot be the same.');
      return;
    }

    const payload = {
      name: pokemonData.name.trim(),
      image: pokemonData.image.trim(),
      type: pokemonData.type,
      type2: pokemonData.type2,
      state: pokemonData.isLegendary ? 'Legendary' : 'Normal',
    };

    createPokemon(payload);
    setMessage('Pokémon updated successfully!');

    setTimeout(() => {
      navigate('/pokemons');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-600">Create Pokémon</h2>
      

      <PokemonForm
        pokemonData={pokemonData}
        types={types}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonLabel="Create"
        message={message}
        onCancel={() => navigate('/pokemons')}
      />
    </div>
  );
};

export default CreatePokemon;