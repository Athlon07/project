import { useState, useEffect } from "react";
import { useAuth } from "../authContext";

export default function TripHistory() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const response = await fetch(`/api/booking/history/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip history");
        }
        const data = await response.json();
        const formattedTrips = data.bookings.map((booking) => ({
          id: booking._id,
          date: new Date(booking.timestamp).toLocaleDateString(),
          from: booking.pickup,
          to: booking.dropoff,
          points: booking.fare, // Assuming fare is equivalent to points used
        }));
        setTrips(formattedTrips);
      } catch (error) {
        console.error("Error fetching trip history:", error);
      }
    };

    if (user?.id) {
      fetchTripHistory();
    }
  }, [user.id]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Your Ride History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">From</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">To</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Points Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.date}</td>
                    <td className="px-6 py-4">{trip.from}</td>
                    <td className="px-6 py-4">{trip.to}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">-{trip.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-gray-500">
                    No ride history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
