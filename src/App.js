import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import Home from './components/Home';
import PokemonList from './components/PokemonList';
import PokemonCatalog from './components/PokemonCatalog';
import PokemonEdit from './components/PokemonEdit';
import CreatePokemon from './components/PokemonCreate';
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import axios from 'axios';

function App() {
  const [pokemons, setPokemons] = useState([]);

  // useEffect(() => {

  //   const fetchPokemons = async () => {
  //     const res = await axios.get('http://localhost:3001/api/pokemons');
  //     // console.log(res.data);
  //     setPokemons(res.data);
  //   };

  //   fetchPokemons();
  // }, []);


  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow px-6 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/pokemons"
                element={<PokemonList />}
              />
              <Route
                path="/pokemon-catalog"
                element={<PokemonCatalog />}
              />
              <Route path="/edit/:id" element={<PokemonEdit />} />
              <Route path="/create" element={<CreatePokemon />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/pokemons" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
