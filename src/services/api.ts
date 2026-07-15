// ============================================================
// Train Simulation API Client
// ============================================================
// Maps frontend TypeScript types to backend C++ structs
// All parameters stored in AppContext before simulation runs

// ============================================================
// Train Simulation API Client
// Uses ONLY the types declared in input-params.ts
// ============================================================

import {
  TrainConstantParams,
  TrainMassParams,
  TrainPassangerParams,
  TrainNumberParams,
  TrackParams,
  RunningParams,
  ElectricalParams,
} from '@/types/input-params';
import {
  SimulationConfig,
  SimulationResults,
  SimulationSummary,
} from '@/types/simulation-params';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** Thrown when the backend rejects a request because a process is already running. */
export class ApiError extends Error {
  readonly busy: boolean;
  constructor(message: string, busy = false) {
    super(message);
    this.busy = busy;
  }
}

/**
 * Shared error handler for non-OK responses. Parses the JSON body once
 * and throws an ApiError so every consumer sees a consistent error type
 * (including the `busy` flag from 409 Conflict responses).
 */
async function throwIfError(res: Response, fallback: string): Promise<void> {
  if (res.ok) return;
  const body = await res.json().catch(() => ({}));
  throw new ApiError(
    body?.message ?? `${fallback}: ${res.status}`,
    !!body?.busy
  );
}

// ============================================================
// API Client
// ============================================================

