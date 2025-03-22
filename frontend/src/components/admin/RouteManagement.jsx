import { useState } from 'react';

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({
    name: '',
    description: '',
    stops: [],
    schedule: {
      morning: { start: '', end: '' },
      evening: { start: '', end: '' }
    },
    capacity: 0
  });

  const handleAddRoute = (e) => {
    e.preventDefault();
    setRoutes([...routes, { ...newRoute, id: Date.now() }]);
    setNewRoute({
      name: '',
      description: '',
      stops: [],
      schedule: {
        morning: { start: '', end: '' },
        evening: { start: '', end: '' }
      },
      capacity: 0
    });
  };

  const handleAddStop = (routeId, stop) => {
    setRoutes(routes.map(route => {
      if (route.id === routeId) {
        return {
          ...route,
          stops: [...route.stops, stop]
        };
      }
      return route;
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Route Management</h2>
      
      {/* Add New Route Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Route</h3>
        <form onSubmit={handleAddRoute} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Route Name</label>
            <input
              type="text"
              value={newRoute.name}
              onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newRoute.description}
              onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Morning Start Time</label>
              <input
                type="time"
                value={newRoute.schedule.morning.start}
                onChange={(e) => setNewRoute({
                  ...newRoute,
                  schedule: { ...newRoute.schedule, morning: { ...newRoute.schedule.morning, start: e.target.value } }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Morning End Time</label>
              <input
                type="time"
                value={newRoute.schedule.morning.end}
                onChange={(e) => setNewRoute({
                  ...newRoute,
                  schedule: { ...newRoute.schedule, morning: { ...newRoute.schedule.morning, end: e.target.value } }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Evening Start Time</label>
              <input
                type="time"
                value={newRoute.schedule.evening.start}
                onChange={(e) => setNewRoute({
                  ...newRoute,
                  schedule: { ...newRoute.schedule, evening: { ...newRoute.schedule.evening, start: e.target.value } }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Evening End Time</label>
              <input
                type="time"
                value={newRoute.schedule.evening.end}
                onChange={(e) => setNewRoute({
                  ...newRoute,
                  schedule: { ...newRoute.schedule, evening: { ...newRoute.schedule.evening, end: e.target.value } }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Capacity</label>
            <input
              type="number"
              value={newRoute.capacity}
              onChange={(e) => setNewRoute({ ...newRoute, capacity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Route
          </button>
        </form>
      </div>

      {/* Routes List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Routes</h3>
        <div className="space-y-4">
          {routes.map(route => (
            <div key={route.id} className="border rounded-lg p-4">
              <h4 className="font-semibold">{route.name}</h4>
              <p className="text-gray-600">{route.description}</p>
              <div className="mt-2">
                <h5 className="font-medium">Schedule:</h5>
                <p>Morning: {route.schedule.morning.start} - {route.schedule.morning.end}</p>
                <p>Evening: {route.schedule.evening.start} - {route.schedule.evening.end}</p>
              </div>
              <div className="mt-2">
                <h5 className="font-medium">Stops:</h5>
                <ul className="list-disc list-inside">
                  {route.stops.map((stop, index) => (
                    <li key={index}>{stop}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <p>Capacity: {route.capacity} passengers</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 