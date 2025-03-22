import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function RouteDetails({ routeId, isTransfer }) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await api.get(`/routes/${routeId}`);
        setRoute(response.data);
      } catch (err) {
        console.error('Failed to load route:', err);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) fetchRoute();
  }, [routeId]);

  if (loading) return <div className="text-gray-600">Loading route details...</div>;

  return (
    <div className="route-details text-sm">
      {route ? (
        <>
          <h4 className="font-medium mb-2">
            {isTransfer ? 'First Route Details' : 'Route Details'}
          </h4>
          <p className="text-gray-600">
            🚏 Stops: {route.stops.map((stop, index) => (
              <span key={index}>
                {stop.name}{index < route.stops.length - 1 ? ' → ' : ''}
              </span>
            ))}
          </p>
          <p className="text-gray-600 mt-1">
            ⏱️ Average Duration: {route.duration || 'N/A'}
          </p>
        </>
      ) : (
        <p className="text-red-500">Route information unavailable</p>
      )}
    </div>
  );
}