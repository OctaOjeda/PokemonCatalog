import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border border-gray-400 p-8 rounded-md w-full max-w-md shadow-md mt-[-40px]">
        {/* Título más grande */}
        <h2 className="text-3xl font-bold text-purple-500 mb-4">Login</h2>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email / Nombre de usuario
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="Ingresá tu email o usuario"
            />
          </div>

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

          <button
            type="submit"
            className="bg-purple-500 text-black font-semibold py-2 rounded hover:bg-purple-400 transition"
          >
            Login
          </button>
        </form>

        {/* Mensaje con link a Register */}
        <p className="mt-4 text-sm text-gray-600">
          Don't have account,&nbsp;
          <Link to="/register" className="text-purple-500 underline decoration-purple-500 hover:decoration-purple-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;