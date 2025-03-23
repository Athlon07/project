import { useState, useEffect } from 'react';
import axios from 'axios';
import ShuttleBooking from './booking/ShuttleBooking';
import StudentWallet from './wallet/StudentWallet';
import { useAuth } from '../authContext';
import { getBookings, updateBookingStatus } from '../services/dataService';
import { ArrowRight, Calendar, CreditCard, Clock, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user, updateWallet } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expenseReport, setExpenseReport] = useState(null);

  // useEffect(() => {
  //   // Load bookings on component mount
  //   const loadBookings = () => {
  //     const allBookings = getBookings(user.id);
  //     const today = new Date();
      
  //     // Separate bookings into history and upcoming
  //     const history = allBookings.filter(booking => 
  //       new Date(booking.date) < today || booking.status === 'completed'
  //     );
      
  //     const upcoming = allBookings.filter(booking => 
  //       new Date(booking.date) >= today && booking.status === 'upcoming'
  //     );
      
  //     setBookingHistory(history);
  //     setUpcomingTrips(upcoming);
  //   };

  //   loadBookings();
  // }, [user.id]);

  useEffect(() => {
    if (activeTab === "history") {
      const fetchBookingHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/booking/history/${user.id}`
          );
          const data = response.data.bookings;
    
          const formattedHistory = data.map((booking) => {
            const scheduledTime = new Date(booking.scheduled_time); 
            const now = new Date();
  
            // Convert both times to UTC to avoid timezone mismatches
            const status = scheduledTime.getTime() > now.getTime() ? "upcoming" : "completed";
    
            return {
              id: booking._id,
              route: booking.route_name || "Shuttle Ride",
              from: booking.pickup,
              to: booking.dropoff,
              price: booking.fare,
              date: scheduledTime.toLocaleDateString(),
              time: scheduledTime.toLocaleTimeString(),
              status: status, 
            };
          });
    
          setBookingHistory(formattedHistory);
        } catch (error) {
          console.error("Error fetching booking history:", error);
        }
      };
    
      fetchBookingHistory();
    }
  }, [activeTab, user.id]);
  
  
  
  
  
  

  useEffect(() => {
    if (activeTab === 'wallet') {
      axios
        .get(`http://localhost:5000/api/booking/expense_report/${user.id}`)
        .then((res) => {
          setExpenseReport(res.data.report);
        })
        .catch((err) => {
          console.error("Failed to fetch expense report", err);
        });
    }
  }, [activeTab, user.id]);

  const handleRecharge = async (amount) => {
    await updateWallet(amount, 'recharge', 'Wallet Recharge');
  };

  const handleBooking = (booking) => {
    const bookingDateObj = new Date(booking.timestamp);
    const formattedBooking = {
      id: booking.id,
      route: booking.route_name || "Shuttle Ride",
      from: booking.pickup,
      to: booking.dropoff,
      price: booking.fare,
      date: bookingDateObj.toLocaleDateString(),
      time: bookingDateObj.toLocaleTimeString(),
      status: "upcoming"
    };

    const today = new Date();
    if (bookingDateObj >= today) {
      setUpcomingTrips([formattedBooking, ...upcomingTrips]);
    }
    
    setBookingHistory([formattedBooking, ...bookingHistory]);
  };

  const handleCancelTrip = (tripId) => {
    updateBookingStatus(tripId, 'cancelled');
    setUpcomingTrips(upcomingTrips.filter(trip => trip.id !== tripId));
    setBookingHistory(bookingHistory.map(booking => 
      booking.id === tripId 
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
  };

  const getStatusBadgeStyles = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'cancelled':
        return <X className="w-4 h-4 mr-1" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 mr-1" />;
      default:
        return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user.name}
              </h1>
              <p className="text-gray-500 mt-1">Manage your shuttle bookings and wallet</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-green-800 font-medium border border-green-200">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                <span>Balance: ₹{user.wallet_balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('book')}
                className={`${
                  activeTab === 'book'
                    ? 'border-b-2 border-green-500 text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-green-50'
                } flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                Book Shuttle
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-green-500 text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-green-50'
                } flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                Upcoming Trips
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`${
                  activeTab === 'wallet'
                    ? 'border-b-2 border-green-500 text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-green-50'
                } flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                My Wallet
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-b-2 border-green-500 text-green-700 bg-green-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-green-50'
                } flex-1 py-4 px-4 font-medium text-sm transition-all duration-200`}
              >
                Booking History
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'book' && (
              <ShuttleBooking onBookingComplete={handleBooking} />
            )}
            
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Upcoming Trips</h2>
                
                {upcomingTrips.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No upcoming trips</h3>
                      <p className="text-gray-500 mt-2 max-w-md">
                        You don't have any upcoming shuttle bookings. Book a new trip to see it here.
                      </p>
                      <button 
                        onClick={() => setActiveTab('book')}
                        className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition-all duration-200"
                      >
                        Book a Shuttle
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {trip.route}
                          </h3>
                          <div className="flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Upcoming
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <div className="flex items-center">
                              <span className="text-gray-800">{trip.from}</span>
                              <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                              <span className="text-gray-800">{trip.to}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{trip.date} at {trip.time}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600">
                            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                            <span>₹{trip.price}</span>
                          </div>
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
                          <button
                            onClick={() => handleCancelTrip(trip.id)}
                            className="flex items-center text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors duration-200"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel Trip
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'wallet' && (
              <StudentWallet
                balance={user.wallet_balance}
                onRecharge={handleRecharge}
                expenseReport={expenseReport}
              />
            )}
            
            {activeTab === 'history' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Booking History</h2>
                
                {bookingHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex flex-col items-center">
                      <Clock className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">No booking history</h3>
                      <p className="text-gray-500 mt-2 max-w-md">
                        You haven't made any bookings yet. Book your first shuttle to get started.
                      </p>
                      <button 
                        onClick={() => setActiveTab('book')}
                        className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition-all duration-200"
                      >
                        Book a Shuttle
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookingHistory.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.route}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600 flex items-center">
                                <span>{booking.from}</span>
                                <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                                <span>{booking.to}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{booking.date}</div>
                              <div className="text-sm text-gray-500">{booking.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{booking.price}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}