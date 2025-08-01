import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Dumbbell, 
  MapPin, 
  Star, 
  Users, 
  Clock, 
  Shield,
  ArrowRight,
  Play,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react'

const Home = () => {
  const featuredGyms = [
    {
      id: 1,
      name: 'Fitness Park Kathmandu',
      location: 'New Road, Kathmandu',
      rating: 4.8,
      reviews: 245,
      price: 3500,
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['24/7 Open', 'Personal Trainer', 'AC Available']
    },
    {
      id: 2,
      name: 'Power House Gym',
      location: 'Lalitpur',
      rating: 4.6,
      reviews: 189,
      price: 2800,
      image: 'https://images.unsplash.com/photo-1581009137042-c552e485697a',
      features: ['Modern Equipment', 'Yoga Classes', 'Parking']
    },
    {
      id: 3,
      name: 'Strength Station',
      location: 'Bhaktapur',
      rating: 4.7,
      reviews: 156,
      price: 3200,
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['CrossFit', 'Nutrition Guide', 'Shower']
    }
  ]

  const stats = [
    { number: '25+', label: 'Gyms', icon: Dumbbell },
    { number: '1200+', label: 'Members', icon: Users },
    { number: '12+', label: 'Cities', icon: MapPin },
    { number: '4.9', label: 'Rating', icon: Star }
  ]

  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby Gyms',
      description: 'Discover the best gyms near your location with our smart search'
    },
    {
      icon: Clock,
      title: 'Easy Booking',
      description: 'Book your favorite gym membership in just a few clicks'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Safe and reliable payment system for all transactions'
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'High-quality gyms and excellent customer service'
    }
  ]

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#242424] via-[#484848] to-[#6c6c6c] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Nepal's
                <span className="block text-secondary-400">Largest</span>
                <span className="block">Gym Platform</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Find the best gyms near you, get memberships, and start your healthy lifestyle. 
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                to="/gyms" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#484848] hover:bg-[#242424] transition-colors duration-200"
              >
                Find Gyms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Modern Gym"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">Start Today</h3>
                        <p className="text-gray-200 text-sm">First month free!</p>
                      </div>
                      <div className="text-right">
                        <p className="text-secondary-400 font-bold text-lg">NPR 0</p>
                        <p className="text-gray-200 text-sm line-through">NPR 3,500</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">This month</p>
                    <p className="font-bold text-gray-900">+1.5k new members</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce-light"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-400 bg-opacity-20 rounded-full float-animation"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e0e0e0] rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-[#484848]" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-[#6c6c6c] font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gyms Section */}
      <section className="py-20 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Gyms
            </h2>
            <p className="text-xl text-[#6c6c6c] max-w-2xl mx-auto">
              Explore gyms with high ratings and excellent facilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGyms.map((gym, index) => (
              <motion.div
                key={gym.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card overflow-hidden group bg-white shadow-md rounded-lg"
              >
                <div className="relative">
                  <img
                    src={gym.image}
                    alt={gym.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{gym.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{gym.name}</h3>
                  <div className="flex items-center text-[#6c6c6c] mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{gym.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-[#6c6c6c]">
                      <Users className="h-4 w-4" />
                      <span>{gym.reviews} reviews</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#484848]">NPR {gym.price.toLocaleString()}</p>
                      <p className="text-sm text-[#6c6c6c]">per month</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {gym.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-[#f3f3f3] text-[#484848] text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    to={`/gym/${gym.id}`}
                    className="w-full btn-primary text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
    to="/gyms" 
    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#484848] hover:bg-[#242424] transition-colors duration-200"
  >
    View All Gyms
    <ArrowRight className="ml-2 h-5 w-5" />
  </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose BayamBook?
            </h2>
            <p className="text-xl text-[#6c6c6c] max-w-2xl mx-auto">
              We are Nepal's most trusted and advanced gym booking platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e0e0e0] rounded-full mb-6 group-hover:bg-[#484848] group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-[#484848] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-[#6c6c6c] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#242424] via-[#484848] to-[#6c6c6c] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Start Your Fitness Journey Today
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Join thousands of happy members and achieve your health goals. 
              First month completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                Start Free
              </Link>
              <Link to="/gyms" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 backdrop-blur-sm">
                Find Gyms
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home