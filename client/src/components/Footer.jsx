import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base font-bold">
          &copy; {new Date().getFullYear()} Power<span className="text-yellow-400">Up</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
