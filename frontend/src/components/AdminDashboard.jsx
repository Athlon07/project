import React, { useState } from 'react';
import { Menu, Search, Bell, User, Truck, Map, Users, BarChart2, Settings, HelpCircle } from 'lucide-react';

// Components to be rendered based on active tab
import RouteManagement from './admin/RouteManagement';
import StopManagement from './admin/StopManagement';
import RouteMonitoring from './admin/RouteMonitoring';
import StudentManagement from './admin/StudentManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('routes');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Date for the dashboard
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex h-screen bg-gray-50 pt-20 -mb-20">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-5 flex items-center justify-between">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-white">TransitManager</h1>
          ) : (
            <h1 className="text-xl font-bold text-white">TM</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            {sidebarOpen && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</p>}
            <ul className="mt-3 space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('routes')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'routes' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Truck size={20} />
                  {sidebarOpen && <span className="ml-3">Route Management</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stops')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'stops' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Map size={20} />
                  {sidebarOpen && <span className="ml-3">Stop Management</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'monitoring' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <BarChart2 size={20} />
                  {sidebarOpen && <span className="ml-3">Route Monitoring</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'students' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <Users size={20} />
                  {sidebarOpen && <span className="ml-3">Student Management</span>}
                </button>
              </li>
            </ul>
          </div>
          
          {sidebarOpen && (
            <div className="px-4 py-2 mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800">
                    <Settings size={20} />
                    <span className="ml-3">Preferences</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800">
                    <HelpCircle size={20} />
                    <span className="ml-3">Help & Support</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {sidebarOpen ? (
            <div className="flex items-center bg-gray-800 rounded-lg p-2">
              <div className="flex-shrink-0 mr-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@transit.com</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'routes' && "Route Management"}
                {activeTab === 'stops' && "Stop Management"}
                {activeTab === 'monitoring' && "Route Monitoring"}
                {activeTab === 'students' && "Student Management"}
              </h2>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Dashboard Overview</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Export
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">
                  {activeTab === 'routes' && "Add Route"}
                  {activeTab === 'stops' && "Add Stop"}
                  {activeTab === 'monitoring' && "View Reports"}
                  {activeTab === 'students' && "Add Student"}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm font-medium text-blue-700">Total Routes</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">24</p>
                <div className="flex items-center mt-2 text-xs text-blue-600">
                  <span>↑ 12% from last month</span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm font-medium text-green-700">Active Buses</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">18</p>
                <div className="flex items-center mt-2 text-xs text-green-600">
                  <span>↑ 5% from last month</span>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-sm font-medium text-purple-700">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">1,256</p>
                <div className="flex items-center mt-2 text-xs text-purple-600">
                  <span>↑ 8% from last month</span>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm font-medium text-amber-700">Stops</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">86</p>
                <div className="flex items-center mt-2 text-xs text-amber-600">
                  <span>↑ 3% from last month</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Based on Active Tab */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'routes' && <RouteManagement />}
            {activeTab === 'stops' && <StopManagement />}
            {activeTab === 'monitoring' && <RouteMonitoring />}
            {activeTab === 'students' && <StudentManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}