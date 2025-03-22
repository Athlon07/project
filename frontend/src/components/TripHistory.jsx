export default function TripHistory() {
    // Sample trip data
    const trips = [
      { id: 1, date: '2023-10-01', from: 'Library', to: 'Dormitory', points: 4 },
      { id: 2, date: '2023-10-02', from: 'Cafeteria', to: 'Sports Complex', points: 3 },
      { id: 3, date: '2023-10-03', from: 'Main Gate', to: 'Engineering Block', points: 2 },
    ];
  
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Ride History</h2>
          
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
                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{trip.date}</td>
                    <td className="px-6 py-4">{trip.from}</td>
                    <td className="px-6 py-4">{trip.to}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">-{trip.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {trips.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ride history available
            </div>
          )}
        </div>
      </div>
    );
  }