import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUser();

  const validationSchema = Yup.object({
    identifier: Yup.string()
      .min(3, 'Email/Username must be at least 3 characters')
      .required('Email/Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const initialValues = {
    identifier: '',
    password: ''
  };

  const loginUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', userData);
      console.log('User logged:', response.data);
      setUserInfo(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data))
      navigate('/pokemon-catalog');
    } catch (error) {
      console.error('Error logging in user:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      console.log("handleSubmit");
      console.log(values);
      await loginUser(values);
    } catch (error) {
      if (error.response?.data?.message) {
        setFieldError('general', error.response.data.message);
      } else {
        setFieldError('general', 'Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border border-gray-400 p-8 rounded-md w-full max-w-md shadow-md mt-[-40px]">
        <h2 className="text-3xl font-bold text-purple-500 mb-4">Login</h2>

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

              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  Email/Username
                </label>
                <Field
                  type="text"
                  id="identifier"
                  name="identifier"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Enter email or username"
                />
                <ErrorMessage name="identifier" component="div" className="text-red-500 text-xs mt-1" />
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
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

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