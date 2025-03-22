import { useState } from 'react';
import RouteManagement from './admin/RouteManagement';
import StopManagement from './admin/StopManagement';
import RouteMonitoring from './admin/RouteMonitoring';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('routes')}
              className={`${
                activeTab === 'routes'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Route Management
            </button>
            <button
              onClick={() => setActiveTab('stops')}
              className={`${
                activeTab === 'stops'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Stop Management
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`${
                activeTab === 'monitoring'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Route Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'routes' && <RouteManagement />}
        {activeTab === 'stops' && <StopManagement />}
        {activeTab === 'monitoring' && <RouteMonitoring />}
      </div>
    </div>
  );
}