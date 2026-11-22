import { useState, useEffect, useCallback } from 'react';
import { connectionsApi } from '../api';
import type { IConnection } from '../types';

export function useConnections(currentUserId?: string) {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await connectionsApi.getConnections();
      setConnections(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch connections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const getTargetUserId = (target: any): string => {
    if (!target) return '';
    if (typeof target === 'string') return target;
    return target._id || '';
  };

  const activeConnections = connections.filter((c) => c.status === 'accepted');

  const pendingReceived = connections.filter(
    (c) => c.status === 'pending' && currentUserId && getTargetUserId(c.receiverId) === currentUserId
  );

  const pendingSent = connections.filter(
    (c) => c.status === 'pending' && currentUserId && getTargetUserId(c.senderId) === currentUserId
  );

  return {
    connections,
    activeConnections,
    pendingReceived,
    pendingSent,
    loading,
    error,
    refresh: fetchConnections,
  };
}
