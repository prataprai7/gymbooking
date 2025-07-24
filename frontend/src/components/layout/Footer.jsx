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
      { name: 'हाम्रो बारेमा', path: '/about' },
      { name: 'सम्पर्क', path: '/contact' },
      { name: 'करियर', path: '/careers' },
      { name: 'समाचार', path: '/news' }
    ],
    services: [
      { name: 'जिम खोज्नुहोस्', path: '/gyms' },
      { name: 'सदस्यता योजनाहरू', path: '/membership' },
      { name: 'जिम रजिस्टर गर्नुहोस्', path: '/register?type=gym_owner' },
      { name: 'बूस्ट सेवा', path: '/boost' }
    ],
    support: [
      { name: 'मद्दत केन्द्र', path: '/help' },
      { name: 'नीति', path: '/privacy' },
      { name: 'सर्तहरू', path: '/terms' },
      { name: 'FAQ', path: '/faq' }
    ]
  }

  const nepalCities = [
    'काठमाडौं', 'पोखरा', 'ललितपुर', 'भक्तपुर', 'बिराटनगर', 
    'धरान', 'बुटवल', 'नेपालगञ्ज', 'हेटौडा', 'धनगढी'
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">BayamBook</span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              नेपालको सबैभन्दा ठूलो जिम बुकिङ प्लेटफर्म। आफ्नो नजिकको उत्तम जिम फेला पार्नुहोस् र स्वस्थ जीवन सुरु गर्नुहोस्।
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+977-9800000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">info@bayambook.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">काठमाडौं, नेपाल</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">कम्पनी</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">सेवाहरू</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">सहायता</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Popular Cities */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-white">लोकप्रिय शहरहरू</h3>
          <div className="flex flex-wrap gap-2">
            {nepalCities.map((city) => (
              <Link
                key={city}
                to={`/gyms?city=${encodeURIComponent(city)}`}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-primary-600 hover:text-white transition-colors duration-200"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com/bayambook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition-colors duration-200"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="आफ्नो इमेल राख्नुहोस्"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button className="btn-primary whitespace-nowrap">
                सदस्यता लिनुहोस्
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; {currentYear} BayamBook. सबै अधिकार सुरक्षित।</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>in Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer