import { useState } from 'react';
import { connectionsApi } from '../api';

export function useConnectionActions(onSuccess?: () => void) {
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async (receiverId: string, message?: string) => {
    try {
      setActionLoading(true);
      setError(null);
      const result = await connectionsApi.createConnection(receiverId, message);
      if (onSuccess) {onSuccess();}
      return result;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send connection request';
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const respondToRequest = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      setActionLoading(true);
      setError(null);
      const result = await connectionsApi.respondToConnection(connectionId, action);
      if (onSuccess) {onSuccess();}
      return result;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || `Failed to ${action} connection`;
      setError(msg);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    sendRequest,
    respondToRequest,
    actionLoading,
    error,
  };
}
