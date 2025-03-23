import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Holds the update amount for each student (keyed by student id)
  const [updateAmounts, setUpdateAmounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch all students from the backend
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/students');
      setStudents(response.data.students);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle changes in the input field for a specific student
  const handleAmountChange = (studentId, value) => {
    setUpdateAmounts(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Handle updating points for a student by calling the /points endpoint
  const handleUpdatePoints = async (studentId) => {
    const pointsDelta = parseFloat(updateAmounts[studentId]);
    if (isNaN(pointsDelta)) {
      alert('Please enter a valid number');
      return;
    }
    try {
      const response = await axios.put('http://localhost:5000/api/admin/points', {
        student_id: studentId,
        points_delta: pointsDelta,
        reason: 'Admin update'
      });
      alert(response.data.msg);
      // Refresh the student list to reflect the updated balance
      fetchStudents();
      // Clear the input for this student
      setUpdateAmounts(prev => ({ ...prev, [studentId]: '' }));
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating points');
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Student Management Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            
            {/* Search and Controls */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchStudents} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  <p className="mt-4 text-gray-600">Loading students...</p>
                </div>
              </div>
            ) : (
              /* Student Table */
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Update Points
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          {searchTerm ? "No students match your search criteria" : "No students found"}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-700 font-medium">{student.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              <span className={student.wallet_balance >= 0 ? "text-green-600" : "text-red-600"}>
                                {student.wallet_balance.toFixed(2)} points
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                Points
                              </span>
                              <input
                                type="number"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                placeholder="0.00"
                                value={updateAmounts[student.id] || ''}
                                onChange={(e) => handleAmountChange(student.id, e.target.value)}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => handleUpdatePoints(student.id)}
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;