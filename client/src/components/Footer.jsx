import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} PowerUp. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
