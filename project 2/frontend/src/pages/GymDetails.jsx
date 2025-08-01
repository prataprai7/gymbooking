import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Users, 
  Wifi, 
  Car, 
  Dumbbell,
  Heart,
  Share2,
  Calendar,
  CreditCard,
  CheckCircle,
  X,
  ArrowLeft
} from 'lucide-react'

const GymDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [gym, setGym] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    type: 'monthly',
    paymentMethod: 'cash'
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    fetchGymDetails()
    if (searchParams.get('action') === 'book') {
      setShowBookingModal(true)
    }
  }, [id])

  const fetchGymDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/gyms/${id}`)
      setGym(response.data.data)
    } catch (error) {
      console.error('Error fetching gym details:', error)
      toast.error('Failed to load gym details')
      navigate('/gyms')
    } finally {
      setLoading(false)
    }
  }

  const handleBookMembership = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book membership')
      navigate('/login')
      return
    }

    try {
      setBookingLoading(true)
      const response = await axios.post('/api/bookings', {
        gymId: gym.id,
        membershipType: bookingData.type,
        paymentMethod: bookingData.paymentMethod,
        totalAmount: bookingData.type === 'monthly' ? gym.monthlyPrice : gym.annualPrice
      })

      toast.success('Booking created successfully! Please wait for gym owner confirmation.')
      setShowBookingModal(false)
      // Navigate to booking confirmation page with booking ID
      const bookingId = response.data?.booking?.id || `BK${Date.now()}`
      navigate(`/booking-confirmation/${bookingId}`)
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getYearlyPrice = () => {
    return gym.yearlyPrice || (gym.monthlyPrice * 10)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!gym) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gym not found</h2>
          <button onClick={() => navigate('/gyms')} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const images = gym.images && gym.images.length > 0 
    ? gym.images.map(img => img.startsWith('http') ? img : `http://localhost:8000${img}`)
    : ['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1200']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/gyms')}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={images[activeImageIndex]}
                  alt={gym.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1200';
                  }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {gym.isBoosted && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Boosted
                    </span>
                  )}
                  {gym.isVerified && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${gym.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Thumbnail image failed to load:', e.target.src);
                            e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1200';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gym Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{gym.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-5 w-5" />
                      <span>{gym.address}, {gym.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{gym.rating || 0}</span>
                      <span>({gym.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed">{gym.description}</p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {gym.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{gym.phone}</span>
                  </div>
                )}
                {gym.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span>{gym.email}</span>
                  </div>
                )}
                {gym.website && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="h-5 w-5" />
                    <a href={gym.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Facilities */}
              {gym.facilities && gym.facilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gym.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {gym.openingHours && Object.keys(gym.openingHours).length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Opening Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(gym.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-1">
                        <span className="font-medium text-gray-700">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            {gym.reviews && gym.reviews.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h3>
                <div className="space-y-4">
                  {gym.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {review.user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{review.user?.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-US')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Membership Plans</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Monthly</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(gym.monthlyPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Yearly</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(getYearlyPrice())}
                        </span>
                        <p className="text-sm text-green-600">2 months free!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full btn-primary text-lg py-4 mb-4"
              >
                Book Now
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>✓ No hidden fees</p>
                <p>✓ Cancel anytime</p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Capacity</span>
                  <span className="font-medium">{gym.capacity || 50} people</span>
                </div>
                {gym.establishedYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Established</span>
                    <span className="font-medium">{gym.establishedYear}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">District</span>
                  <span className="font-medium">{gym.district}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Book Membership</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membership Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="monthly"
                      checked={bookingData.type === 'monthly'}
                      onChange={(e) => setBookingData(prev => ({ ...prev, type: e.target.value }))}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Monthly</span>
                        <span className="text-primary-600 font-bold">
                          {formatPrice(gym.monthlyPrice)}
                        </span>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="type"
                      value="yearly"
                      checked={bookingData.type === 'yearly'}
                      onChange={(e) => setBookingData(prev => ({ ...prev, type: e.target.value }))}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Yearly</span>
                        <div className="text-right">
                          <span className="text-primary-600 font-bold">
                            {formatPrice(getYearlyPrice())}
                          </span>
                          <p className="text-xs text-green-600">2 months free!</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={bookingData.paymentMethod}
                  onChange={(e) => setBookingData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="cash">Cash</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(bookingData.type === 'monthly' ? gym.monthlyPrice : getYearlyPrice())}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  * Payment can be made at the gym
                </p>
              </div>

              <button
                onClick={handleBookMembership}
                disabled={bookingLoading}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default GymDetails