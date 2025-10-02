import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export default function Navbar({ setIsOpen }) {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Left side: Mobile Hamburger */}
      <div className="flex items-center">
        <button
          className="md:hidden text-2xl mr-4"
          onClick={() => setIsOpen(true)} // Open sidebar
        >
          <FaBars />
        </button>

      </div>

      {/* Right side: Links */}
      <ul className="hidden md:flex space-x-8">
        <li><Link to="/Accueil">Accueil</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}
