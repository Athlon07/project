import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Twitter, Facebook, MapPin, Bus, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bus size={24} className="text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl text-white">Ease<span className="text-emerald-400">My</span>Ride</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Modern campus transportation solution focused on making student commute safe, reliable, and sustainable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Campus Routes
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Shuttle Schedule
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800 pb-2">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-800 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  University Campus, Tech Park Building<br />
                  Bangalore, Karnataka 560064
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-emerald-400 mr-2 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-emerald-400 mr-2 flex-shrink-0" />
                <a href="mailto:support@easemyride.com" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  support@easemyride.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} EaseMyRide. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0 flex items-center">
              Made with <Heart size={12} className="text-red-500 mx-1" /> in India
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Top Edge */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 absolute top-0 left-0 right-0"></div>
    </footer>
  );
}