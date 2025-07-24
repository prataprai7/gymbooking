import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { 
  BarChart3, 
  Users, 
  Dumbbell, 
  CreditCard, 
  TrendingUp,
  Settings,
  Shield,
  Star,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'

const AdminDashboard = () => {
  const location = useLocation()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGymOwners: 0,
    totalGyms: 0,
    totalMemberships: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    monthly: {
      users: 0,
      memberships: 0,
      revenue: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
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
    { name: 'ड्यासबोर्ड', path: '/admin', icon: BarChart3 },
    { name: 'प्रयोगकर्ताहरू', path: '/admin/users', icon: Users },
    { name: 'जिमहरू', path: '/admin/gyms', icon: Dumbbell },
    { name: 'सदस्यताहरू', path: '/admin/memberships', icon: CreditCard },
    { name: 'सेटिङहरू', path: '/admin/settings', icon: Settings }
  ]

  const statsCards = [
    {
      title: 'कुल प्रयोगकर्ताहरू',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: `+${stats.monthly.users} यो महिना`
    },
    {
      title: 'जिम मालिकहरू',
      value: stats.totalGymOwners,
      icon: Shield,
      color: 'bg-green-500',
      change: 'सक्रिय'
    },
    {
      title: 'कुल जिमहरू',
      value: stats.totalGyms,
      icon: Dumbbell,
      color: 'bg-purple-500',
      change: 'दर्ता भएका'
    },
    {
      title: 'सक्रिय सदस्यताहरू',
      value: stats.activeMemberships,
      icon: CreditCard,
      color: 'bg-orange-500',
      change: `${stats.totalMemberships} कुल`
    },
    {
      title: 'कुल आम्दानी',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-red-500',
      change: `${formatPrice(stats.monthly.revenue)} यो महिना`
    },
    {
      title: 'मासिक वृद्धि',
      value: `+${stats.monthly.memberships}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      change: 'नयाँ सदस्यताहरू'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">एडमिन प्यानल</h2>
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
                  एडमिन ड्यासबोर्ड
                </h1>
                <p className="text-gray-600">
                  BayamBook प्लेटफर्मको सम्पूर्ण अवलोकन
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    हालैका गतिविधिहरू
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          नयाँ प्रयोगकर्ता दर्ता
                        </p>
                        <p className="text-xs text-gray-500">२ मिनेट अगाडि</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Dumbbell className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          नयाँ जिम थपियो
                        </p>
                        <p className="text-xs text-gray-500">५ मिनेट अगाडि</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          नयाँ सदस्यता
                        </p>
                        <p className="text-xs text-gray-500">१० मिनेट अगाडि</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    शीर्ष जिमहरू
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            फिटनेस पार्क काठमाडौं
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.8</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        ५० सदस्य
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Dumbbell className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            पावर हाउस जिम
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">4.6</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        ३५ सदस्य
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/users" element={<div>Users Management</div>} />
          <Route path="/gyms" element={<div>Gyms Management</div>} />
          <Route path="/memberships" element={<div>Memberships Management</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard