import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BarChart3, 
  Dumbbell, 
  Users, 
  CreditCard, 
  Plus,
  TrendingUp,
  Star,
  MapPin,
  Settings,
  Eye,
  Calendar
} from 'lucide-react'
import AddGym from './AddGym'
import GymOwnerBookings from './GymOwnerBookings'

const GymOwnerDashboard = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [gyms, setGyms] = useState([])
  const [stats, setStats] = useState({
    totalGyms: 0,
    totalMembers: 0,
    totalRevenue: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOwnerGyms()
  }, [])

  const fetchOwnerGyms = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/gyms/owner/my-gyms')
      
      // Check if response has data
      const gymsData = response.data?.gyms || response.data || []
      console.log('Gyms data:', gymsData)
      setGyms(gymsData)
      
      // Calculate stats with safe access
      const totalGyms = gymsData.length || 0
      const totalMembers = gymsData.reduce((sum, gym) => sum + (gym.memberships?.length || 0), 0)
      const totalRevenue = gymsData.reduce((sum, gym) => 
        sum + (gym.memberships?.reduce((memberSum, member) => memberSum + parseFloat(member.price || 0), 0) || 0), 0
      )
      const averageRating = totalGyms > 0 
        ? gymsData.reduce((sum, gym) => sum + (gym.rating || 0), 0) / totalGyms 
        : 0

      setStats({
        totalGyms,
        totalMembers,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      })
    } catch (error) {
      console.error('Error fetching owner gyms:', error)
      // Set default values on error
      setGyms([])
      setStats({
        totalGyms: 0,
        totalMembers: 0,
        totalRevenue: 0,
        averageRating: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const sidebarItems = [
    { name: 'Dashboard', path: '/gym-owner', icon: BarChart3 },
    { name: 'My Gyms', path: '/gym-owner/gyms', icon: Dumbbell },
    { name: 'Add New Gym', path: '/gym-owner/add-gym', icon: Plus },
    { name: 'Bookings', path: '/gym-owner/bookings', icon: Calendar },
    { name: 'Members', path: '/gym-owner/members', icon: Users },
    { name: 'Settings', path: '/gym-owner/settings', icon: Settings }
  ]

  const statsCards = [
    {
      title: 'My Gyms',
      value: stats.totalGyms,
      icon: Dumbbell,
      color: 'bg-blue-500',
      change: 'Total registered'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-green-500',
      change: 'Active members'
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: CreditCard,
      color: 'bg-purple-500',
      change: 'From memberships'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating,
      icon: Star,
      color: 'bg-orange-500',
      change: 'Out of 5'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gym Owner</h2>
          <p className="text-sm text-gray-600 mb-8">{user?.name}</p>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gym Owner Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage your gyms and members
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">
                      {stat.change}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Gyms List */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Gyms
                  </h3>
                  <Link
                    to="/gym-owner/add-gym"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Gym</span>
                  </Link>
                </div>

                {gyms.length === 0 ? (
                  <div className="text-center py-12">
                    <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Gyms Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add your first gym to start getting members
                    </p>
                    <Link to="/gym-owner/add-gym" className="btn-primary">
                      Add Gym
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map((gym, index) => (
                      <motion.div
                        key={gym.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={gym.images?.[0] ? `http://localhost:8000${gym.images[0]}` : 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={gym.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
                              e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400';
                            }}
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            {gym.isBoosted && (
                              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                                Boosted
                              </span>
                            )}
                            {gym.isVerified && (
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {gym.name}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{gym.city}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm">{gym.rating || 0}</span>
                            </div>
                            <span className="text-primary-600 font-semibold">
                              {formatPrice(gym.monthlyPrice)}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/gym/${gym.id}`}
                              className="flex-1 btn-outline text-center text-sm py-2"
                            >
                              <Eye className="h-4 w-4 inline mr-1" />
                              View
                            </Link>
                            <button className="flex-1 btn-primary text-sm py-2">
                              Edit
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          } />
          <Route path="/gyms" element={<div>My Gyms Management</div>} />
          <Route path="/add-gym" element={<AddGym />} />
          <Route path="/bookings" element={<GymOwnerBookings />} />
          <Route path="/members" element={<div>Members Management</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default GymOwnerDashboard