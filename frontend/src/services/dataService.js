// Constants for localStorage keys
const STORAGE_KEYS = {
  USERS: 'shuttle_users',
  BOOKINGS: 'shuttle_bookings',
  WALLETS: 'shuttle_wallets',
  ROUTES: 'shuttle_routes',
  STOPS: 'shuttle_stops'
};

// Mock data for initial setup
const INITIAL_DATA = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'student@university.edu',
      password: 'student123',
      role: 'student'
    },
    {
      id: 2,
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'admin123',
      role: 'admin'
    }
  ],
  bookings: [],
  wallets: {},
  routes: [
    {
      id: 1,
      name: 'Route A - Express',
      stops: ['Library', 'Student Center', 'Sports Complex'],
      duration: '15 min',
      points: 4,
      occupancy: 60,
      price: 2
    },
    {
      id: 2,
      name: 'Route B - Scenic',
      stops: ['Library', 'Science Building', 'Sports Complex'],
      duration: '10 min',
      points: 3,
      occupancy: 40,
      price: 1.5
    },
    {
      id: 3,
      name: 'Route C - Campus Tour',
      stops: ['Library', 'Arts Building', 'Cafeteria', 'Sports Complex'],
      duration: '20 min',
      points: 5,
      occupancy: 30,
      price: 2.5
    },
    {
      id: 4,
      name: 'Route D - Direct',
      stops: ['Library', 'Engineering Block', 'Sports Complex'],
      duration: '12 min',
      points: 3,
      occupancy: 70,
      price: 1.8
    }
  ],
  stops: [
    { id: 1, name: 'Library', location: 'Main Campus' },
    { id: 2, name: 'Sports Complex', location: 'East Campus' },
    { id: 3, name: 'Student Center', location: 'Central Campus' },
    { id: 4, name: 'Dormitory A', location: 'North Campus' },
    { id: 5, name: 'Science Building', location: 'West Campus' },
    { id: 6, name: 'Engineering Block', location: 'South Campus' },
    { id: 7, name: 'Arts Building', location: 'Central Campus' },
    { id: 8, name: 'Cafeteria', location: 'Main Campus' },
    { id: 9, name: 'Parking Lot A', location: 'East Campus' },
    { id: 10, name: 'Medical Center', location: 'West Campus' }
  ]
};

// Initialize data in localStorage if not exists
const initializeData = () => {
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(INITIAL_DATA[key.toLowerCase()]));
    }
  });
};

// Get data from localStorage
const getData = (key) => {
  const data = localStorage.getItem(STORAGE_KEYS[key]);
  return data ? JSON.parse(data) : null;
};

// Save data to localStorage
const saveData = (key, data) => {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
};

// User related functions
const getUserByEmail = (email) => {
  const users = getData('USERS');
  return users.find(user => user.email === email);
};

const createUser = (userData) => {
  const users = getData('USERS');
  const newUser = {
    id: Date.now(),
    ...userData,
    wallet: { balance: 0, transactions: [] }
  };
  users.push(newUser);
  saveData('USERS', users);
  return newUser;
};

// Wallet related functions
const getWallet = (userId) => {
  const wallets = getData('WALLETS');
  return wallets[userId] || { balance: 0, transactions: [] };
};

const updateWallet = (userId, amount, type, description) => {
  const wallets = getData('WALLETS');
  const wallet = wallets[userId] || { balance: 0, transactions: [] };
  
  wallet.balance += amount;
  wallet.transactions.push({
    id: Date.now(),
    amount,
    type,
    description,
    timestamp: new Date().toISOString()
  });
  
  wallets[userId] = wallet;
  saveData('WALLETS', wallets);
  return wallet;
};

// Booking related functions
const getBookings = (userId) => {
  const bookings = getData('BOOKINGS');
  return bookings.filter(booking => booking.userId === userId);
};

const createBooking = (bookingData) => {
  const bookings = getData('BOOKINGS');
  const newBooking = {
    id: Date.now(),
    ...bookingData,
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  saveData('BOOKINGS', bookings);
  return newBooking;
};

const updateBookingStatus = (bookingId, status) => {
  const bookings = getData('BOOKINGS');
  const updatedBookings = bookings.map(booking => 
    booking.id === bookingId ? { ...booking, status } : booking
  );
  saveData('BOOKINGS', updatedBookings);
};

// Route related functions
const getRoutes = () => {
  return getData('ROUTES');
};

const getStops = () => {
  return getData('STOPS');
};

// Initialize data when the service is imported
initializeData();

export {
  getUserByEmail,
  createUser,
  getWallet,
  updateWallet,
  getBookings,
  createBooking,
  updateBookingStatus,
  getRoutes,
  getStops
}; 