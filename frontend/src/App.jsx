import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Gyms from './pages/Gyms'
import GymDetails from './pages/GymDetails'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import GymOwnerDashboard from './pages/gym-owner/GymOwnerDashboard'
import Membership from './pages/Membership'
import Profile from './pages/Profile'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/gyms" element={<Gyms />} />
            <Route path="/gym/:id" element={<GymDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/membership" element={
              <ProtectedRoute>
                <Membership />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Gym Owner Routes */}
            <Route path="/gym-owner/*" element={
              <ProtectedRoute role="gym_owner">
                <GymOwnerDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App