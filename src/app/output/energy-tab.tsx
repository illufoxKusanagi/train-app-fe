"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { SimulationResults } from "@/services/api";
import ChartTab, { type DownloadFn } from "./chart-tab";

const chartConfig = {
  energyConsumptions: {
    label: "Energy Consumption (kWh)",
    color: "var(--chart-1)",
  },
  energyPowerings: {
    label: "Energy of Powering (kWh)",
    color: "var(--chart-2)",
  },
  energyAps: {
    label: "Energy APS (kWh)",
    color: "var(--chart-3)",
  },
  energyCatenaries: {
    label: "Energy Catenary (kWh)",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const EXPORT_COLUMNS: [string, string][] = [
  ["phase", "Phase"],
  ["iteration", "Iteration"],
  ["time", "Time (s)"],
  ["timeTotal", "Total time (s)"],
  ["energyConsumptions", "Energy Consumption (kWh)"],
  ["energyPowerings", "Energy of Powering (kWh)"],
  ["energyAps", "Energy APS (kWh)"],
  ["energyCatenaries", "Energy Catenary (kWh)"],
];

const EXPORT_KEYS = EXPORT_COLUMNS.map(([key]) => key);

const LINES = [
  { dataKey: "energyConsumptions", stroke: "var(--color-energyConsumptions)" },
  { dataKey: "energyPowerings", stroke: "var(--color-energyPowerings)", strokeDasharray: "4 2" },
  { dataKey: "energyAps", stroke: "var(--color-energyAps)", strokeWidth: 1.5, strokeDasharray: "6 3" },
  { dataKey: "energyCatenaries", stroke: "var(--color-energyCatenaries)", strokeWidth: 1.5, strokeDasharray: "2 4" },
];

interface EnergyTabProps {
  results: SimulationResults;
  onDownloadCSV: DownloadFn;
  onDownloadExcel: DownloadFn;
}

export default function EnergyTab({
  results,
  onDownloadCSV,
  onDownloadExcel,
}: EnergyTabProps) {
  const simulationType = results.debugInfo?.simulationType || "dynamic";
  const isStatic = simulationType === "static";

  return (
    <ChartTab
      results={results}
      chartKey="energy"
      chartConfig={chartConfig}
      lines={LINES}
      xAxisKey={isStatic ? "speeds" : "timeTotal"}
      xAxisUnit={isStatic ? "km/h" : "s"}
      yAxisUnit="kWh"
      exportColumns={EXPORT_COLUMNS}
      exportFilename="energy_data"
      exportKeys={EXPORT_KEYS}
      onDownloadCSV={onDownloadCSV}
      onDownloadExcel={onDownloadExcel}
    />
  );
}
