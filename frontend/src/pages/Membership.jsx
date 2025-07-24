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
      const response = await axios.get('/api/memberships')
      setMemberships(response.data.data)
    } catch (error) {
      console.error('Error fetching memberships:', error)
      toast.error('सदस्यताहरू लोड गर्न सकिएन')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelMembership = async (membershipId) => {
    if (!confirm('के तपाईं यो सदस्यता रद्द गर्न चाहनुहुन्छ?')) {
      return
    }

    try {
      setCancellingId(membershipId)
      await axios.put(`/api/memberships/${membershipId}/cancel`)
      toast.success('सदस्यता रद्द गरियो')
      fetchMemberships()
    } catch (error) {
      console.error('Error cancelling membership:', error)
      toast.error('सदस्यता रद्द गर्न सकिएन')
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5" />
      case 'expired': return <XCircle className="h-5 w-5" />
      case 'pending': return <Clock className="h-5 w-5" />
      case 'cancelled': return <XCircle className="h-5 w-5" />
      default: return <AlertCircle className="h-5 w-5" />
    }
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
            मेरो सदस्यताहरू
          </h1>
          <p className="text-gray-600">
            तपाईंका सबै जिम सदस्यताहरूको विवरण
          </p>
        </div>

        {memberships.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                कुनै सदस्यता छैन
              </h3>
              <p className="text-gray-600 mb-6">
                तपाईंले अहिलेसम्म कुनै जिम सदस्यता लिनुभएको छैन। नयाँ जिम खोज्नुहोस् र आफ्नो फिटनेस यात्रा सुरु गर्नुहोस्।
              </p>
              <a href="/gyms" className="btn-primary">
                जिम खोज्नुहोस्
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
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(membership.status)}`}>
                          {getStatusIcon(membership.status)}
                          <span>{getStatusText(membership.status)}</span>
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
                          src={membership.gym.images[0]}
                          alt={membership.gym.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">सदस्यता प्रकार</p>
                      <p className="font-semibold text-gray-900">
                        {membership.type === 'monthly' ? 'मासिक' : 'वार्षिक'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">मूल्य</p>
                      <p className="font-semibold text-primary-600 text-lg">
                        {formatPrice(membership.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">सुरु मिति</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(membership.startDate).toLocaleDateString('ne-NP')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">समाप्त मिति</p>
                      <p className={`font-semibold ${
                        isExpiringSoon(membership.endDate) ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                        {new Date(membership.endDate).toLocaleDateString('ne-NP')}
                      </p>
                      {membership.status === 'active' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {getDaysRemaining(membership.endDate) > 0 
                            ? `${getDaysRemaining(membership.endDate)} दिन बाँकी`
                            : 'समाप्त भएको'
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">भुक्तानी विधि</p>
                        <p className="font-medium text-gray-900">
                          {membership.paymentMethod === 'cash' ? 'नगद' :
                           membership.paymentMethod === 'esewa' ? 'eSewa' :
                           membership.paymentMethod === 'khalti' ? 'Khalti' :
                           membership.paymentMethod === 'bank_transfer' ? 'बैंक ट्रान्सफर' :
                           membership.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">भुक्तानी स्थिति</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          membership.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                          membership.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {membership.paymentStatus === 'paid' ? 'भुक्तानी भएको' :
                           membership.paymentStatus === 'pending' ? 'भुक्तानी बाँकी' :
                           'भुक्तानी असफल'}
                        </span>
                      </div>
                      {membership.transactionId && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">लेनदेन ID</p>
                          <p className="font-mono text-sm text-gray-900">
                            {membership.transactionId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expiry Warning */}
                  {membership.status === 'active' && isExpiringSoon(membership.endDate) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-orange-800">
                            तपाईंको सदस्यता छिट्टै समाप्त हुँदैछ!
                          </p>
                          <p className="text-sm text-orange-700">
                            {getDaysRemaining(membership.endDate)} दिनमा समाप्त हुनेछ। नवीकरण गर्न जिममा सम्पर्क गर्नुहोस्।
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/gym/${membership.gym?.id}`}
                      className="btn-outline"
                    >
                      जिम हेर्नुहोस्
                    </a>
                    
                    {membership.status === 'active' && (
                      <button
                        onClick={() => handleCancelMembership(membership.id)}
                        disabled={cancellingId === membership.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === membership.id ? (
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>रद्द गर्दै...</span>
                          </div>
                        ) : (
                          'रद्द गर्नुहोस्'
                        )}
                      </button>
                    )}

                    {membership.status === 'active' && isExpiringSoon(membership.endDate) && (
                      <a
                        href={`/gym/${membership.gym?.id}?action=book`}
                        className="btn-primary"
                      >
                        नवीकरण गर्नुहोस्
                      </a>
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