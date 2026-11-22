import { useEffect, useRef } from 'react';
import { shortenerApi } from '../api';

export function useTrackLinkDwellTime(customShortCode?: string) {
  const startTimeRef = useRef<number>(0);
  const hasSentRef = useRef<boolean>(false);

  useEffect(() => {
    // Look for ?via=shortCode in URL or use provided shortCode
    const params = new URLSearchParams(window.location.search);
    const code = customShortCode || params.get('via');
    if (!code) {return;}

    startTimeRef.current = Date.now();
    hasSentRef.current = false;

    const reportDwellTime = () => {
      if (hasSentRef.current) {return;}
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (durationSeconds >= 2) {
        hasSentRef.current = true;
        try {
          const payload = JSON.stringify({ shortCode: code, durationSeconds });
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/services/shorten/analytics/dwell-time', payload);
          } else {
            shortenerApi.recordDwellTime({ shortCode: code, durationSeconds });
          }
        } catch {
          // Silent catch for beacon on page exit
        }
      }
    };

    window.addEventListener('beforeunload', reportDwellTime);
    window.addEventListener('pagehide', reportDwellTime);

    return () => {
      reportDwellTime();
      window.removeEventListener('beforeunload', reportDwellTime);
      window.removeEventListener('pagehide', reportDwellTime);
    };
  }, [customShortCode]);
}
