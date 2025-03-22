import { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import api from '../../services/api'; // Create this service file

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

  const handleLocationSearch = async () => {
    if (!booking.start_stop || !booking.destination_stop) {
      setError('Please enter both start and destination stops');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/booking/suggest', {
        start_stop: booking.start_stop,
        destination_stop: booking.destination_stop
      });
      
      setSuggestions(response.data.suggestions);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch route suggestions');
    } finally {
      setLoading(false);
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
          // Use the first route's id or choose one based on your business logic
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
            <body style="text-align: center; padding: 20px;">
              <h2>Booking Confirmation</h2>
              <img src="data:image/png;base64,${response.data.booking.qr_code}" 
                   alt="Booking QR Code" 
                   style="max-width: 300px; margin: 20px auto;"/>
              <p>Pickup: ${booking.start_stop}</p>
              <p>Dropoff: ${booking.destination_stop}</p>
              <p>Fare: ₹${response.data.booking.fare}</p>
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Book Shuttle</h2>

      {/* Wallet Balance */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Balance:</span>
          <span className="text-xl font-bold text-green-600">
            ₹{user.wallet_balance?.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              value={booking.start_stop}
              onChange={(e) => setBooking({ ...booking, start_stop: e.target.value })}
              placeholder="Enter pickup location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              value={booking.destination_stop}
              onChange={(e) => setBooking({ ...booking, destination_stop: e.target.value })}
              placeholder="Enter dropoff location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleLocationSearch}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Find Routes'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Route Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Available Routes</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer ${
                  booking.selectedSuggestion === suggestion
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setBooking({ ...booking, selectedSuggestion: suggestion })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {suggestion.type === 'transfer' ? (
                        <>
                          {suggestion.first_route.route_name} → {suggestion.second_route.route_name}
                          <span className="text-sm text-gray-600 ml-2">
                            (Transfer at {suggestion.transfer_stop})
                          </span>
                        </>
                      ) : (
                        suggestion.route_name
                      )}
                    </h4>
                    
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Travel Time: {suggestion.travel_time_minutes || suggestion.total_travel_time} mins
                      </p>
                      <p className="text-sm">
                        Fare: ₹{suggestion.fare || suggestion.total_fare}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBooking();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}