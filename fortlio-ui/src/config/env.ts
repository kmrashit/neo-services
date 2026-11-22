export const BACKEND_TARGETS = {
  local: {
    name: 'Local Backend',
    httpUrl: 'http://localhost:4020',
    wsUrl: 'ws://localhost:4021',
  },
  prod: {
    name: 'Production (DuckDNS)',
    httpUrl: 'https://fortlio-be.duckdns.org',
    wsUrl: 'wss://fortlio-be.duckdns.org',
  },
} as const;

export type BackendMode = keyof typeof BACKEND_TARGETS;

const STORAGE_KEY = 'FORTLIO_BACKEND_MODE';

export function getBackendMode(): BackendMode {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem(STORAGE_KEY) as BackendMode | null;
    if (override && (override === 'local' || override === 'prod')) {
      return override;
    }
  }

  const envMode = import.meta.env.VITE_ENV_MODE;
  if (envMode === 'production' || import.meta.env.MODE === 'production') {
    return 'prod';
  }

  return 'local';
}

export function getBackendBaseUrl(): string {
  const mode = getBackendMode();
  const target = BACKEND_TARGETS[mode];

  // If environment explicitly has custom URL defined and no local override set
  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl) {return envUrl;}
  }

  return target.httpUrl;
}

export function getWebSocketUrl(): string {
  const mode = getBackendMode();
  const target = BACKEND_TARGETS[mode];

  if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
    const envWs = import.meta.env.VITE_WS_URL;
    if (envWs) {return envWs;}
  }

  return target.wsUrl;
}

export function setBackendMode(mode: BackendMode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent('fortlio:backend-mode-change', { detail: { mode } }));
  }
}

export function resetBackendMode(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('fortlio:backend-mode-change', { detail: { mode: getBackendMode() } }));
  }
}
