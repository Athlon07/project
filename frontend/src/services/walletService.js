// walletService.js
import api from './api';

export const getWalletBalance = async (studentId) => {
  try {
    const response = await api.get(`/wallet/balance/${studentId}`);
    return response.data.wallet_balance;
  } catch (err) {
    throw err;
  }
};

export const rechargeWallet = async (studentId, amount) => {
  try {
    const response = await api.post('/wallet/recharge', {
      student_id: studentId,
      amount: amount,
    });
    return response.data.wallet_balance;
  } catch (err) {
    throw err;
  }
};
