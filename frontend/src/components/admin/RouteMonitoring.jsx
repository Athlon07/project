import { useState } from 'react';

export default function RouteMonitoring() {
  const [activeRoutes, setActiveRoutes] = useState([
    {
      id: 1,
      name: 'Morning Route A',
      vehicle: 'Shuttle 1',
      currentStop: 'Main Campus',
      nextStop: 'Library',
      passengers: 12,
      capacity: 20,
      status: 'on-time'
    },
    {
      id: 2,
      name: 'Evening Route B',
      vehicle: 'Shuttle 2',
      currentStop: 'Student Center',
      nextStop: 'Dormitory A',
      passengers: 18,
      capacity: 20,
      status: 'delayed'
    }
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'Shuttle 1',
      status: 'active',
      currentRoute: 'Morning Route A',
      lastMaintenance: '2024-03-20'
    },
    {
      id: 2,
      name: 'Shuttle 2',
      status: 'active',
      currentRoute: 'Evening Route B',
      lastMaintenance: '2024-03-19'
    },
    {
      id: 3,
      name: 'Shuttle 3',
      status: 'maintenance',
      currentRoute: 'None',
      lastMaintenance: '2024-03-21'
    }
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Route Monitoring</h2>

      {/* Active Routes */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Active Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeRoutes.map(route => (
            <div key={route.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{route.name}</h4>
                  <p className="text-gray-600">Vehicle: {route.vehicle}</p>
                  <div className="mt-2">
                    <p className="text-sm">Current Stop: {route.currentStop}</p>
                    <p className="text-sm">Next Stop: {route.nextStop}</p>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(route.passengers / route.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm">
                        {route.passengers}/{route.capacity}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  route.status === 'on-time' ? 'bg-green-100 text-green-800' :
                  route.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vehicle Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Vehicle Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{vehicle.name}</h4>
                  <p className="text-gray-600">Route: {vehicle.currentRoute}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last Maintenance: {vehicle.lastMaintenance}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 