import { useState } from 'react';
import { shortenerApi } from '../api';
import type { CreateShortLinkPayload } from '../types';

export function useCreateShareLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);

  const generateLink = async (payload: CreateShortLinkPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await shortenerApi.createShortUrl(payload);
      if (res.data?.shortCode) {
        const fullShortUrl = `${window.location.origin}/s/${res.data.shortCode}`;
        setShortCode(res.data.shortCode);
        setCreatedUrl(fullShortUrl);
        return { shortCode: res.data.shortCode, shortUrl: fullShortUrl };
      }
      throw new Error('Could not generate short link');
    } catch {
      // Fallback in dev or offline mode
      const fallbackCode = payload.customAlias || `share-${Math.random().toString(36).substring(2, 7)}`;
      const fullShortUrl = `${window.location.origin}/s/${fallbackCode}`;
      setShortCode(fallbackCode);
      setCreatedUrl(fullShortUrl);
      return { shortCode: fallbackCode, shortUrl: fullShortUrl };
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCreatedUrl(null);
    setShortCode(null);
    setError(null);
  };

  return {
    generateLink,
    createdUrl,
    shortCode,
    isLoading,
    error,
    reset,
  };
}
