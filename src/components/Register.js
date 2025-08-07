import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '../constants';

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    lastname: Yup.string()
      .min(2, 'Lastname must be at least 2 characters')
      .max(50, 'Lastname must be less than 50 characters')
      .required('Lastname is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
      .required('Password is required')
  });

  const initialValues = {
    name: '',
    lastname: '',
    email: '',
    username: '',
    password: ''
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      console.log('User registered:', response.data);
      navigate('/login');  
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      console.log("handleSubmit");
      console.log(values);
      await registerUser(values);
    } catch (error) {
      if (error.response?.data?.message) {
        setFieldError('general', error.response.data.message);
      } else {
        setFieldError('general', 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border border-gray-400 p-8 rounded-md w-full max-w-md shadow-md mt-[-40px]">
        <h2 className="text-3xl font-bold text-purple-500 mb-6">Register</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="flex flex-col gap-4">
              {errors.general && (
                <div className="text-red-500 text-sm mb-2">{errors.general}</div>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter name"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="flex-1">
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                    Lastname
                  </label>
                  <Field
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Enter lastname"
                  />
                  <ErrorMessage name="lastname" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter username"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-500 text-black font-semibold py-2 rounded hover:bg-purple-400 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

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