import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';
import { LogOut, Menu, X, Bus, Home, History, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-emerald-50 to-green-50 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-emerald-600 opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bus size={24} className="text-emerald-700" />
                </div>
              </div>
              <div>
                <span className="font-bold text-xl text-gray-800">Ease<span className="text-emerald-600">My</span>Ride</span>
                <span className="block text-xs text-gray-500">Campus Transportation</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Home size={16} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/history"
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive('/history')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <History size={16} />
                  <span>Trip History</span>
                </div>
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                {/* Wallet balance (desktop) */}
                <div className="hidden md:block bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <span className="text-sm text-emerald-700 font-medium">₹{user.wallet_balance?.toFixed(2) || '0.00'}</span>
                </div>

                {/* User profile dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-1 bg-white rounded-full pl-2 pr-3 py-1 border border-gray-200 hover:border-emerald-300 transition-colors focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      {user.name?.charAt(0) || <User size={16} />}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-10">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileDropdown(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        to="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileDropdown(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Home size={18} />
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link
                  to="/history"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/history')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <History size={18} />
                    <span>Trip History</span>
                  </div>
                </Link>
                <div className="px-3 py-2 flex justify-between items-center border-t border-gray-100 mt-2 pt-2">
                  <div>
                    <p className="text-xs text-gray-500">Wallet Balance</p>
                    <p className="text-lg font-medium text-emerald-600">₹{user.wallet_balance?.toFixed(2) || '0.00'}</p>
                  </div>
                  <Link 
                    to="/recharge"
                    className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-100"
                  >
                    Recharge
                  </Link>
                </div>
                <button
                  onClick={logout}
                  className="w-full mt-2 text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}