import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/959412.png'; // Path to your logo image

// Reusable Navigation Links Component
const NavigationLinks = ({ isLoggedIn, handleLogout, setIsOpen }) => {
  return isLoggedIn ? (
    <>
      <Link
        to="/"
        className="block text-white hover:text-yellow-300 transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Exercise
      </Link>
      <Link
        to="/food"
        className="block text-white hover:text-yellow-300 transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Food
      </Link>
      <Link
        to="/competition"
        className="block text-white hover:text-yellow-300 transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Competition
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left text-white hover:text-yellow-300"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="block text-white hover:text-yellow-300 transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="block text-white hover:text-yellow-300 transition-all duration-300"
        onClick={() => setIsOpen(false)}
      >
        Signup
      </Link>
    </>
  );
};

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State to track mobile menu

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    setIsLoggedIn(false); // Update the login state
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Website Title */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Exercise Simulator Logo"
            className="w-8 h-8 filter dark:invert"
          />
          <h2 className="text-lg font-bold">
            <Link to="/" className="hover:underline transition-all duration-300">
              PowerUp
            </Link>
          </h2>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavigationLinks
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            setIsOpen={setIsOpen}
          />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-blue-700 p-4 mt-2 space-y-3 rounded-lg">
          <NavigationLinks
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            setIsOpen={setIsOpen}
          />
        </nav>
      )}
    </header>
  );
}

export default Navbar;
