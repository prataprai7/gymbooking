import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  Calendar, 
  CreditCard, 
  MapPin,
  Dumbbell,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeMemberships: 0,
    totalSpent: 0,
    gymsVisited: 0
  })

  // Redirect based on user role
  useEffect(() => {
    console.log('User role:', user?.role)
    if (user?.role === 'gym_owner') {
      console.log('Redirecting gym owner to gym-owner dashboard')
      navigate('/gym-owner/dashboard')
    } else if (user?.role === 'admin') {
      console.log('Redirecting admin to admin dashboard')
      navigate('/admin/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/memberships/user')
      setMemberships(response.data.memberships || [])
      
      // Calculate stats
      const active = (response.data.memberships || []).filter(m => m.isActive).length
      const total = (response.data.memberships || []).reduce((sum, m) => sum + parseFloat(m.price || 0), 0)
      const gyms = new Set((response.data.memberships || []).map(m => m.gymId)).size
      
      setStats({
        activeMemberships: active,
        totalSpent: total,
        gymsVisited: gyms
      })
    } catch (error) {
      console.error('Error fetching memberships:', error)
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#f3f3f3] text-[#242424] border-l-4 border-[#6c6c6c]'
      case 'expired': return 'bg-[#f3f3f3] text-[#6c6c6c]'
      case 'pending': return 'bg-[#f3f3f3] text-[#484848]'
      case 'cancelled': return 'bg-[#f3f3f3] text-[#6c6c6c]'
      default: return 'bg-[#f3f3f3] text-[#6c6c6c]'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'expired': return 'Expired'
      case 'pending': return 'Pending'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const isExpiringSoon = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#242424]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#242424] mb-2"
          >
            Welcome back, {user?.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#6c6c6c]"
          >
            Your fitness dashboard overview
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-[#f3f3f3] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-[#f3f3f3] rounded-full">
                <CheckCircle className="h-6 w-6 text-[#242424]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6c6c6c]">Active Memberships</p>
                <p className="text-2xl font-bold text-[#242424]">{stats.activeMemberships}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-[#f3f3f3] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-[#f3f3f3] rounded-full">
                <CreditCard className="h-6 w-6 text-[#242424]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6c6c6c]">Total Invested</p>
                <p className="text-2xl font-bold text-[#242424]">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-[#f3f3f3] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-[#f3f3f3] rounded-full">
                <Dumbbell className="h-6 w-6 text-[#242424]" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#6c6c6c]">Gyms Visited</p>
                <p className="text-2xl font-bold text-[#242424]">{stats.gymsVisited}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Memberships */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#242424]">Active Memberships</h2>
              <div className="bg-[#f3f3f3] text-[#484848] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {memberships.filter(m => m.status === 'active').length} Active
              </div>
            </div>
            
            <div className="space-y-4">
              {memberships.filter(m => m.status === 'active').map((membership) => (
                <motion.div
                  key={membership.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-white rounded-lg shadow-sm p-6 border border-[#f3f3f3] hover:shadow-md transition-shadow ${getStatusColor(membership.status)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#242424]">
                        {membership.gym?.name}
                      </h3>
                      <div className="flex items-center text-[#6c6c6c] mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{membership.gym?.city}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${membership.status === 'active' ? 'bg-[#242424] text-white' : 'bg-[#f3f3f3] text-[#6c6c6c]'}`}>
                      {getStatusText(membership.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#6c6c6c]">Plan Type</p>
                      <p className="font-medium text-[#242424]">
                        {membership.type === 'monthly' ? 'Monthly' : 'Annual'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#6c6c6c]">Price</p>
                      <p className="font-medium text-[#242424]">{formatPrice(membership.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-[#6c6c6c]">Expiry Date: </span>
                      <span className={`font-medium ${
                        isExpiringSoon(membership.endDate) ? 'text-[#242424]' : 'text-[#242424]'
                      }`}>
                        {new Date(membership.endDate).toLocaleDateString('ne-NP')}
                      </span>
                    </div>
                    {isExpiringSoon(membership.endDate) && (
                      <div className="flex items-center bg-[#f3f3f3] text-[#242424] px-2 py-1 rounded-full">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Expiring soon</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {memberships.filter(m => m.status === 'active').length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#f3f3f3]">
                  <Dumbbell className="h-16 w-16 text-[#6c6c6c] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#242424] mb-2">
                    No Active Memberships
                  </h3>
                  <p className="text-[#6c6c6c] mb-6 max-w-md mx-auto">
                    You currently don't have any active gym memberships
                  </p>
                  <a 
                    href="/gyms" 
                    className="inline-flex items-center px-4 py-2 bg-[#242424] text-white font-medium rounded-md hover:bg-[#484848] transition-colors"
                  >
                    Browse Gyms
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#242424]">Recent Activity</h2>
              <div className="bg-[#f3f3f3] text-[#484848] px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last 5 Activities
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-[#f3f3f3]">
              <div className="p-6">
                <div className="space-y-4">
                  {memberships.slice(0, 5).map((membership) => (
                    <motion.div 
                      key={membership.id}
                      whileHover={{ backgroundColor: '#f3f3f3' }}
                      className="flex items-center space-x-4 p-3 rounded-md transition-colors"
                    >
                      <div className={`p-2 rounded-full ${membership.status === 'active' ? 'bg-[#242424] text-white' : 'bg-[#f3f3f3] text-[#6c6c6c]'}`}>
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#242424]">
                          {membership.gym?.name} membership
                        </p>
                        <p className="text-sm text-[#6c6c6c]">
                          {new Date(membership.createdAt).toLocaleDateString('ne-NP')}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#6c6c6c]" />
                    </motion.div>
                  ))}

                  {memberships.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="h-16 w-16 text-[#6c6c6c] mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#242424] mb-2">
                        No Activity Found
                      </h3>
                      <p className="text-[#6c6c6c]">
                        Your activity will appear here once you have memberships
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="mt-8 bg-[#242424] rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-start">
                <div className="mr-4">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Membership Summary</h3>
                  <p className="text-[#f3f3f3] mb-4 text-sm">
                    You have {stats.activeMemberships} active memberships across {stats.gymsVisited} different gyms.
                  </p>
                  <div className="text-xs text-[#6c6c6c]">Last updated: {new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Memberships */}
        {memberships.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-[#242424] mb-6">All Memberships</h2>
            <div className="bg-white rounded-lg shadow-sm border border-[#f3f3f3] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#f3f3f3]">
                  <thead className="bg-[#f3f3f3]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#484848] uppercase tracking-wider">
                        Gym
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#484848] uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#484848] uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#484848] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#484848] uppercase tracking-wider">
                        End Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f3f3f3]">
                    {memberships.map((membership) => (
                      <tr key={membership.id} className="hover:bg-[#f3f3f3] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#f3f3f3] rounded-full flex items-center justify-center">
                              <Dumbbell className="h-4 w-4 text-[#242424]" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#242424]">
                                {membership.gym?.name}
                              </div>
                              <div className="text-sm text-[#6c6c6c]">
                                {membership.gym?.city}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#242424] font-medium">
                            {membership.type === 'monthly' ? 'Monthly' : 'Annual'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#242424]">
                          {formatPrice(membership.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            membership.status === 'active' ? 'bg-[#242424] text-white' : 'bg-[#f3f3f3] text-[#6c6c6c]'
                          }`}>
                            {getStatusText(membership.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#242424]">
                          {new Date(membership.endDate).toLocaleDateString('ne-NP')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard