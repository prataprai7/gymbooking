import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Star, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react'

const Membership = () => {
  const { user } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    fetchMemberships()
  }, [])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/memberships/user')
      setMemberships(response.data.memberships)
    } catch (error) {
      console.error('Error fetching memberships:', error)
      toast.error('Failed to load memberships')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelMembership = async (membershipId) => {
    if (!confirm('Are you sure you want to cancel this membership?')) {
      return
    }

    try {
      setCancellingId(membershipId)
      await axios.put(`/api/memberships/user/${membershipId}/status`, { isActive: false })
      toast.success('Membership cancelled successfully')
      fetchMemberships()
    } catch (error) {
      console.error('Error cancelling membership:', error)
      toast.error('Failed to cancel membership')
    } finally {
      setCancellingId(null)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive'
  }

  const getStatusIcon = (isActive) => {
    return isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
  }

  const isExpiringSoon = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
            My Memberships
          </h1>
          <p className="text-gray-600">
            Details of all your gym memberships
          </p>
        </div>

        {memberships.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Memberships Found
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any gym memberships yet. Find a new gym to start your fitness journey.
              </p>
              <a href="/gyms" className="btn-primary">
                Find Gyms
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {memberships.map((membership, index) => (
              <motion.div
                key={membership.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {membership.gym?.name}
                        </h3>
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(membership.isActive)}`}>
                          {getStatusIcon(membership.isActive)}
                          <span>{getStatusText(membership.isActive)}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{membership.gym?.address}, {membership.gym?.city}</span>
                      </div>
                      {membership.gym?.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{membership.gym?.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {membership.gym?.images?.[0] && (
                      <div className="ml-6">
                        <img
                          src={membership.gym.images[0].startsWith('http') ? membership.gym.images[0] : `http://localhost:8000${membership.gym.images[0]}`}
                          alt={membership.gym.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Membership gym image failed to load:', e.target.src);
                            e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Membership Name</p>
                      <p className="font-semibold text-gray-900">{membership.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Price</p>
                      <p className="font-semibold text-primary-600 text-lg">
                        {formatPrice(membership.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {membership.duration} {membership.durationType}
                      </p>
                    </div>
                  </div>

                  {/* Membership Description */}
                  {membership.description && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-900">{membership.description}</p>
                    </div>
                  )}

                  {/* Features */}
                  {membership.features && membership.features.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Features</p>
                      <div className="flex flex-wrap gap-2">
                        {membership.features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Created Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(membership.createdAt).toLocaleDateString('ne-NP')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                        <p className="font-medium text-gray-900">
                          {new Date(membership.updatedAt).toLocaleDateString('ne-NP')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/gym/${membership.gym?.id}`}
                      className="btn-outline"
                    >
                      View Gym
                    </a>
                    
                    {membership.isActive && (
                      <button
                        onClick={() => handleCancelMembership(membership.id)}
                        disabled={cancellingId === membership.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === membership.id ? (
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Cancelling...</span>
                          </div>
                        ) : (
                          'Cancel Membership'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Membership