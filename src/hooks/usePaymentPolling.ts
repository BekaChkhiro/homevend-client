import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { balanceApi } from '@/lib/api';

interface PaymentPollingOptions {
  transactionId?: string;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
  interval?: number; // milliseconds
  maxAttempts?: number;
}

interface PendingPayment {
  id: string;
  status: string;
  paymentMethod: string;
  amount: number;
  createdAt: string;
}

export const usePaymentPolling = ({
  transactionId,
  onPaymentSuccess,
  onPaymentFailed,
  interval = 3000, // Poll every 3 seconds
  maxAttempts = 40 // Stop after 2 minutes (40 * 3 seconds)
}: PaymentPollingOptions = {}) => {
  const { user } = useAuth();
  const [isPolling, setIsPolling] = useState(false);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);

  const checkPaymentStatus = async (specificTransactionId?: string) => {
    if (!user) return;

    try {
      const data = await balanceApi.getPendingPayments();
      const pending = data.pendingPayments || [];

      setPendingPayments(pending);

      // If we're looking for a specific transaction
      if (specificTransactionId) {
        const transaction = pending.find((p: PendingPayment) => p.id === specificTransactionId);

        if (!transaction) {
          // Transaction not found in pending - it might be completed or failed
          console.log('Transaction no longer pending:', specificTransactionId);
          stopPolling();
          onPaymentSuccess?.();
          return;
        }
      }

      // Check if any Flitt payments have been completed
      const prevFlittCount = pendingPayments.filter(p => p.paymentMethod === 'flitt').length;
      const currentFlittCount = pending.filter((p: PendingPayment) => p.paymentMethod === 'flitt').length;

      if (prevFlittCount > currentFlittCount && prevFlittCount > 0) {
        console.log('Flitt payment completed detected');
        stopPolling();
        onPaymentSuccess?.();
      }

    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const startPolling = (specificTransactionId?: string) => {
    if (intervalRef.current) return; // Already polling

    console.log('Starting payment polling...', specificTransactionId ? `for transaction ${specificTransactionId}` : '');
    setIsPolling(true);
    attemptsRef.current = 0;

    const poll = async () => {
      attemptsRef.current++;

      if (attemptsRef.current > maxAttempts) {
        console.log('Payment polling max attempts reached');
        stopPolling();
        return;
      }

      await checkPaymentStatus(specificTransactionId);
    };

    // Initial check
    poll();

    // Set up interval
    intervalRef.current = setInterval(poll, interval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    attemptsRef.current = 0;
    console.log('Payment polling stopped');
  };

  // Auto-start polling for specific transaction
  useEffect(() => {
    if (transactionId && user) {
      startPolling(transactionId);
    }

    return () => stopPolling();
  }, [transactionId, user]);

  // Check URL parameters for payment status on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    if (paymentStatus === 'success' && user) {
      // Start brief polling to catch any late callbacks
      console.log('Payment success detected in URL, starting brief polling...');
      setTimeout(() => {
        startPolling();
        // Stop after a shorter time for URL-based detection
        setTimeout(stopPolling, 10000); // 10 seconds
      }, 1000);
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopPolling();
  }, []);

  return {
    isPolling,
    pendingPayments,
    startPolling,
    stopPolling,
    checkPaymentStatus
  };
};