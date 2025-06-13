import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
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
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Ingresá tu nombre"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="Ingresá tu apellido"
              />
            </div>
          </div>

          {/* Nombre de usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Ingresá tu nombre de usuario"
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
              placeholder="Ingresá tu email"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Ingresá tu contraseña"
            />
          </div>

          {/* Botón Register */}
          <button
            type="submit"
            className="bg-purple-500 text-black font-semibold py-2 rounded hover:bg-purple-400 transition"
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