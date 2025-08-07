import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PokemonForm from './PokemonForm';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../constants';

const PokemonEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUser();

  const [pokemonData, setPokemonData] = useState({
    name: '',
    image: '',
    type: '',
    type2: '',
    level: '',
    isLegendary: false,
    isNormal: true,
  });

  const [types, setTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [pokemonNotFound, setPokemonNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect to login if user is not authenticated (but only after loading is complete)
  useEffect(() => {
    if (!userInfo && !loading) {
      navigate('/login');
      return;
    }
  }, [userInfo, navigate, loading]);

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
    try {
      setLoading(true);
      const rsp = await axios.get(`${API_BASE_URL}/pokemons/${id}`);
      console.log(rsp);
      
      // Transform API data to match form structure
      const transformedData = {
        ...rsp.data,
        isLegendary: rsp.data.state === 'Legendary',
        isNormal: rsp.data.state === 'Normal'
      };
      
      setPokemonData(transformedData);
      setPokemonNotFound(false);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      setPokemonNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  const editPokemon = async (payload) => {
    const rsp = await axios.put(
        `${API_BASE_URL}/pokemons/${id}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      level: data.level ? parseInt(data.level, 10) : undefined,
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

  // Don't render anything if user is not authenticated (but allow loading and not found states to show first)
  if (!userInfo && !loading && !pokemonNotFound) {
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

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">Loading...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    );
  }

  // Show not found page
  if (pokemonNotFound) {
    return (
      <div className="max-w-xl mx-auto mt-12 px-6 py-8 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-red-600">Pokémon Not Found</h2>
        <p className="text-gray-600 mb-6">
          The Pokémon with ID {id} doesn't exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/pokemons')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
          >
            Back to Pokémon List
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          >
            Go to Home
          </button>
        </div>
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