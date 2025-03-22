import { useState } from 'react';

export default function StopManagement() {
  const [stops, setStops] = useState([]);
  const [newStop, setNewStop] = useState({
    name: '',
    location: '',
    description: '',
    peakHours: {
      start: '',
      end: ''
    },
    demand: 'medium' // low, medium, high
  });

  const handleAddStop = (e) => {
    e.preventDefault();
    setStops([...stops, { ...newStop, id: Date.now() }]);
    setNewStop({
      name: '',
      location: '',
      description: '',
      peakHours: {
        start: '',
        end: ''
      },
      demand: 'medium'
    });
  };

  const handleDeleteStop = (stopId) => {
    setStops(stops.filter(stop => stop.id !== stopId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Stop Management</h2>

      {/* Add New Stop Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Stop</h3>
        <form onSubmit={handleAddStop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stop Name</label>
            <input
              type="text"
              value={newStop.name}
              onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={newStop.location}
              onChange={(e) => setNewStop({ ...newStop, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newStop.description}
              onChange={(e) => setNewStop({ ...newStop, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Peak Hours Start</label>
              <input
                type="time"
                value={newStop.peakHours.start}
                onChange={(e) => setNewStop({
                  ...newStop,
                  peakHours: { ...newStop.peakHours, start: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Peak Hours End</label>
              <input
                type="time"
                value={newStop.peakHours.end}
                onChange={(e) => setNewStop({
                  ...newStop,
                  peakHours: { ...newStop.peakHours, end: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Demand Level</label>
            <select
              value={newStop.demand}
              onChange={(e) => setNewStop({ ...newStop, demand: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Stop
          </button>
        </form>
      </div>

      {/* Stops List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Stops</h3>
        <div className="space-y-4">
          {stops.map(stop => (
            <div key={stop.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{stop.name}</h4>
                  <p className="text-gray-600">{stop.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{stop.description}</p>
                  <div className="mt-2">
                    <h5 className="font-medium">Peak Hours:</h5>
                    <p>{stop.peakHours.start} - {stop.peakHours.end}</p>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      stop.demand === 'high' ? 'bg-red-100 text-red-800' :
                      stop.demand === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {stop.demand.charAt(0).toUpperCase() + stop.demand.slice(1)} Demand
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteStop(stop.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 