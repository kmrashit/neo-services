import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchActiveConnections } from '../api';
import type { IConnection, IConnectionUser } from '../types';

export function useActiveConversation(initialConnectionId?: string | null, currentUserId?: string) {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(initialConnectionId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const loadConnections = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchActiveConnections();
      setConnections(list);

      // If initialConnectionId provided, activate it, otherwise default to first connection
      if (initialConnectionId && list.some((c) => c._id === initialConnectionId)) {
        setActiveConnectionId(initialConnectionId);
      } else if (!activeConnectionId && list.length > 0) {
        setActiveConnectionId(list[0]._id);
      }
    } catch (err) {
      console.warn('Failed to fetch active connections:', err);
    } finally {
      setLoading(false);
    }
  }, [initialConnectionId, activeConnectionId]);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const activeConnection = useMemo(
    () => connections.find((c) => c._id === activeConnectionId) || null,
    [connections, activeConnectionId],
  );

  const getOtherUser = useCallback(
    (connection: IConnection): IConnectionUser => {
      const sender = typeof connection.senderId === 'object' ? connection.senderId : { _id: connection.senderId, fullName: 'User' };
      const receiver = typeof connection.receiverId === 'object' ? connection.receiverId : { _id: connection.receiverId, fullName: 'User' };

      if (currentUserId && sender._id === currentUserId) {
        return receiver;
      }
      return sender;
    },
    [currentUserId],
  );

  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) {
      return connections;
    }
    const q = searchQuery.toLowerCase();
    return connections.filter((conn) => {
      const other = getOtherUser(conn);
      return (
        other.fullName?.toLowerCase().includes(q) ||
        other.email?.toLowerCase().includes(q) ||
        other.headline?.toLowerCase().includes(q) ||
        other.profession?.toLowerCase().includes(q) ||
        other.skills?.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [connections, searchQuery, getOtherUser]);

  return {
    connections: filteredConnections,
    allConnections: connections,
    activeConnection,
    activeConnectionId,
    setActiveConnectionId,
    searchQuery,
    setSearchQuery,
    loading,
    refreshConnections: loadConnections,
    getOtherUser,
  };
}
