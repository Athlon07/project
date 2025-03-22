import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import TripHistory from './components/TripHistory';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <Navigate to="/auth" />
      } />
      <Route path="/auth" element={
        user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} /> : <AuthPage />
      } />
      <Route path="/dashboard" element={
        user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/auth" />
      } />
      <Route path="/admin/dashboard" element={
        user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />
      } />
      <Route path="/history" element={
        user ? <TripHistory /> : <Navigate to="/auth" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}