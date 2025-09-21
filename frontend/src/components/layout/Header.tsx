import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaCar } from 'react-icons/fa';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="glass border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:from-blue-300 hover:to-blue-500 transition-all duration-300">
              <FaCar size={28} className="text-blue-500" />
              <span>Vehicle MS</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-800/50"
            >
              Vehicles
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-800/50"
              >
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-300">
                  Welcome, <span className="text-blue-400 font-medium">{user?.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/register"
                  className="text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-800/50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="btn-primary px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;