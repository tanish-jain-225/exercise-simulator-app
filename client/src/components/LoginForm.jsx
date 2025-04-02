import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const app_link =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://exercise-simulator-app-backend.vercel.app";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when login is triggered
    setError(""); // Reset error message

    try {
      const response = await axios.post(`${app_link}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store JWT token
      setIsLoggedIn(true); // Update navbar state

      navigate("/"); // Redirect to Exercise page
    } catch (err) {
      setError("Invalid email or password"); // Show error message if login fails
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg m-2">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Login
        </h2>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
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
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Logging in..." : "Login"} {/* Show loading text */}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Do not have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign-Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
