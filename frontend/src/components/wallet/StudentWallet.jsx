import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet, Plus, X } from 'lucide-react';

export default function StudentWallet({ balance, onRecharge, expenseReport }) {
  const [amount, setAmount] = useState('');
  const [showRechargeForm, setShowRechargeForm] = useState(false);

  const handleRecharge = (e) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onRecharge(parseFloat(amount));
      setAmount('');
      setShowRechargeForm(false);
    }
  };

  // Get recent transactions from expense report or use default
  const transactions = expenseReport?.bookings?.length > 0
    ? expenseReport.bookings.map(booking => ({
        id: booking.id || booking._id,
        type: 'Shuttle Booking',
        description: `${booking.pickup} → ${booking.dropoff}`,
        amount: -booking.fare,
        date: booking.date || new Date().toLocaleDateString()
      }))
    : [
        {
          id: 'tx1',
          type: 'Shuttle Booking',
          description: 'Route A - Library to Sports Complex',
          amount: -2.00,
          date: new Date().toLocaleDateString()
        },
        {
          id: 'tx2',
          type: 'Wallet Recharge',
          description: 'Online Payment',
          amount: 100.00,
          date: new Date(Date.now() - 86400000).toLocaleDateString()
        }
      ];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {/* Header with balance */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Wallet className="mr-2 text-emerald-600" size={24} />
              Campus Wallet
            </h2>
            <p className="text-gray-600 mt-1">Manage your shuttle funds</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-500">Available Balance</span>
            <span className="text-3xl font-bold text-emerald-600">₹{balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Recharge button and form */}
      <div className="px-6 pt-4">
        {!showRechargeForm ? (
          <button
            onClick={() => setShowRechargeForm(true)}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center font-medium"
          >
            <Plus size={18} className="mr-2" />
            Recharge Wallet
          </button>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-800">Add Money</h3>
              <button 
                onClick={() => setShowRechargeForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRecharge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="block w-full rounded-lg border-gray-200 border px-4 py-3 focus:border-emerald-500 focus:ring-emerald-500 text-lg"
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowRechargeForm(false)}
                  className="bg-white text-gray-700 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Transaction history */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          Recent Transactions
        </h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
            >
              <div className={`mr-3 p-2 rounded-full ${
                tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {tx.amount > 0 ? 
                  <ArrowUpRight size={16} /> : 
                  <ArrowDownRight size={16} />
                }
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-800">{tx.type}</p>
                <p className="text-sm text-gray-500">{tx.description}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
              
              <div className={`text-right font-medium ${
                tx.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}