export default function RouteCard({ route }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{route.name}</h3>
            <p className="text-gray-600">{route.duration} mins</p>
            {route.transfer && (
              <div className="mt-2 text-sm text-gray-500">
                Transfer at {route.transfer}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{route.points} pts</div>
            <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Select
            </button>
          </div>
        </div>
      </div>
    );
  }