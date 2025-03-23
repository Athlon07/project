import { Clock, MapPin, ArrowRight, Navigation, Award } from 'lucide-react';

export default function RouteCard({ route }) {
  // Determine if this is a popular route (could be based on data or props)
  const isPopular = route.popular || false;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      {/* Route info section */}
      <div className="p-5">
        <div className="flex justify-between items-start">
          {/* Left side - Route info */}
          <div className="flex-1">
            {/* Route name with badge if popular */}
            <div className="flex items-center">
              <h3 className="font-bold text-lg text-gray-800">{route.name}</h3>
              {isPopular && (
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Award size={12} className="mr-1" />
                  Popular
                </span>
              )}
            </div>
            
            {/* Route stops */}
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <MapPin size={14} className="text-emerald-600 mr-1 flex-shrink-0" />
              <div className="flex items-center">
                <span className="truncate max-w-32">{route.from || 'Start Location'}</span>
                <ArrowRight size={12} className="mx-1 text-gray-400" />
                <span className="truncate max-w-32">{route.to || 'End Location'}</span>
              </div>
            </div>
            
            {/* Route details */}
            <div className="mt-3 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-1 text-emerald-600" />
                <span>{route.duration} mins</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Navigation size={14} className="mr-1 text-emerald-600" />
                <span>{route.distance || '2.5'} km</span>
              </div>
            </div>
            
            {/* Transfer info if applicable */}
            {route.transfer && (
              <div className="mt-2 text-xs font-medium py-1 px-2 bg-gray-50 rounded inline-flex items-center text-gray-600 border border-gray-100">
                <span className="mr-1">Transfer at</span>
                <span className="text-gray-800">{route.transfer}</span>
              </div>
            )}
          </div>
          
          {/* Right side - Points and action */}
          <div className="text-right flex flex-col items-end">
            {/* Points badge */}
            <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="text-lg font-bold text-emerald-700">{route.points} pts</div>
            </div>
            
            {/* Select button */}
            <button className="mt-3 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Select Route
            </button>
          </div>
        </div>
      </div>
      
      {/* Optional: Progress bar to show how full the shuttle is */}
      {route.occupancy && (
        <div className="px-5 pb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Shuttle Capacity</span>
            <span>{route.occupancy}% Full</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                route.occupancy > 80 ? 'bg-red-500' : 
                route.occupancy > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${route.occupancy}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Bottom decorative bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"></div>
    </div>
  );
}