export const api = {
  // ==================== Health Check ====================
  checkHealth: async (): Promise<{ status: string; dataStatus: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return res.json();
  },

  // ==================== Quick Initialization ====================
  quickInit: async (): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/init/quick`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Quick init failed: ${res.status}`);
    return res.json();
  },

  // ==================== Authentication ====================
  login: async (
    username: string,
    password: string
  ): Promise<{ status: string; message: string; token?: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid credentials');
    }
    return res.json();
  },

  getAuthStatus: async (): Promise<{ isAuthenticated: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/status`);
    if (!res.ok) throw new Error(`Auth status check failed: ${res.status}`);
    return res.json();
  },

  // ==================== Debug Context ====================
  debugContext: async (): Promise<Record<string, unknown>> => {
    const res = await fetch(`${API_BASE_URL}/api/debug/context`);
    if (!res.ok) throw new Error(`Debug context failed: ${res.status}`);
    return res.json();
  },

  // ==================== Train Parameters ====================
  getTrainParameters: async (): Promise<{
    trainParameters: TrainConstantParams & TrainNumberParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/train`);
    if (!res.ok)
      throw new Error(`Failed to get train parameters: ${res.status}`);
    return res.json();
  },

  updateTrainParameters: async (
    params: Record<string, number>
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainParameters: params }),
    });
    await throwIfError(res, 'Failed to update train parameters');
    return res.json();
  },

  // ==================== Electrical Parameters ====================
  getElectricalParameters: async (): Promise<{
    electricalParameters: ElectricalParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/electrical`);
    if (!res.ok)
      throw new Error(`Failed to get electrical parameters: ${res.status}`);
    return res.json();
  },

  updateElectricalParameters: async (
    params: ElectricalParams
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/electrical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ electricalParameters: params }),
    });
    await throwIfError(res, 'Failed to update electrical parameters');
    return res.json();
  },

  // ==================== Running Parameters ====================
  getRunningParameters: async (): Promise<{
    runningParameters: RunningParams & TrainPassangerParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/running`);
    if (!res.ok)
      throw new Error(`Failed to get running parameters: ${res.status}`);
    return res.json();
  },

  updateRunningParameters: async (
    params: Record<string, number | string>
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/running`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runningParameters: params }),
    });
    await throwIfError(res, 'Failed to update running parameters');
    return res.json();
  },

  // ==================== Track Parameters ====================
  getTrackParameters: async (): Promise<{
    trackParameters: TrackParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/track`);
    if (!res.ok)
      throw new Error(`Failed to get track parameters: ${res.status}`);
    return res.json();
  },

  updateTrackParameters: async (
    params: TrackParams | Record<string, number | number[]>
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackParameters: params }),
    });
    await throwIfError(res, 'Failed to update track parameters');
    return res.json();
  },

  // ==================== Mass Parameters ====================
  getMassParameters: async (): Promise<{
    massParameters: TrainMassParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/mass`);
    if (!res.ok)
      throw new Error(`Failed to get mass parameters: ${res.status}`);
    return res.json();
  },

  updateMassParameters: async (
    params: Record<string, number>
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/mass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ massParameters: params }),
    });
    await throwIfError(res, 'Failed to update mass parameters');
    return res.json();
  },

  calculateMass: async (
    trainset: Record<string, unknown>,
    constant: Record<string, unknown>
  ): Promise<{
    massParameters: TrainMassParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/calculate/mass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trainset, constant }),
    });
    if (!res.ok) throw new Error(`Failed to calculate mass: ${res.status}`);
    return res.json();
  },

  // ==================== Car Number Parameters ====================
  getCarNumberParameters: async (): Promise<{
    carNumberParameters: TrainNumberParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/carnumber`);
    if (!res.ok)
      throw new Error(`Failed to get car number parameters: ${res.status}`);
    return res.json();
  },

  updateCarNumberParameters: async (
    params: TrainNumberParams
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/carnumber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    await throwIfError(res, 'Failed to update car number parameters');
    return res.json();
  },

  // ==================== Passenger Parameters ====================
  getPassengerParameters: async (): Promise<{
    passengerParameters: TrainPassangerParams;
    status: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/passenger`);
    if (!res.ok)
      throw new Error(`Failed to get passenger parameters: ${res.status}`);
    return res.json();
  },

  updatePassengerParameters: async (
    params: TrainPassangerParams
  ): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/parameters/passenger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    await throwIfError(res, 'Failed to update passenger parameters');
    return res.json();
  },

  // ==================== Simulation Control ====================
  startSimulation: async (
    config: SimulationConfig
  ): Promise<{
    status: string;
    message: string;
    summary: SimulationSummary;
    simulationType: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/simulation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    await throwIfError(res, 'Failed to start simulation');
    return res.json();
  },

  getSimulationStatus: async (): Promise<{
    status: string;
    isRunning: boolean;
    simulationStatus?: string;
    summary?: SimulationSummary;
    warnings?: string[];
    errors?: string[];
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/simulation/status`);
    if (!res.ok)
      throw new Error(`Failed to get simulation status: ${res.status}`);
    return res.json();
  },

  getSimulationResults: async (): Promise<SimulationResults> => {
    const res = await fetch(`${API_BASE_URL}/api/simulation/results`);
    if (!res.ok)
      throw new Error(`Failed to get simulation results: ${res.status}`);
    return res.json();
  },

  // ==================== Fuzzy Optimization ====================
  startOptimization: async (params: {
    accelMin: number;
    accelMax: number;
    weakeningMin: number;
    weakeningMax: number;
    maxTravelTime?: number;
    maxPeakPower?: number;
    maxEnergy?: number;
  }): Promise<{ status: string; message: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/optimization/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    await throwIfError(res, 'Failed to start optimization');
    return res.json();
  },

  getOptimizationStatus: async (): Promise<{
    isRunning: boolean;
    results: Array<{
      acc_start_si: number; // m/s²
      v_p1: number; // km/h
      peakMotorPower: number; // kW/motor
      travelTime: number; // seconds
      energyConsumption: number; // kWh
      fuzzyScore: number; // 0–100
      isPassed: boolean;
    }>;
    best: {
      acc_start_si: number;
      v_p1: number;
      peakMotorPower: number;
      travelTime: number;
      energyConsumption: number;
      fuzzyScore: number;
      isPassed: boolean;
    };

    totalCombinations: number;
    completedCombinations: number;
  }> => {
    const res = await fetch(`${API_BASE_URL}/api/optimization/status`);
    if (!res.ok)
      throw new Error(`Failed to get optimization status: ${res.status}`);
    return res.json();
  },
};

// Re-export types for convenience
export type {
  TrainConstantParams,
  TrainMassParams,
  TrainPassangerParams,
  TrainNumberParams,
  TrackParams,
  RunningParams,
  ElectricalParams,
};

export type {
  SimulationConfig,
  SimulationResults,
} from '@/types/simulation-params';
