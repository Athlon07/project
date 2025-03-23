import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import TripHistory from './components/TripHistory';
import AdminDashboard from './components/AdminDashboard'; // Import the AdminDashboard

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Navigate to="/auth" />
      } />
      <Route path="/auth" element={
        user ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <AuthPage />
      } />
      <Route path="/dashboard" element={
        user ? (isAdmin ? <Navigate to="/admin" /> : <StudentDashboard />) : <Navigate to="/auth" />
      } />
      <Route path="/history" element={
        user ? (isAdmin ? <Navigate to="/admin" /> : <TripHistory />) : <Navigate to="/auth" />
      } />
      <Route path="/admin" element={
        user && isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}