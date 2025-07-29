import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"/>
  </svg>
);

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/', id: 1 },
    { name: 'Gyms', path: '/gyms', id: 2 },
    { name: 'Experience', path: '/', id: 3 },
    { name: 'About', path: '/', id: 4 },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    }
    setIsScrolled(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        const parsedUser = JSON.parse(loggedInUser);
        if (parsedUser?.name) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { name: "Demo User", email: "user@example.com" };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = { name: "Demo User", email: "user@example.com" };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
        
        {/* Logo */}
        <Link to='/'>
          <img src={assets.bayam} alt="logo" className={`h-16 w-25 ${isScrolled && "opacity-80"}`} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.id} 
              to={link.path} 
              className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}
            >
              {link.name}
              <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
            </Link>
          ))}
          <button 
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all`} 
            onClick={() => navigate('/owner')}
          >
            Dashboard
          </button>
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <img src={assets.searchIcon} alt="search" className={`${isScrolled && 'invert'} h-7 transition-all duration-500`} />

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                  {getUserInitial()}
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <button 
                  onClick={() => navigate('/my-booking')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <BookIcon className="mr-2" />
                  My Booking
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          {user && (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
              {getUserInitial()}
            </div>
          )}
          <img 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            src={assets.menuIcon} 
            alt="menu" 
            className={`${isScrolled && 'invert'} h-4`} 
          />
        </div>

        {/* Mobile Menu */}
        <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
            <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
          </button>

          {navLinks.map((link) => (
            <Link 
              key={link.id} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-black transition"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <button 
                className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all" 
                onClick={() => {
                  navigate('/owner');
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </button>
              <button 
                className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all" 
                onClick={() => {
                  navigate('/my-booking');
                  setIsMenuOpen(false);
                }}
              >
                My Booking
              </button>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                setShowAuthModal(true);
                setIsMenuOpen(false);
              }} 
              className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Semi-transparent overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl overflow-hidden w-full max-w-md z-10 shadow-xl">
            {/* Decorative header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-center">
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h2>
              <p className="text-gray-300 mt-1">
                {isLogin ? 'Login to your account' : 'Create a new account'}
              </p>
            </div>
            
            <form onSubmit={isLogin ? handleLogin : handleSignup} className="p-6 space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  {/* <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Forgot password?
                  </a> */}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg transition font-medium mt-2 shadow-md"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <img src="https://www.svgrepo.com/show/503338/facebook.svg" alt="Facebook" className="h-5 w-5 mr-2" />
                  Facebook
                </button>
              </div>
            </form>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gray-600 hover:text-black transition font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <button 
              onClick={() => setShowAuthModal(false)} 
              className="absolute top-4 right-4 text-white hover:text-gray-200 p-1 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;