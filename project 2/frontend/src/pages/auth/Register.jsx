import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Dumbbell } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('type') === 'gym_owner' ? 'gym_owner' : 'customer'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: defaultRole
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    // Make name optional - if provided, it must be at least 3 characters
    if (formData.name.trim() && formData.name.trim().length < 3) {
      toast.error('Full name must be at least 3 characters')
      return
    }

    if (formData.phone.length < 10 || formData.phone.length > 15) {
      toast.error('Phone number must be between 10 and 15 digits')
      return
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    // Split the name into firstName and lastName
    const trimmedName = formData.name.trim()
    let firstName = 'User'
    let lastName = 'Name'
    
    if (trimmedName) {
      const nameParts = trimmedName.split(' ')
      firstName = nameParts[0] || 'User'
      // If there's only one name or no last name, use the first name as last name
      lastName = nameParts.slice(1).join(' ') || firstName
    }
    
    // Generate username from email, ensuring it's at least 3 characters
    const emailPrefix = formData.email.split('@')[0]
    const username = emailPrefix.length >= 3 ? emailPrefix : emailPrefix + 'user'
    
    const result = await register({
      username: username,
      email: formData.email,
      password: formData.password,
      firstName: firstName,
      lastName: lastName,
      phone: formData.phone,
      role: formData.role === 'customer' ? 'user' : formData.role
    })
    
    if (result.success) {
      navigate('/')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-[#484848] to-[#6c6c6c] rounded-full">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#242424] mb-2">
            Join BayamBook
          </h2>
          <p className="text-[#6c6c6c]">
            Create your new account
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#484848] mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.role === 'customer' 
                    ? 'border-[#484848] bg-[#f3f3f3]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={formData.role === 'customer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center w-full">
                    <User className="h-6 w-6 mx-auto mb-1 text-[#484848]" />
                    <span className="text-sm font-medium">Customer</span>
                  </div>
                </label>
                <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.role === 'gym_owner' 
                    ? 'border-[#484848] bg-[#f3f3f3]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="gym_owner"
                    checked={formData.role === 'gym_owner'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center w-full">
                    <Dumbbell className="h-6 w-6 mx-auto mb-1 text-[#484848]" />
                    <span className="text-sm font-medium">Gym Owner</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#484848] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#484848] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name (optional)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#484848] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#484848] focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#484848] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] h-5 w-5" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#484848] focus:border-transparent transition-all duration-200"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#484848] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#484848] focus:border-transparent transition-all duration-200"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] hover:text-[#242424]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#484848] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#484848] focus:border-transparent transition-all duration-200"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6c6c6c] hover:text-[#242424]"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#484848] focus:ring-[#484848] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#6c6c6c]">
                I agree to the{' '}
                <Link to="/terms" className="text-[#484848] hover:text-[#242424]">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#484848] hover:bg-[#242424] text-white py-3 px-4 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6c6c6c]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-[#484848] hover:text-[#242424] transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register