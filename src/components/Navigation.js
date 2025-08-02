import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navigation = () => {
  const { userInfo, setUserInfo } = useUser();
  
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between border-b border-black">
      <div className="flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pokemon Logo"
          className="w-10 h-10"
        />
        <span className="text-purple-600 text-xl font-bold">PokéApp</span>
      </div>

      <div className="hidden md:flex gap-6 text-purple-500 font-medium">
        <Link to="/" className="hover:text-purple-700 transition">Home</Link>
        <Link to="/pokemon-catalog" className="hover:text-purple-700 transition">Pokemon Catalog</Link>
        <Link to="/pokemons" className="hover:text-purple-700 transition">Pokemon List</Link>
      </div>

      <div className="flex gap-3">
        { !userInfo && <button className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-100 transition">
          <Link to="/login">Login</Link>
        </button>
        }
        { userInfo && <button onClick={() => { localStorage.removeItem("userInfo"); setUserInfo(undefined) }} className="px-4 py-1 border border-purple-500 text-purple-500 rounded hover:bg-purple-100 transition">
          Logout
        </button>
        }
        <Link
          to="/register"
          className="px-4 py-1 bg-purple-500 text-black rounded hover:bg-purple-600 transition flex items-center justify-center"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;