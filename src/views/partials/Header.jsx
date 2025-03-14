import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import AuthContext from '../../context/AuthContext';

function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");
  const [isOpen, setIsOpen] = useState(false);
  
  let user_id;
  if (token) {
    const decoded = jwtDecode(token);
    user_id = decoded.user_id;
  }

  return (
    <header className="bg-white text-white border-b border-gray-700 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="readify_logo1.png" 
                alt="Readify Logo" 
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navigation */}
          <nav className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0`}>
            <Link 
              to="/" 
              className="block md:inline-block text-black hover:text-blue-600 transition-colors duration-200 mb-2 md:mb-0"
            >
              Home
            </Link>

            {token === null && (
              <>
                <Link 
                  to="/login" 
                  className="block md:inline-block text-black hover:text-blue-600  transition-colors duration-200 mb-2 md:mb-0"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block md:inline-block text-black hover:text-blue-600  transition-colors duration-200 mb-2 md:mb-0"
                >
                  Register
                </Link>
              </>
            )}

            {token !== null && (
              <>
                <Link 
                  to="/profile" 
                  className="block md:inline-block text-black hover:text-blue-600  transition-colors duration-200 mb-2 md:mb-0"
                >
                  Profile
                </Link>
                <button
                  onClick={logoutUser}
                  className="block md:inline-block text-black hover:text-blue-600  transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;