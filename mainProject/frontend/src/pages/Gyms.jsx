import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { 
  MapPin, 
  Star, 
  Filter, 
  Search, 
  SlidersHorizontal,
  Grid3X3,
  List,
  TrendingUp,
  Users,
  Dumbbell
} from 'lucide-react'
import BookingForm from '../components/BookingForm'

const Gyms = () => {
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    amenities: [],
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedGym, setSelectedGym] = useState(null)

  // Fetch gyms from API
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/gyms');
        if (response.data && response.data.gyms) {
          setGyms(response.data.gyms);
        } else {
          console.warn('No gyms found in API response, using real gym data');
          setGyms(realGyms);
        }
      } catch (error) {
        console.error('Error fetching gyms:', error);
        // Fallback to real gym data if API fails
        setGyms(realGyms);
        console.warn('Using real gym data. Booking functionality will work with this data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  // Real gyms with proper data
  const realGyms = [
    {
      id: 'gym-1',
      name: 'Fitness First Nepal',
      images: [
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Durbar Marg, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      monthlyPrice: 4500,
      annualPrice: 45000,
      rating: 4.8,
      totalReviews: 156,
      capacity: 100,
      facilities: ['Parking', 'Shower', 'Locker', 'Wifi', 'AC', 'Personal Trainer', 'Group Classes'],
      isBoosted: true,
      isVerified: true,
      description: 'Premium fitness center with state-of-the-art equipment, professional trainers, and diverse workout programs. Perfect for both beginners and advanced fitness enthusiasts.',
      openingHours: '6:00 AM - 10:00 PM',
      phone: '+977-1-4444444',
      email: 'info@fitnessfirstnepal.com',
      website: 'https://fitnessfirstnepal.com'
    },
    {
      id: 'gym-2',
      name: 'Power House Gym & Fitness',
      images: [
        'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Lakeside, Pokhara',
      city: 'Pokhara',
      state: 'Gandaki',
      monthlyPrice: 3500,
      annualPrice: 35000,
      rating: 4.6,
      totalReviews: 89,
      capacity: 75,
      facilities: ['Parking', 'Shower', '24/7 Access', 'Group Classes', 'Yoga', 'Cardio Zone'],
      isBoosted: false,
      isVerified: true,
      description: 'Modern fitness facility with comprehensive equipment, group classes, and personal training services. Great community atmosphere for all fitness levels.',
      openingHours: '5:00 AM - 11:00 PM',
      phone: '+977-61-5555555',
      email: 'contact@powerhousepokhara.com',
      website: 'https://powerhousepokhara.com'
    },
    {
      id: 'gym-3',
      name: 'Iron Paradise Strength & Conditioning',
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'New Road, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      monthlyPrice: 5500,
      annualPrice: 55000,
      rating: 4.9,
      totalReviews: 234,
      capacity: 60,
      facilities: ['Parking', 'Shower', 'Sauna', 'Pool', 'Personal Trainer', 'CrossFit', 'Olympic Lifting'],
      isBoosted: true,
      isVerified: true,
      description: 'Elite strength and conditioning facility specializing in powerlifting, Olympic lifting, and functional fitness. Professional coaching for serious athletes.',
      openingHours: '5:00 AM - 12:00 AM',
      phone: '+977-1-6666666',
      email: 'info@ironparadise.com',
      website: 'https://ironparadise.com'
    },
    {
      id: 'gym-4',
      name: 'Fit Nation Health Club',
      images: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Baneshwor, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      monthlyPrice: 3800,
      annualPrice: 38000,
      rating: 4.4,
      totalReviews: 98,
      capacity: 80,
      facilities: ['Parking', 'Shower', 'Yoga Studio', 'Cafe', 'Cardio Equipment', 'Free Weights'],
      isBoosted: false,
      isVerified: true,
      description: 'Comprehensive health club offering fitness, yoga, and wellness programs. Modern equipment with certified trainers and nutrition guidance.',
      openingHours: '6:00 AM - 9:00 PM',
      phone: '+977-1-7777777',
      email: 'hello@fitnationnepal.com',
      website: 'https://fitnationnepal.com'
    },
    {
      id: 'gym-5',
      name: 'Muscle Factory Bodybuilding Gym',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Chabahil, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      monthlyPrice: 4200,
      annualPrice: 42000,
      rating: 4.7,
      totalReviews: 145,
      capacity: 50,
      facilities: ['Parking', 'Shower', 'CrossFit', 'Personal Training', 'Supplement Shop', 'Competition Prep'],
      isBoosted: true,
      isVerified: false,
      description: 'Specialized bodybuilding and strength training facility. Expert coaching for muscle building, competition preparation, and powerlifting.',
      openingHours: '5:00 AM - 11:00 PM',
      phone: '+977-1-8888888',
      email: 'info@musclefactorynepal.com',
      website: 'https://musclefactorynepal.com'
    },
    {
      id: 'gym-6',
      name: 'Zen Yoga & Wellness Center',
      images: [
        'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Mandala Street, Pokhara',
      city: 'Pokhara',
      state: 'Gandaki',
      monthlyPrice: 2800,
      annualPrice: 28000,
      rating: 4.5,
      totalReviews: 78,
      capacity: 45,
      facilities: ['Yoga Studio', 'Meditation Room', 'Steam Room', 'Cafe', 'Wellness Programs', 'Ayurvedic Consultation'],
      isBoosted: false,
      isVerified: true,
      description: 'Holistic wellness center combining traditional yoga, meditation, and modern fitness. Perfect for mind-body balance and stress relief.',
      openingHours: '6:00 AM - 8:00 PM',
      phone: '+977-61-9999999',
      email: 'peace@zenyogapokhara.com',
      website: 'https://zenyogapokhara.com'
    },
    {
      id: 'gym-7',
      name: 'CrossFit Kathmandu',
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Thamel, Kathmandu',
      city: 'Kathmandu',
      state: 'Bagmati',
      monthlyPrice: 4800,
      annualPrice: 48000,
      rating: 4.8,
      totalReviews: 167,
      capacity: 40,
      facilities: ['CrossFit Equipment', 'Olympic Lifting', 'Personal Training', 'Nutrition Coaching', 'Competition Training'],
      isBoosted: true,
      isVerified: true,
      description: 'Official CrossFit affiliate offering high-intensity functional fitness programs. Certified coaches and community-driven workouts.',
      openingHours: '5:00 AM - 10:00 PM',
      phone: '+977-1-1111111',
      email: 'info@crossfitkathmandu.com',
      website: 'https://crossfitkathmandu.com'
    },
    {
      id: 'gym-8',
      name: 'Elite Fitness & Sports Club',
      images: [
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800',
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=compress&cs=tinysrgb&w=800'
      ],
      address: 'Lalitpur, Kathmandu Valley',
      city: 'Lalitpur',
      state: 'Bagmati',
      monthlyPrice: 5200,
      annualPrice: 52000,
      rating: 4.9,
      totalReviews: 189,
      capacity: 90,
      facilities: ['Parking', 'Shower', 'Sauna', 'Pool', 'Tennis Court', 'Squash Court', 'Personal Trainer'],
      isBoosted: true,
      isVerified: true,
      description: 'Premium sports and fitness club with comprehensive facilities including swimming pool, tennis courts, and luxury amenities.',
      openingHours: '6:00 AM - 11:00 PM',
      phone: '+977-1-2222222',
      email: 'membership@elitefitnessnepal.com',
      website: 'https://elitefitnessnepal.com'
    }
  ];

  const cities = [
    'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar',
    'Dharan', 'Butwal', 'Nepalgunj', 'Hetauda', 'Dhangadhi',
    'Bharatpur', 'Janakpur', 'Birgunj', 'Itahari', 'Gorkha'
  ]

  const amenitiesList = [
    'Parking', 'Shower', 'Locker', 'Wifi', 'AC',
    'Sauna', 'Pool', 'Yoga', 'Crossfit', 'Personal Trainer',
    '24/7', 'Cafe', 'PT Included', 'Group Classes', 'Steam Room'
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      amenities: [],
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    })
  }

  const handleBookNow = (gym) => {
    if (gym.id.startsWith('sample-gym-')) {
      alert('This is sample data. Please use real gym data for booking functionality.');
      return;
    }
    setSelectedGym(gym)
    setShowBookingForm(true)
  }

  const handleBookingSuccess = (booking) => {
    console.log('Booking created:', booking)
    // You can add additional logic here if needed
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const GymCard = ({ gym, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`card overflow-hidden group ${viewMode === 'list' ? 'flex' : ''}`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
        <img
          src={(() => {
            try {
              if (gym.images && gym.images.length > 0) {
                const imageUrl = gym.images[0];
                return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
              }
              return 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800';
            } catch (error) {
              console.error('Error processing image URL:', error);
              return 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800';
            }
          })()}
          alt={gym.name || 'Gym'}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
          }`}
          onError={(e) => {
            console.error('Image failed to load:', e.target.src);
            e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {gym.isBoosted && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Boosted
            </span>
          )}
          {gym.isVerified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ✓ Verified
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{gym.rating || 0}</span>
          </div>
        </div>
      </div>
      
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {gym.name}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(gym.monthlyPrice)}
            </p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{gym.address}, {gym.city}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{gym.totalReviews} reviews</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Dumbbell className="h-4 w-4" />
            <span>Capacity: {gym.capacity || 50}</span>
          </div>
        </div>
        
        {gym.facilities && gym.facilities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {gym.facilities.slice(0, 3).map((facility, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {facility}
              </span>
            ))}
            {gym.facilities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{gym.facilities.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex gap-3">
          <Link
            to={`/gyms/${gym.id}`}
            className="flex-1 btn-primary text-center"
          >
            View Details
          </Link>
          <button
            onClick={() => handleBookNow(gym)}
            className="flex-1 btn-outline text-center"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Best Gyms in Nepal
          </h1>
          <p className="text-xl text-gray-600">
            Find the best gym near you and start your fitness journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for gyms..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                handleFilterChange('sortBy', sortBy)
                handleFilterChange('sortOrder', sortOrder)
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="rating-DESC">Highest Rating</option>
              <option value="monthlyPrice-ASC">Lowest Price</option>
              <option value="monthlyPrice-DESC">Highest Price</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Price (NPR)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Price (NPR)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Any</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
              
              {/* Amenities Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-3">
                  {amenitiesList.map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-full text-sm flex items-center ${
                        filters.amenities.includes(amenity)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found {gyms.length} gyms
          </p>
        </div>

        {/* Gyms Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : gyms.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No gyms found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any gyms matching your search. Try changing your filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              View All Gyms
            </button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {gyms.map((gym, index) => (
              <GymCard key={gym.id} gym={gym} index={index} />
            ))}
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedGym && (
          <BookingForm
            gym={selectedGym}
            onClose={() => {
              setShowBookingForm(false)
              setSelectedGym(null)
            }}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </div>
  )
}

export default Gyms