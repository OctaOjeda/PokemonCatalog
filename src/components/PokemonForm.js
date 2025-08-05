import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PokemonForm = ({
  pokemonData,
  types,
  onSubmit,
  buttonLabel,
  message,
  onCancel,
}) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    image: Yup.string()
      .url('Must be a valid URL')
      .required('Image URL is required'),
    type: Yup.string()
      .required('Type 1 is required'),
    type2: Yup.string()
      .test('different-types', 'Type 1 and Type 2 cannot be the same', function(value) {
        if (!value) return true; // type2 is optional
        return value !== this.parent.type;
      })
  });

  const handleFormSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // Create a synthetic event-like object for compatibility
      const syntheticEvent = {
        preventDefault: () => {},
        target: { 
          elements: Object.entries(values).reduce((acc, [key, value]) => {
            acc[key] = { value };
            return acc;
          }, {})
        }
      };
      
      await onSubmit(syntheticEvent, values);
    } catch (error) {
      if (error.response?.data?.message) {
        setFieldError('general', error.response.data.message);
      } else {
        setFieldError('general', 'An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={pokemonData}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, errors, values, setFieldValue }) => (
          <Form className="space-y-4">
            {errors.general && (
              <div className="text-red-500 text-sm mb-2">{errors.general}</div>
            )}

            <div>
              <label className="block mb-1 font-semibold" htmlFor="name">
                Name
              </label>
              <Field
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
                id="name"
                name="name"
                placeholder="Enter Pokémon name"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="image">
                Image URL
              </label>
              <Field
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500"
                id="image"
                name="image"
                placeholder="Enter image URL"
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-semibold" htmlFor="type">
                  Type 1
                </label>
                <Field
                  as="select"
                  id="type"
                  name="type"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
                >
                  <option value="">Select type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="type" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="flex-1">
                <label className="block mb-1 font-semibold" htmlFor="type2">
                  Type 2
                </label>
                <Field
                  as="select"
                  id="type2"
                  name="type2"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-purple-500 capitalize"
                >
                  <option value="">Select type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="type2" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="isLegendary"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  onChange={(e) => {
                    setFieldValue('isLegendary', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('isNormal', false);
                    }
                  }}
                />
                <span>Legendary Pokémon</span>
              </label>

              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="isNormal"
                  className="form-checkbox h-5 w-5 text-purple-600"
                  onChange={(e) => {
                    setFieldValue('isNormal', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('isLegendary', false);
                    }
                  }}
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
                disabled={isSubmitting}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : buttonLabel}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {message && (
        <p className="text-green-600 font-medium mt-4 text-center">{message}</p>
      )}
    </>
  );
};

export default PokemonForm;