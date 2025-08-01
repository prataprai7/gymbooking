import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Dumbbell, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'News', path: '/news' }
    ],
    services: [
      { name: 'Find Gyms', path: '/gyms' },
      { name: 'Membership Plans', path: '/membership' },
      { name: 'Register Gym', path: '/register?type=gym_owner' },
      { name: 'Boost Service', path: '/boost' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'FAQ', path: '/faq' }
    ]
  }

  const nepalCities = [
    'Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 
    'Dharan', 'Butwal', 'Nepalgunj', 'Hetauda', 'Dhangadhi'
  ]

  return (
    <footer className="bg-[#242424] text-[#f3f3f3]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-[#484848] rounded-lg">
                <Dumbbell className="h-6 w-6 text-[#f3f3f3]" />
              </div>
              <span className="text-2xl font-bold text-[#f3f3f3]">BayamBook</span>
            </Link>
            {/* <p className="text-[#6c6c6c] mb-6 leading-relaxed">
              Nepal's largest gym booking platform. Find the best gyms near you and start your fitness journey today.
            </p> */}
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#f3f3f3]" />
                <span className="text-[#6c6c6c]">+977-9800000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#f3f3f3]" />
                <span className="text-[#6c6c6c]">info@bayambook.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#f3f3f3]" />
                <span className="text-[#6c6c6c]">Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#f3f3f3]">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-[#6c6c6c] hover:text-[#f3f3f3] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#f3f3f3]">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-[#6c6c6c] hover:text-[#f3f3f3] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#f3f3f3]">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-[#6c6c6c] hover:text-[#f3f3f3] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular Cities */}
        {/* <div className="mt-12 pt-8 border-t border-[#484848]">
          <h3 className="text-lg font-semibold mb-4 text-[#f3f3f3]">Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {nepalCities.map((city) => (
              <Link
                key={city}
                to={`/gyms?city=${encodeURIComponent(city)}`}
                className="px-3 py-1 bg-[#484848] text-[#f3f3f3] rounded-full text-sm hover:bg-[#6c6c6c] transition-colors duration-200"
              >
                {city}
              </Link>
            ))}
          </div>
        </div> */}

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-[#484848]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-[#6c6c6c]">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#484848] rounded-lg hover:bg-[#6c6c6c] transition-colors duration-200"
                >
                  <Facebook className="h-5 w-5 text-[#f3f3f3]" />
                </a>
                <a
                  href="https://instagram.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#484848] rounded-lg hover:bg-[#6c6c6c] transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5 text-[#f3f3f3]" />
                </a>
                <a
                  href="https://twitter.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#484848] rounded-lg hover:bg-[#6c6c6c] transition-colors duration-200"
                >
                  <Twitter className="h-5 w-5 text-[#f3f3f3]" />
                </a>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-[#484848] border border-[#6c6c6c] rounded-lg text-[#f3f3f3] placeholder-[#6c6c6c] focus:ring-2 focus:ring-[#6c6c6c] focus:border-transparent outline-none"
              />
              <button className="px-4 py-2 bg-[#6c6c6c] text-[#f3f3f3] rounded-lg hover:bg-[#484848] transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      {/* <div className="border-t border-[#484848]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-[#6c6c6c]">
              <span>&copy; {currentYear} BayamBook. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-1 text-[#6c6c6c]">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-[#f3f3f3]" />
              <span>in Nepal</span>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  )
}

export default Footer