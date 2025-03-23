import { useState, useEffect } from 'react';
import { Plus, TrashIcon, Clock, MapPin, Settings, AlertCircle, Truck, Check, X } from 'lucide-react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    name: '',
    stops: [],
    scheduleStart: '08:00',
    scheduleEnd: '20:00'
  });
  const [newStopInput, setNewStopInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const API_URL = 'http://localhost:5000/api/admin/routes';

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const twelveHour = hour % 12 || 12;
    return `${twelveHour}:${minutes} ${period}`;
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    setError('');
    
    // Convert stops to objects if they are strings
    const processedStops = newRoute.stops.map(stop => {
      if (typeof stop === 'string') {
        return {
          name: stop,
          lat: 0, // Default coordinates (you can replace these with actual values)
          lng: 0
        };
      }
      return stop;
    });

    const schedule = `${formatTime(newRoute.scheduleStart)} - ${formatTime(newRoute.scheduleEnd)}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoute.name,
          stops: processedStops,
          schedule
        })
      });

      if (!response.ok) throw new Error('Failed to create route');
      
      await fetchRoutes();
      setNewRoute({
        name: '',
        stops: [],
        scheduleStart: '08:00',
        scheduleEnd: '20:00'
      });
      setNewStopInput('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating route:', error);
      setError('Failed to create route. Please try again.');
    }
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (newStopInput.trim()) {
      setNewRoute(prev => ({
        ...prev,
        stops: [...prev.stops, newStopInput.trim()]
      }));
      setNewStopInput('');
    }
  };

  const handleDeleteRoute = async (routeId) => {
    setError('');
    try {
      const response = await fetch(`${API_URL}/${routeId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete route');
      await fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      setError('Failed to delete route. Please try again.');
    }
  };

  return (
    <div>
      {/* Header with stats */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Routes</p>
              <h3 className="text-3xl font-bold mt-2">{routes.length}</h3>
              <p className="mt-2 text-blue-100 text-sm">
                {routes.length > 0 ? `${routes.reduce((acc, route) => acc + route.stops.length, 0)} total stops managed` : 'No routes configured'}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Truck size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm flex items-center">
          <AlertCircle size={20} className="text-red-500 mr-3" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Add Route Button */}
      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <Plus size={18} />
            Create New Route
          </button>
        </div>
      )}

      {/* Add New Route Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Plus size={18} className="mr-2" /> Create New Route
            </h3>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddRoute} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter route name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      value={newRoute.scheduleStart}
                      onChange={(e) => setNewRoute({ ...newRoute, scheduleStart: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      value={newRoute.scheduleEnd}
                      onChange={(e) => setNewRoute({ ...newRoute, scheduleEnd: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stops</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newStopInput}
                      onChange={(e) => setNewStopInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="Add a stop location"
                    />
                  </div>
                  <button
                    onClick={handleAddStop}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center gap-1"
                    type="button"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                {newRoute.stops.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">Added Stops ({newRoute.stops.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {newRoute.stops.map((stop, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center"
                        >
                          <MapPin size={14} className="mr-1" />
                          {typeof stop === 'string' ? stop : stop.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Check size={16} />
                      Create Route
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Settings size={18} className="mr-2 text-gray-500" /> Route Configuration
          </h3>
          <div className="text-sm text-gray-500">
            {routes.length} {routes.length === 1 ? 'route' : 'routes'} configured
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading routes...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-gray-100 rounded-full mb-4">
                <Truck size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-600">No routes configured yet</p>
              <p className="text-gray-500 text-sm mt-1">Create your first route using the button above</p>
            </div>
          ) : (
            routes.map(route => (
              <div key={route.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap md:flex-nowrap justify-between items-start">
                  <div className="w-full md:w-auto md:flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-lg text-gray-900">{route.name}</h4>
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <Clock size={16} className="mr-2" />
                      <span>{route.schedule}</span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        Stops ({route.stops.length})
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center p-2 bg-white rounded-md border border-gray-200">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2 text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-gray-800 truncate">
                              {typeof stop === 'string' ? stop : stop.name}
                            </span>
                            {typeof stop === 'object' && (
                              <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">
                                ({stop.lat}, {stop.lng})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 ml-0 md:ml-4">
                    <button
                      onClick={() => handleDeleteRoute(route.id)}
                      className="flex items-center px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      disabled={loading}
                    >
                      <TrashIcon size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}