import { useState } from 'react';
import { useAuth } from '../authContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!isLogin && !formData.name.trim()) {
      return setError('Name is required');
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 mt-15">
      <div className="max-w-5xl w-full overflow-hidden rounded-xl shadow-xl flex flex-col md:flex-row">
        
        {/* Left Section - Premium Content */}
        <div className="md:w-2/5 bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 md:p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mt-32 transform rotate-12"></div>
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-white opacity-5 rounded-full -mb-32 transform rotate-12"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Ease My Ride</h1>
              </div>
              
              <h2 className="text-xl font-light mb-6 text-emerald-50 leading-relaxed">Smart campus transportation solution for seamless journeys.</h2>
              
              <div className="space-y-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Live Tracking</h3>
                    <p className="text-emerald-50 mt-1 text-sm">Track your shuttle in real-time across campus</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Time Efficiency</h3>
                    <p className="text-emerald-50 mt-1 text-sm">Save time with AI-optimized routes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base">Mobile Friendly</h3>
                    <p className="text-emerald-50 mt-1 text-sm">Book rides from any device, anywhere</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 hidden md:block">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-emerald-400 bg-opacity-30 w-12"></div>
                <p className="text-xs text-emerald-100 font-light">TRUSTED BY BENNETT UNIVERSITY</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Auth Forms */}
        <div className="md:w-3/5 p-6 md:p-8 bg-white">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="mb-6 mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {isLogin 
                  ? 'Sign in with your university credentials'
                  : 'Register using your university email'}
              </p>
            </div>
            
            {/* Toggle Switch */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-full max-w-xs">
                <div className="bg-gray-100 h-10 rounded-lg flex p-1 shadow-inner">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 rounded-md flex items-center justify-center transition-all duration-300 ${
                      isLogin 
                        ? 'bg-white text-emerald-700 shadow-sm text-sm font-medium' 
                        : 'text-gray-500 hover:text-gray-700 text-sm'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 rounded-md flex items-center justify-center transition-all duration-300 ${
                      !isLogin 
                        ? 'bg-white text-emerald-700 shadow-sm text-sm font-medium' 
                        : 'text-gray-500 hover:text-gray-700 text-sm'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-3 rounded-md" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200">
                    <div className="flex">
                      <div className="py-2 px-3 border-r border-gray-200 flex items-center justify-center bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full px-3 py-2 border-0 outline-none bg-transparent text-sm"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200">
                  <div className="flex">
                    <div className="py-2 px-3 border-r border-gray-200 flex items-center justify-center bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full px-3 py-2 border-0 outline-none bg-transparent text-sm"
                      placeholder="name@bennett.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-500">Forgot?</a>
                  )}
                </div>
                <div className="rounded-lg border border-gray-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200">
                  <div className="flex">
                    <div className="py-2 px-3 border-r border-gray-200 flex items-center justify-center bg-gray-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full px-3 py-2 border-0 outline-none bg-transparent text-sm"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-200 shadow-sm"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </form>

            {!isLogin && (
              <p className="text-xs text-center text-gray-500 mt-4">
                By creating an account, you agree to our <a href="#" className="text-emerald-600 hover:text-emerald-500">Terms</a> and <a href="#" className="text-emerald-600 hover:text-emerald-500">Privacy Policy</a>
              </p>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1 text-emerald-600 hover:text-emerald-500 font-medium focus:outline-none transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}