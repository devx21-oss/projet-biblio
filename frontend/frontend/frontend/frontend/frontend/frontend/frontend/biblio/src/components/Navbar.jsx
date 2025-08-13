import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-center items-center">
      <ul className="flex space-x-8 justify-center items-center w-full max-w-md">
        <li><Link to="/Accueil">Accueil</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}
