import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button className="mr-4 md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="text-xl font-bold">PICU Score App</Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <Link to="/settings" className="hover:text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="bg-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto py-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                location.pathname === '/' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/patients" 
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                location.pathname.includes('/patients') ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              Patients
            </Link>
            <Link 
              to="/help" 
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                location.pathname === '/help' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              Help
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
