import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchChatHistory, sendChatMessage } from '../api';
import { useChatSocket } from './useChatSocket';
import type { IChatMessage } from '../types';

interface UseChatMessagesProps {
  connectionId?: string;
  currentUserId?: string;
}

export function useChatMessages({ connectionId, currentUserId }: UseChatMessagesProps) {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectionIdRef = useRef(connectionId);

  useEffect(() => {
    connectionIdRef.current = connectionId;
  }, [connectionId]);

  // Handle live incoming messages from WebSocket
  const handleLiveMessage = useCallback(
    (newMsg: IChatMessage) => {
      if (newMsg.connectionId === connectionIdRef.current) {
        setMessages((prev) => {
          // Avoid duplicate messages if already rendered optimistically or fetched
          if (newMsg._id && prev.some((m) => m._id === newMsg._id)) {
            return prev;
          }
          return [...prev, newMsg];
        });
      }
    },
    [],
  );

  const { isConnected } = useChatSocket({
    activeConnectionId: connectionId,
    onMessageReceived: handleLiveMessage,
  });

  const loadMessages = useCallback(async () => {
    if (!connectionId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchChatHistory(connectionId, 1, 100);
      // Backend returns descending (newest first); reverse to chronological (oldest to newest)
      const chronological = [...result.messages].reverse();
      setMessages(chronological);
    } catch (err: any) {
      console.warn('Failed to load chat history:', err);
      setError(err?.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [connectionId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !connectionId) {
        return;
      }

      const optimisticMsg: IChatMessage = {
        connectionId,
        senderId: currentUserId || '',
        message: text.trim(),
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      setMessages((prev) => [...prev, optimisticMsg]);
      setSending(true);

      try {
        const savedMsg = await sendChatMessage(connectionId, text.trim());
        if (savedMsg?._id) {
          // Replace or update optimistic message with saved message
          setMessages((prev) =>
            prev.map((m) => (m === optimisticMsg ? savedMsg : m)),
          );
        }
      } catch (err: any) {
        console.warn('Failed to send message:', err);
        // Remove optimistic message if send failed
        setMessages((prev) => prev.filter((m) => m !== optimisticMsg));
        throw err;
      } finally {
        setSending(false);
      }
    },
    [connectionId, currentUserId],
  );

  return {
    messages,
    loading,
    sending,
    error,
    isConnected,
    sendMessage,
    refreshMessages: loadMessages,
  };
}
