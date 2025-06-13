//import logo from './logo.svg';
//import './App.css';//
// import List from './List';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import PokemonList from './components/PokemonList';
import Login from './components/Login'; // ← Nuevo import
import Footer from './components/Footer';
import Register from './components/Register';
import PokemonCatalog from './components/pokemon-catalog';

function App() {
  return (
    <Router>
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemons" element={<PokemonList />} />
          <Route path="/login" element={<Login />} /> {/* ← Ruta nueva */}
          <Route path="/register" element={<Register />} />
          <Route path="/pokemon-catalog" element={<PokemonCatalog />} />
        </Routes>
      </main>
    </div>
      <Footer />
    </Router>
  );
}

export default App;

