import React, { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import logo from "../assets/guruchanra-logo-header.png";

export default function Services() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-bar-color text-white relative z-20 flex justify-between items-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative z-40">
        <h1 className="text-xl font-bold">
          <a href="/">
            <img
              src={logo}
              alt="Guru Chandra Gold Finance logo"
              className="h-16 md:h-16 lg:h-20 w-auto"
            />
          </a>
        </h1>

        {/* Desktop Navigation with Animated Underline */}
        <nav className="hidden md:flex space-x-6">
          {["/", "/services", "/about", "/contact"].map((path, index) => {
            const names = ["Home", "Services", "About", "Contact"];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `relative group transition duration-200 ${
                    isActive
                      ? "text-white underline underline-offset-8"
                      : "text-white"
                  }`
                }
              >
                {names[index]}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            );
          })}
        </nav>

        {/* Hamburger Button */}
        <button
          className="md:hidden cursor-pointer fixed right-4 flex justify-center items-center w-10 h-10 bg-[#001220] rounded z-50 shadow-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-white" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen  bg-[#183a4a] bg-opacity-95 flex flex-col items-center justify-center space-y-8 text-white text-2xl z-40 transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-8 text-white"
                : "hover:text-white"
            }
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-8 text-white"
                : "hover:text-white"
            }
            onClick={() => setMenuOpen(false)}
          >
            Services
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-8 text-white"
                : "hover:text-white"
            }
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "underline underline-offset-8 text-white"
                : "hover:text-white"
            }
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
}
