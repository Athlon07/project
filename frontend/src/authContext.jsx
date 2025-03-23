import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { rechargeWallet as rechargeWalletAPI } from './services/walletService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Admin email - you can change this to your preferred admin email
  const ADMIN_EMAIL = "admin@bennett.edu.in";

  // Load user from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Check if the user is an admin
      setIsAdmin(parsedUser.email === ADMIN_EMAIL);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Login failed');

      // Check if the user is an admin
      const adminStatus = email === ADMIN_EMAIL;
      
      // Save user data to localStorage
      const userData = {
        ...data.student,
        email: email // Make sure email is included in user data
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(adminStatus);
      
      // Redirect based on user role
      if (adminStatus) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Registration failed');

      // Save user data with email
      const userData = {
        ...data.student,
        email: email
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAdmin(false); // New registrations are never admins
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    navigate('/auth');
  };

  const updateWallet = async (amount, type, description) => {
    if (type === 'recharge') {
      try {
        const newBalance = await rechargeWalletAPI(user.id, amount);
        // Update the user object and localStorage with the new balance
        const updatedUser = { ...user, wallet_balance: newBalance };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Wallet recharge failed", err);
      }
    } else {
      // For other wallet updates (e.g., fare deduction), update locally
      const updatedUser = { ...user, wallet_balance: user.wallet_balance + amount };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = { user, isAdmin, login, register, logout, updateWallet };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
