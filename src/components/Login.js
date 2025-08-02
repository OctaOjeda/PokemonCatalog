import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();
  const [user, setUser] = useState({
      identifier: "",
      password: ""
  });

  const loginUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        identifier: user.identifier,
        password: user.password
      });
  
      // mostrar mensaje de exito si guarda bien
      console.log('User logged:', response.data);
      setUserInfo(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data))
      // const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      // localStorage.removeItem("userInfo");
      navigate('/pokemon-catalog');
    } catch (error) {
      // mostrar mensaje de error si falla
      console.error('Error logging in user:', error.response?.data || error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(user)
    if (!user.identifier || !user.password) {
      alert('All fields are required');
      return;
    }  

    loginUser();

  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border border-gray-400 p-8 rounded-md w-full max-w-md shadow-md mt-[-40px]">
        {/* Título más grande */}
        <h2 className="text-3xl font-bold text-purple-500 mb-4">Login</h2>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email/Username
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter email or username"
              value={user.identifier}
              onChange={(e) => setUser({ ...user, identifier: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-black font-semibold py-2 rounded hover:bg-purple-400 transition"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>

        {/* Mensaje con link a Register */}
        <p className="mt-4 text-sm text-gray-600">
          Don't have account? &nbsp;
          <Link to="/register" className="text-purple-500 underline decoration-purple-500 hover:decoration-purple-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;