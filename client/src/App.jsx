import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Excersise from "./components/Excersise";
import Food from "./components/Food";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/LoginForm";
import Signup from "./components/SignupForm";

function AppContent({ setBackgroundImage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const location = useLocation();

  // Change background based on route
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setBackgroundImage(
          "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGV4ZXJjaXNlfGVufDB8fDB8fHww"
        );
        break;
      case "/food":
        setBackgroundImage(
          "https://images.unsplash.com/photo-1600800430120-72270592247a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Zm9vZCUyMG51dHJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D"
        );
        break;
      case "/login":
        setBackgroundImage(
          "https://images.unsplash.com/photo-1545346315-f4c47e3e1b55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGV4ZXJjaXNlJTIwZ3ltfGVufDB8fDB8fHww"
        );
        break;
      case "/signup":
        setBackgroundImage(
          "https://images.unsplash.com/photo-1483721310020-03333e577078?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGV4ZXJjaXNlJTIwZ3ltfGVufDB8fDB8fHww"
        );
        break;
      default:
        setBackgroundImage(
          "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGV4ZXJjaXNlfGVufDB8fDB8fHww"
        );
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="flex-grow">
        <Routes>
          {/* Always redirect "/" to "/login" if not logged in */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/exercise" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/exercise" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/exercise"
            element={isLoggedIn ? <Excersise /> : <Navigate to="/login" />}
          />
          <Route
            path="/food"
            element={isLoggedIn ? <Food /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const blockNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    blockNavigation();

    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
      }}
    >
      <Router>
        <AppContent setBackgroundImage={setBackgroundImage} />
      </Router>
    </div>
  );
}

export default App;
