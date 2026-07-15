'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { api } from '@/services/api';

interface SystemStatus {
  isSimulationRunning: boolean;
  isOptimizationRunning: boolean;
  /** True when any backend process is active OR the cooldown is active. */
  isSystemBusy: boolean;
  /** Force an immediate status refresh from the backend. */
  refreshStatus: () => Promise<void>;
  /** Start a 1-second cooldown that blocks further actions (rate-limit). */
  triggerCooldown: () => void;
}

const SystemStatusContext = createContext<SystemStatus>({
  isSimulationRunning: false,
  isOptimizationRunning: false,
  isSystemBusy: false,
  refreshStatus: async () => {},
  triggerCooldown: () => {},
});

export function useSystemStatus() {
  return useContext(SystemStatusContext);
}

const POLL_IDLE_MS = 5000;
const POLL_BUSY_MS = 1500;
const COOLDOWN_MS = 1000;

export function SystemStatusProvider({ children }: { children: ReactNode }) {
  const [simRunning, setSimRunning] = useState(false);
  const [optRunning, setOptRunning] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const [simStatus, optStatus] = await Promise.all([
        api.getSimulationStatus(),
        api.getOptimizationStatus(),
      ]);
      setSimRunning(simStatus.isRunning);
      setOptRunning(optStatus.isRunning);
    } catch {
      // Backend not ready — leave state unchanged
    }
  }, []);

  const triggerCooldown = useCallback(() => {
    setCooldown(true);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
    cooldownRef.current = setTimeout(() => setCooldown(false), COOLDOWN_MS);
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const processRunning = simRunning || optRunning;

  // Adaptive polling: faster when busy, slower when idle
  const pollingRef = useRef(false);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      async () => {
        if (pollingRef.current) return;
        pollingRef.current = true;
        try {
          await fetchStatus();
        } finally {
          pollingRef.current = false;
        }
      },
      processRunning ? POLL_BUSY_MS : POLL_IDLE_MS
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [processRunning, fetchStatus]);

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

  return (
    <SystemStatusContext.Provider
      value={{
        isSimulationRunning: simRunning,
        isOptimizationRunning: optRunning,
        isSystemBusy: processRunning || cooldown,
        refreshStatus: fetchStatus,
        triggerCooldown,
      }}
    >
      {children}
    </SystemStatusContext.Provider>
  );
}
