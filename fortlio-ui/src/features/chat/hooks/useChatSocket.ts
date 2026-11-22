import { useEffect, useRef, useState, useCallback } from 'react';
import { getWebSocketUrl } from '@/config/env';
import type { IChatMessage } from '../types';

interface UseChatSocketProps {
  activeConnectionId?: string;
  onMessageReceived?: (message: IChatMessage) => void;
}

export function useChatSocket({ activeConnectionId, onMessageReceived }: UseChatSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const activeTopicRef = useRef<string | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        const token = localStorage.getItem('accessToken');
        if (token) {
          socket.send(JSON.stringify({ action: 'authenticate', token }));
        }

        if (activeConnectionId) {
          const topic = `connection_${activeConnectionId}`;
          socket.send(JSON.stringify({ action: 'subscribe', topic }));
          activeTopicRef.current = topic;
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.event === 'new_message' && payload.data) {
            onMessageReceived?.(payload.data);
          }
        } catch {
          // Ignore unparseable or non-JSON heartbeats
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        activeTopicRef.current = null;
        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current?.();
        }, 3000);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch (err) {
      console.warn('WebSocket connection error:', err);
    }
  }, [activeConnectionId, onMessageReceived]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Synchronize topic subscription when activeConnectionId changes
  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (activeTopicRef.current) {
      socketRef.current.send(JSON.stringify({ action: 'unsubscribe', topic: activeTopicRef.current }));
      activeTopicRef.current = null;
    }

    if (activeConnectionId) {
      const topic = `connection_${activeConnectionId}`;
      socketRef.current.send(JSON.stringify({ action: 'subscribe', topic }));
      activeTopicRef.current = topic;
    }
  }, [activeConnectionId]);

  const sendMessageWs = useCallback((connectionId: string, message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          action: 'send_message',
          connectionId,
          message,
        }),
      );
    }
  }, []);

  return {
    isConnected,
    sendMessageWs,
  };
}
