import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { register } from 'swiper/element';

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    lastname: "",
    email: "",
    username: "",
    password: ""
  });

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        password: user.password
      });
  
      // mostrar mensaje de exito si guarda bien
      console.log('User registered:', response.data);
      navigate('/login');  
    } catch (error) {
      // mostrar mensaje de error si falla
      console.error('Error registering user:', error.response?.data || error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit")

    console.log(user)
    if (!user.name || !user.lastname || !user.email || !user.username || !user.password) {
      alert('All fields are required');
      return;
    }

    // llamar al servicio para guardar
    registerUser();

  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border border-gray-400 p-8 rounded-md w-full max-w-md shadow-md mt-[-40px]">
        {/* Título */}
        <h2 className="text-3xl font-bold text-purple-500 mb-6">Register</h2>

        <form className="flex flex-col gap-4">
          {/* Nombre y Apellido lado a lado */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Lastname
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Enter lastname"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              />
            </div>
          </div>

          {/* Nombre de usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Enter email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          {/* Contraseña */}
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

          {/* Botón Register */}
          <button
            type="submit"
            className="bg-purple-500 text-black font-semibold py-2 rounded hover:bg-purple-400 transition"
            onClick={handleSubmit}
          >
            Register
          </button>
        </form>

        {/* Mensaje con link a Login subrayado púrpura */}
        <p className="mt-4 text-sm text-gray-600">
          Have an account?{' '}
          <Link
            to="/login"
            className="text-purple-500 underline decoration-purple-500 hover:decoration-purple-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;