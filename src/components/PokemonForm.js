import React from 'react';

const PokemonForm = ({
  pokemonData,
  types,
  onChange,
  onSubmit,
  buttonLabel,
  message,
  onCancel,
}) => {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">
            Name
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
            id="name"
            name="name"
            value={pokemonData.name}
            onChange={onChange}
            placeholder="Enter Pokémon name"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="image">
            Image URL
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500"
            id="image"
            name="image"
            value={pokemonData.image}
            onChange={onChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold" htmlFor="type1">
              Type 1
            </label>
            <select
              id="type1"
              name="type"
              value={pokemonData.type}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
              required
            >
              <option value="">Select type</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-semibold" htmlFor="type2">
              Type 2
            </label>
            <select
              id="type2"
              name="type2"
              value={pokemonData.type2}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
            >
              <option value="">Select type </option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLegendary"
              checked={pokemonData.isLegendary}
              onChange={onChange}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span>Legendary Pokémon</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNormal"
              checked={pokemonData.isNormal}
              onChange={onChange}
              className="form-checkbox h-5 w-5 text-purple-600"
            />
            <span>Normal Pokémon</span>
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            {buttonLabel}
          </button>
        </div>
      </form>

      {message && (
        <p className="text-green-600 font-medium mt-4 text-center">{message}</p>
      )}
    </>
  );
};

export default PokemonForm;