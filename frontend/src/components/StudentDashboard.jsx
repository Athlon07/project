import { useState, useEffect } from 'react';
import axios from 'axios'; // added for API call
import ShuttleBooking from './booking/ShuttleBooking';
import StudentWallet from './wallet/StudentWallet';
import { useAuth } from '../authContext';
import { getBookings, updateBookingStatus } from '../services/dataService';

export default function StudentDashboard() {
  const { user, updateWallet } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [expenseReport, setExpenseReport] = useState(null); // new state

  useEffect(() => {
    // Load bookings on component mount
    const loadBookings = () => {
      const allBookings = getBookings(user.id);
      const today = new Date();
      
      // Separate bookings into history and upcoming
      const history = allBookings.filter(booking => 
        new Date(booking.date) < today || booking.status === 'completed'
      );
      
      const upcoming = allBookings.filter(booking => 
        new Date(booking.date) >= today && booking.status === 'upcoming'
      );
      
      setBookingHistory(history);
      setUpcomingTrips(upcoming);
    };

    loadBookings();
  }, [user.id]);

  // New: Fetch expense report when wallet tab is active
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
    // Calls the updateWallet function in AuthContext, which calls the backend recharge endpoint
    await updateWallet(amount, 'recharge', 'Wallet Recharge');
  };

  const handleBooking = (booking) => {
    // Transform the backend booking object into the dashboard format
    const bookingDateObj = new Date(booking.timestamp);
    const formattedBooking = {
      id: booking.id,
      // Display route name if available; otherwise default to a string.
      route: booking.route_name || "Shuttle Ride",
      from: booking.pickup,
      to: booking.dropoff,
      price: booking.fare,
      date: bookingDateObj.toLocaleDateString(), // formatted date
      time: bookingDateObj.toLocaleTimeString(),   // formatted time
      // Assuming new bookings are upcoming unless updated otherwise
      status: "upcoming"
    };

    const today = new Date();
    // Determine if the booking should go into upcoming trips based on the booking date
    if (bookingDateObj >= today) {
      setUpcomingTrips([formattedBooking, ...upcomingTrips]);
    }
    
    // Add booking to booking history
    setBookingHistory([formattedBooking, ...bookingHistory]);
  };

  const handleCancelTrip = (tripId) => {
    // Update booking status in data service
    updateBookingStatus(tripId, 'cancelled');
    
    // Remove from upcoming trips
    setUpcomingTrips(upcomingTrips.filter(trip => trip.id !== tripId));
    
    // Update booking history
    setBookingHistory(bookingHistory.map(booking => 
      booking.id === tripId 
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome, {user.name}
        </h1>

        {/* Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('book')}
              className={`${
                activeTab === 'book'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Book Shuttle
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Trips
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`${
                activeTab === 'wallet'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Wallet
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Booking History
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'book' && (
            <ShuttleBooking onBookingComplete={handleBooking} />
          )}
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingTrips.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No upcoming trips found
                </p>
              ) : (
                upcomingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {trip.route}
                        </h3>
                        <p className="text-sm text-gray-500">
                          From: {trip.from} → To: {trip.to}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {trip.date} | Time: {trip.time}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{trip.price}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                        <button
                          onClick={() => handleCancelTrip(trip.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel Trip
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === 'wallet' && (
            <StudentWallet
              balance={user.wallet_balance}
              onRecharge={handleRecharge}
              expenseReport={expenseReport}  // pass expense report prop
            />
          )}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {bookingHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No booking history found
                </p>
              ) : (
                bookingHistory.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.route}
                        </h3>
                        <p className="text-sm text-gray-500">
                          From: {booking.from} → To: {booking.to}
                        </p>
                        <p className="text-sm text-gray-500">
                          Date: {booking.date} | Time: {booking.time}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{booking.price}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
