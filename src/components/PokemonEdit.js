import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokemonForm from './PokemonForm';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const PokemonEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();

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

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/type');
      const data = await res.json();
      const validTypes = data.results
        .map((t) => t.name)
        .filter((t) => !['shadow', 'unknown', 'stellar', 'typeless'].includes(t));
      setTypes(validTypes);
    };
    fetchTypes();
  }, []);

  const getPokemon = async () => {
    const rsp = await axios.get(`http://localhost:3001/api/pokemons/${id}`);
    console.log(rsp);
    setPokemonData(rsp.data);
  }

  const editPokemon = async (payload) => {
    const rsp = await axios.put(
        `http://localhost:3001/api/pokemons/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
    setPokemonData(rsp.data);
  }

  useEffect(() => {
    getPokemon();
  }, [id]);

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

  const handleSubmit = async (e, values) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Use values from Formik if available, otherwise fall back to pokemonData
    const data = values || pokemonData;

    const payload = {
      id: parseInt(id, 10),
      name: data.name.trim(),
      image: data.image.trim(),
      type: data.type,
      type2: data.type2,
      state: data.isLegendary ? 'Legendary' : 'Normal',
    };

    try {
      await editPokemon(payload);
      setMessage('Pokémon updated successfully!');

      setTimeout(() => {
        navigate('/pokemons');
      }, 1500);
    } catch (error) {
      console.error('Error updating Pokémon:', error);
      throw error; // Let Formik handle the error
    }
  };

  // Don't render anything if user is not authenticated
  if (!userInfo) {
    return (
      <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Access Denied</h2>
        <p className="text-gray-600">You must be logged in to edit Pokemon.</p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-600">Edit Pokémon</h2>

      <PokemonForm
        pokemonData={pokemonData}
        types={types}
        onSubmit={handleSubmit}
        buttonLabel="Update"
        message={message}
        onCancel={() => navigate('/pokemons')}
      />
    </div>
  );
};

export default PokemonEdit;