import { useState, useEffect } from 'react';
import { useAuth } from '../../authContext';
import { getRoutes, getStops, createBooking } from '../../services/dataService';

// Mock data for demonstration
const MOCK_STOPS = [
  { id: 1, name: 'Library', location: 'Main Campus' },
  { id: 2, name: 'Sports Complex', location: 'East Campus' },
  { id: 3, name: 'Student Center', location: 'Central Campus' },
  { id: 4, name: 'Dormitory A', location: 'North Campus' },
  { id: 5, name: 'Science Building', location: 'West Campus' },
  { id: 6, name: 'Engineering Block', location: 'South Campus' },
  { id: 7, name: 'Arts Building', location: 'Central Campus' },
  { id: 8, name: 'Cafeteria', location: 'Main Campus' },
  { id: 9, name: 'Parking Lot A', location: 'East Campus' },
  { id: 10, name: 'Medical Center', location: 'West Campus' }
];

const MOCK_ROUTES = [
  {
    id: 1,
    name: 'Route A - Express',
    stops: ['Library', 'Student Center', 'Sports Complex'],
    duration: '15 min',
    points: 4,
    occupancy: 60,
    price: 2
  },
  {
    id: 2,
    name: 'Route B - Scenic',
    stops: ['Library', 'Science Building', 'Sports Complex'],
    duration: '10 min',
    points: 3,
    occupancy: 40,
    price: 1.5
  },
  {
    id: 3,
    name: 'Route C - Campus Tour',
    stops: ['Library', 'Arts Building', 'Cafeteria', 'Sports Complex'],
    duration: '20 min',
    points: 5,
    occupancy: 30,
    price: 2.5
  },
  {
    id: 4,
    name: 'Route D - Direct',
    stops: ['Library', 'Engineering Block', 'Sports Complex'],
    duration: '12 min',
    points: 3,
    occupancy: 70,
    price: 1.8
  }
];

export default function ShuttleBooking({ onBookingComplete }) {
  const { user, updateWallet } = useAuth();
  const [booking, setBooking] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    selectedRoute: null
  });
  const [suggestedRoutes, setSuggestedRoutes] = useState([]);
  const [nearbyStops, setNearbyStops] = useState([]);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    // Load routes and stops on component mount
    setRoutes(getRoutes());
    setStops(getStops());
  }, []);

  const handleLocationSearch = (location) => {
    const filteredStops = stops.filter(stop => 
      stop.name.toLowerCase().includes(location.toLowerCase()) ||
      stop.location.toLowerCase().includes(location.toLowerCase())
    );
    setNearbyStops(filteredStops);
  };

  const findRoutes = () => {
    if (!booking.from || !booking.to) return;

    const availableRoutes = routes.filter(route => 
      route.stops.includes(booking.from) && 
      route.stops.includes(booking.to)
    );
    setSuggestedRoutes(availableRoutes);
  };

  const handleBooking = () => {
    if (!booking.selectedRoute) {
      setError('Please select a route first');
      return;
    }
    
    if (!booking.date || !booking.time) {
      setError('Please select both date and time');
      return;
    }

    // Check if user has enough balance
    if (user.wallet.balance < booking.selectedRoute.price) {
      setError('Insufficient balance. Please recharge your wallet.');
      return;
    }

    // Create booking object
    const newBooking = {
      userId: user.id,
      route: booking.selectedRoute.name,
      from: booking.from,
      to: booking.to,
      date: booking.date,
      time: booking.time,
      price: booking.selectedRoute.price,
      status: 'upcoming'
    };

    // Create booking in data service
    const createdBooking = createBooking(newBooking);

    // Deduct amount from wallet
    updateWallet(
      -booking.selectedRoute.price,
      'booking',
      `Shuttle Booking - ${booking.selectedRoute.name}`
    );

    // Pass booking data to parent
    onBookingComplete(createdBooking);

    // Reset form
    setBooking({
      from: '',
      to: '',
      date: '',
      time: '',
      selectedRoute: null
    });
    setSuggestedRoutes([]);
    setError('');
    alert('Booking confirmed! You can view your upcoming trip in the "Upcoming Trips" tab.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Book a Shuttle</h2>

      {/* Wallet Balance */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Balance:</span>
          <span className="text-xl font-bold text-green-600">
            ₹{user.wallet.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From</label>
            <input
              type="text"
              value={booking.from}
              onChange={(e) => {
                setBooking({ ...booking, from: e.target.value });
                handleLocationSearch(e.target.value);
              }}
              placeholder="Enter location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {nearbyStops.length > 0 && (
              <div className="mt-1">
                {nearbyStops.map(stop => (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setBooking({ ...booking, from: stop.name });
                      setNearbyStops([]);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100"
                  >
                    {stop.name} ({stop.location})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="text"
              value={booking.to}
              onChange={(e) => {
                setBooking({ ...booking, to: e.target.value });
                handleLocationSearch(e.target.value);
              }}
              placeholder="Enter location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={booking.date}
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={booking.time}
              onChange={(e) => setBooking({ ...booking, time: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={findRoutes}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Find Routes
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Suggested Routes */}
      {suggestedRoutes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Suggested Routes</h3>
          <div className="space-y-4">
            {suggestedRoutes.map(route => (
              <div
                key={route.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  booking.selectedRoute?.id === route.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setBooking({ ...booking, selectedRoute: route })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{route.name}</h4>
                    <p className="text-sm text-gray-600">
                      Stops: {route.stops.join(' → ')}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Duration: {route.duration} | Points: {route.points}
                      </p>
                      <p className="text-sm">
                        Price: ₹{route.price}
                      </p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${route.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">
                          {route.occupancy}% Occupied
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!booking.date || !booking.time) {
                        setError('Please select both date and time before booking');
                        return;
                      }
                      handleBooking();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Book Now
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