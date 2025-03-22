import { useState } from 'react';

export default function StudentWallet({ balance, onRecharge }) {
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Wallet</h2>
          <p className="text-gray-600">Available Balance</p>
        </div>
        <div className="text-3xl font-bold text-green-600">
          ₹{balance.toFixed(2)}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowRechargeForm(!showRechargeForm)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Recharge Wallet
        </button>

        {showRechargeForm && (
          <form onSubmit={handleRecharge} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Confirm Recharge
              </button>
              <button
                type="button"
                onClick={() => setShowRechargeForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {/* Mock transactions - in a real app, these would come from an API */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Shuttle Booking</p>
                <p className="text-sm text-gray-600">Route A - Library to Sports Complex</p>
              </div>
              <div className="text-red-600">-₹2.00</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Wallet Recharge</p>
                <p className="text-sm text-gray-600">Online Payment</p>
              </div>
              <div className="text-green-600">+₹100.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 