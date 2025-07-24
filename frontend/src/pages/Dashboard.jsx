import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Star, 
  TrendingUp,
  Users,
  Dumbbell,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeMemberships: 0,
    totalSpent: 0,
    gymsVisited: 0
  })

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/memberships')
      setMemberships(response.data.data)
      
      // Calculate stats
      const active = response.data.data.filter(m => m.status === 'active').length
      const total = response.data.data.reduce((sum, m) => sum + parseFloat(m.price), 0)
      const gyms = new Set(response.data.data.map(m => m.gymId)).size
      
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
      case 'active': return 'text-green-600 bg-green-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'सक्रिय'
      case 'expired': return 'समाप्त'
      case 'pending': return 'पेन्डिङ'
      case 'cancelled': return 'रद्द'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            स्वागत छ, {user?.name}!
          </h1>
          <p className="text-gray-600">
            तपाईंको फिटनेस यात्राको अवलोकन
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">सक्रिय सदस्यता</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMemberships}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">कुल खर्च</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full">
                <Dumbbell className="h-8 w-8 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">जिमहरू</p>
                <p className="text-2xl font-bold text-gray-900">{stats.gymsVisited}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Memberships */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">सक्रिय सदस्यताहरू</h2>
            <div className="space-y-4">
              {memberships.filter(m => m.status === 'active').map((membership) => (
                <motion.div
                  key={membership.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {membership.gym?.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{membership.gym?.city}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(membership.status)}`}>
                      {getStatusText(membership.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">प्रकार</p>
                      <p className="font-medium">
                        {membership.type === 'monthly' ? 'मासिक' : 'वार्षिक'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">मूल्य</p>
                      <p className="font-medium">{formatPrice(membership.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">समाप्त हुने मिति: </span>
                      <span className={`font-medium ${
                        isExpiringSoon(membership.endDate) ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {new Date(membership.endDate).toLocaleDateString('ne-NP')}
                      </span>
                    </div>
                    {isExpiringSoon(membership.endDate) && (
                      <div className="flex items-center text-orange-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">छिट्टै समाप्त हुँदै</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {memberships.filter(m => m.status === 'active').length === 0 && (
                <div className="text-center py-8">
                  <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    कुनै सक्रिय सदस्यता छैन
                  </h3>
                  <p className="text-gray-600 mb-4">
                    नयाँ जिम सदस्यता लिनुहोस् र आफ्नो फिटनेस यात्रा सुरु गर्नुहोस्
                  </p>
                  <a href="/gyms" className="btn-primary">
                    जिम खोज्नुहोस्
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">हालैका गतिविधिहरू</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                {memberships.slice(0, 5).map((membership) => (
                  <div key={membership.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="p-2 bg-primary-100 rounded-full">
                      <Calendar className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {membership.gym?.name} को सदस्यता
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(membership.createdAt).toLocaleDateString('ne-NP')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                      {getStatusText(membership.status)}
                    </span>
                  </div>
                ))}

                {memberships.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">कुनै गतिविधि छैन</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Memberships */}
        {memberships.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">सबै सदस्यताहरू</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        जिम
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        प्रकार
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        मूल्य
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        स्थिति
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        समाप्त मिति
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {memberships.map((membership) => (
                      <tr key={membership.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {membership.gym?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {membership.gym?.city}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {membership.type === 'monthly' ? 'मासिक' : 'वार्षिक'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(membership.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                            {getStatusText(membership.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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