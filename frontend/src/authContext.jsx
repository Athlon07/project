import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Admin credentials (in a real app, this would be handled by the backend)
const ADMIN_CREDENTIALS = {
  email: 'admin@university.edu',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure wallet balance exists
      if (parsedUser.role === 'student' && !parsedUser.wallet) {
        parsedUser.wallet = {
          balance: 0,
          transactions: []
        };
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Check if it's an admin login
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const userData = {
          email,
          role: 'admin',
          name: 'Admin User'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      // For regular users (demo purposes)
      const userData = {
        email,
        role: 'student',
        name: email.split('@')[0],
        wallet: {
          balance: 0,
          transactions: []
        }
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateWallet = (amount, type, description) => {
    if (!user || user.role !== 'student') return;

    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance: user.wallet.balance + amount,
        transactions: [
          {
            id: Date.now(),
            amount,
            type,
            description,
            timestamp: new Date().toISOString()
          },
          ...user.wallet.transactions
        ]
      }
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}