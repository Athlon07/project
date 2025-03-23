import { useState } from 'react';
import { MapPin, Navigation, Search, Clock, CreditCard, AlertCircle, Bus, ArrowRight, Repeat } from 'lucide-react';
import { useAuth } from '../../authContext';
import api from '../../services/api';

export default function ShuttleBooking({ onBookingComplete }) {
  const { user, updateWallet } = useAuth();
  const [booking, setBooking] = useState({
    start_stop: '',
    destination_stop: '',
    selectedSuggestion: null
  });
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleLocationSearch = async () => {
    if (!booking.start_stop || !booking.destination_stop) {
      setError('Please enter both pickup and dropoff locations');
      return;
    }

    try {
      setSearchLoading(true);
      const response = await api.post('/booking/suggest', {
        start_stop: booking.start_stop,
        destination_stop: booking.destination_stop
      });
      
      setSuggestions(response.data.suggestions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch route suggestions');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!booking.selectedSuggestion) {
      setError('Please select a route suggestion first');
      return;
    }
  
    try {
      setLoading(true);
  
      // Build bookingData based on the type of suggestion
      let bookingData = {};
      if (booking.selectedSuggestion.type === 'transfer') {
        bookingData = {
          student_id: user.id,
          route_id: booking.selectedSuggestion.first_route.route_id,
          pickup: booking.start_stop,
          dropoff: booking.destination_stop,
          fare: booking.selectedSuggestion.total_fare
        };
      } else {
        bookingData = {
          student_id: user.id,
          route_id: booking.selectedSuggestion.route_id,
          pickup: booking.start_stop,
          dropoff: booking.destination_stop,
          fare: booking.selectedSuggestion.fare
        };
      }
  
      const response = await api.post('/booking/book', bookingData);
      
      // Update wallet balance locally
      updateWallet(-response.data.booking.fare);
      
      // Show QR code if available
      if (response.data.booking.qr_code) {
        const qrWindow = window.open();
        qrWindow.document.write(`
          <html>
            <head>
              <title>Shuttle Booking Confirmation</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: linear-gradient(to bottom, #f0fdf4, #dcfce7);
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .container {
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                  padding: 32px;
                  text-align: center;
                  max-width: 400px;
                  width: 100%;
                }
                h2 {
                  color: #065f46;
                  margin-top: 0;
                  font-size: 24px;
                }
                .qr-container {
                  padding: 16px;
                  background: #f9fafb;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                img {
                  max-width: 100%;
                }
                .details {
                  background: #f0fdf4;
                  border-radius: 8px;
                  padding: 16px;
                  margin-top: 20px;
                  text-align: left;
                }
                .details p {
                  margin: 8px 0;
                  display: flex;
                  justify-content: space-between;
                }
                .details span {
                  font-weight: 600;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Booking Confirmation</h2>
                <div class="qr-container">
                  <img src="data:image/png;base64,${response.data.booking.qr_code}" 
                      alt="Booking QR Code"/>
                  <p style="margin-top: 12px; font-size: 14px; color: #4b5563;">
                    Scan this QR code to board the shuttle
                  </p>
                </div>
                <div class="details">
                  <p>Pickup: <span>${booking.start_stop}</span></p>
                  <p>Dropoff: <span>${booking.destination_stop}</span></p>
                  <p>Fare: <span>₹${response.data.booking.fare}</span></p>
                  <p>Booking ID: <span>${response.data.booking._id || response.data.booking.id}</span></p>
                </div>
              </div>
            </body>
          </html>
        `);
      }
  
      onBookingComplete(response.data.booking);
      setError('');
      resetForm();
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBooking({
      start_stop: '',
      destination_stop: '',
      selectedSuggestion: null
    });
    setSuggestions([]);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bus className="mr-2 text-emerald-600" size={24} />
              Book Campus Shuttle
            </h2>
            <p className="text-gray-600 mt-1">Find and book the best routes around campus</p>
          </div>
          <div className="bg-white p-2 px-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <CreditCard className="text-emerald-600 mr-2" size={18} />
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-bold text-emerald-600">₹{user.wallet_balance?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-1 text-emerald-600" /> Pickup Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={booking.start_stop}
                  onChange={(e) => setBooking({ ...booking, start_stop: e.target.value })}
                  placeholder="Where are you now?"
                  className="pl-4 pr-10 py-3 block w-full rounded-lg border-gray-200 border focus:border-emerald-500 focus:ring-emerald-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="text-gray-400">
                    <Navigation size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-1 text-emerald-600" /> Dropoff Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={booking.destination_stop}
                  onChange={(e) => setBooking({ ...booking, destination_stop: e.target.value })}
                  placeholder="Where are you going?"
                  className="pl-4 pr-10 py-3 block w-full rounded-lg border-gray-200 border focus:border-emerald-500 focus:ring-emerald-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="text-gray-400">
                    <MapPin size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleLocationSearch}
            disabled={searchLoading}
            className="mt-4 w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors flex items-center justify-center font-medium"
          >
            {searchLoading ? (
              <>
                <div className="animate-spin mr-2">
                  <Repeat size={18} />
                </div>
                Searching Routes...
              </>
            ) : (
              <>
                <Search size={18} className="mr-2" />
                Find Routes
              </>
            )}
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Suggestions */}
      {suggestions.length > 0 && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Bus className="mr-2 text-emerald-600" size={20} />
            Available Routes ({suggestions.length})
          </h3>
          
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => {
              const isTransfer = suggestion.type === 'transfer';
              const fare = isTransfer ? suggestion.total_fare : suggestion.fare;
              const travelTime = isTransfer ? suggestion.total_travel_time : suggestion.travel_time_minutes;
              
              return (
                <div
                  key={index}
                  className={`border rounded-xl p-5 cursor-pointer transition-all ${
                    booking.selectedSuggestion === suggestion
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setBooking({ ...booking, selectedSuggestion: suggestion })}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      {/* Route details */}
                      <div className="mb-3">
                        <div className="flex items-center text-lg font-semibold text-gray-800">
                          {isTransfer ? (
                            <div className="flex items-center">
                              <span>{suggestion.first_route.route_name}</span>
                              <ArrowRight size={16} className="mx-2 text-emerald-600" />
                              <span>{suggestion.second_route.route_name}</span>
                            </div>
                          ) : (
                            <span>{suggestion.route_name}</span>
                          )}
                        </div>
                        
                        {isTransfer && (
                          <div className="mt-1 text-sm flex items-center text-gray-500">
                            <Repeat size={14} className="mr-1" />
                            Transfer at {suggestion.transfer_stop}
                          </div>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock size={16} className="mr-1 text-emerald-600" />
                          <span>{travelTime} mins</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-emerald-700">
                          <CreditCard size={16} className="mr-1" />
                          <span>₹{fare}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBooking({ ...booking, selectedSuggestion: suggestion });
                        handleBooking();
                      }}
                      className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        booking.selectedSuggestion === suggestion
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      disabled={loading}
                    >
                      {loading && booking.selectedSuggestion === suggestion ? 'Booking...' : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}