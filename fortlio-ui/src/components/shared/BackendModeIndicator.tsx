import React, { useState, useEffect } from 'react';
import { Server, RefreshCw } from 'lucide-react';
import { getBackendMode, setBackendMode, BACKEND_TARGETS, type BackendMode } from '@/config/env';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const BackendModeIndicator: React.FC = () => {
  const isDev = Boolean(import.meta.env.DEV);
  const [mode, setMode] = useState<BackendMode>(getBackendMode());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isDev) {
      return;
    }
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: BackendMode }>;
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode);
      }
    };

    window.addEventListener('fortlio:backend-mode-change', handleModeChange);
    return () => {
      window.removeEventListener('fortlio:backend-mode-change', handleModeChange);
    };
  }, [isDev]);

  if (!isDev) {
    return null;
  }

  const handleToggle = () => {
    const nextMode: BackendMode = mode === 'local' ? 'prod' : 'local';
    setBackendMode(nextMode);
    setMode(nextMode);
  };

  const currentTarget = BACKEND_TARGETS[mode];

  return (
    <aside
      aria-label="Backend environment switcher"
      className="fixed bottom-3 right-3 z-50 flex flex-col items-end gap-1.5 font-sans"
    >
      {expanded && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/95 p-3 text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
            <span className="font-semibold text-foreground">Backend Target</span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Dev Tool</span>
          </div>

          <div className="space-y-1 text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">API:</span>
              <span className="font-mono text-[11px] text-foreground/80 truncate max-w-[200px]">
                {currentTarget.httpUrl}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">WebSocket:</span>
              <span className="font-mono text-[11px] text-foreground/80 truncate max-w-[200px]">
                {currentTarget.wsUrl}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              variant={mode === 'local' ? 'default' : 'outline'}
              className="h-7 text-xs flex-1"
              onClick={() => {
                setBackendMode('local');
                setMode('local');
              }}
            >
              Local (4020)
            </Button>
            <Button
              size="sm"
              variant={mode === 'prod' ? 'default' : 'outline'}
              className="h-7 text-xs flex-1"
              onClick={() => {
                setBackendMode('prod');
                setMode('prod');
              }}
            >
              Prod (DuckDNS)
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="group flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-accent cursor-pointer"
          title="Click to expand backend switcher options"
        >
          <Server className="size-3.5 text-muted-foreground group-hover:text-foreground" />
          <span>Mode:</span>
          <Badge
            variant={mode === 'local' ? 'secondary' : 'default'}
            className="text-[10px] font-mono px-1.5 py-0"
          >
            {mode === 'local' ? '🟢 Local: 4020' : '🟣 Prod: DuckDNS'}
          </Badge>
        </button>

        <Button
          size="icon"
          variant="outline"
          className="size-7 rounded-full shadow-md bg-card/90 cursor-pointer"
          title={`Switch to ${mode === 'local' ? 'Production (DuckDNS)' : 'Local (4020)'}`}
          onClick={handleToggle}
        >
          <RefreshCw className="size-3" />
        </Button>
      </div>
    </aside>
  );
};
