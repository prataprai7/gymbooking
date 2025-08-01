import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Dumbbell,
  Heart,
  BarChart3,
  Crown,
  HomeIcon,
  Calendar,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAuthenticated, isAdmin, isGymOwner } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate('/')
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin'
    if (isGymOwner) return '/gym-owner'
    return '/dashboard'
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon className="h-4 w-4" /> },
    { name: 'Gyms', path: '/gyms', icon: <Dumbbell className="h-4 w-4" /> },
    { name: 'Membership', path: '/membership', icon: <Heart className="h-4 w-4" /> },
  ]

  return (
    <nav className="bg-[#fcfcfc] shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-[#f3f3f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-[#484848] rounded-lg">
                  <Dumbbell className="h-6 w-6 text-[#f3f3f3]" />
            </div>
            <span className="text-2xl font-bold text-[#242424]">BayamBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-[#242424] bg-[#f3f3f3]'
                    : 'text-[#484848] hover:text-[#242424] hover:bg-[#f3f3f3]'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f3f3f3] transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-[#242424] rounded-full flex items-center justify-center">
                    <span className="text-[#fcfcfc] font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[#242424] font-medium">{user?.name}</span>
                  {isAdmin && <Crown className="h-4 w-4 text-[#6c6c6c]" />}
                  {isGymOwner && <BarChart3 className="h-4 w-4 text-[#6c6c6c]" />}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-[#fcfcfc] rounded-md shadow-lg border border-[#f3f3f3] py-1 z-50"
                    >
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center space-x-2 px-4 py-2 text-[#484848] hover:bg-[#f3f3f3]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-[#484848] hover:bg-[#f3f3f3]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/membership"
                        className="flex items-center space-x-2 px-4 py-2 text-[#484848] hover:bg-[#f3f3f3]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>My Memberships</span>
                      </Link>
                      <Link
                        to="/bookings"
                        className="flex items-center space-x-2 px-4 py-2 text-[#484848] hover:bg-[#f3f3f3]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>My Bookings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-[#242424] hover:bg-[#f3f3f3]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-[#484848] hover:text-[#242424] font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#242424] text-[#fcfcfc] rounded-md font-medium hover:bg-[#484848] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#484848] hover:text-[#242424] hover:bg-[#f3f3f3] transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#f3f3f3]"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'text-[#242424] bg-[#f3f3f3]'
                        : 'text-[#484848] hover:text-[#242424] hover:bg-[#f3f3f3]'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <div className="border-t border-[#f3f3f3] pt-4 mt-4">
                    <div className="px-4 py-2">
                      <p className="text-sm text-[#6c6c6c]">Logged in as</p>
                      <p className="font-medium text-[#242424]">{user?.name}</p>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center space-x-2 px-4 py-3 text-[#484848] hover:bg-[#f3f3f3] rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-3 text-[#484848] hover:bg-[#f3f3f3] rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/membership"
                      className="flex items-center space-x-2 px-4 py-3 text-[#484848] hover:bg-[#f3f3f3] rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>My Memberships</span>
                    </Link>
                    <Link
                      to="/bookings"
                      className="flex items-center space-x-2 px-4 py-3 text-[#484848] hover:bg-[#f3f3f3] rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-[#242424] hover:bg-[#f3f3f3] rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-[#f3f3f3] pt-4 mt-4 space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-[#484848] hover:bg-[#f3f3f3] rounded-md font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 bg-[#242424] text-[#fcfcfc] rounded-md font-medium text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar