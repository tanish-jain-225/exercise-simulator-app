import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Excersise from "./components/Excersise";
import Food from "./components/Food";
import Competition from "./components/Competition"; // Import Competition component
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
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bnV0cml0aW9ufGVufDB8fDB8fHww"
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
      case "/competition":
        setBackgroundImage(
          "https://images.unsplash.com/photo-1590764258299-0f91fa7f95e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcGV0aXRpb258ZW58MHx8MHx8fDA%3D"
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
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={isLoggedIn ? <Excersise /> : <Navigate to="/login" />}
          />
          <Route
            path="/food"
            element={isLoggedIn ? <Food /> : <Navigate to="/login" />}
          />
          <Route
            path="/competition"
            element={isLoggedIn ? <Competition /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />{" "}
          {/* Redirect all unknown routes to login */}
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
