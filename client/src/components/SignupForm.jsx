import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const app_link = "https://exercise-simulator-app-backend.vercel.app" // localhost:5000

  // Disable the back button once the component is loaded
  useEffect(() => {
    const preventBackNavigation = (e) => {
      // Prevent the user from going back in the history
      e.preventDefault();
      e.returnValue = ''; // Standard for most browsers
    };

    // Disable back button by pushing state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      // Re-enable the back button once the component is unmounted
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${app_link}/api/users/signup`, { name, email, password });

      setSuccessMessage("Signup successful! Please log in.");
      setError('');

      // Redirect to login page after signup
      setTimeout(() => {
        navigate('/login'); // User must log in manually
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800">Sign Up</h2>

        {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
