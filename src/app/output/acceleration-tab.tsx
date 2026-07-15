"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { SimulationResults } from "@/services/api";
import ChartTab, { type DownloadFn } from "./chart-tab";

const chartConfig = {
  accelerationsSi: {
    label: "Acceleration (m/s²)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const EXPORT_COLUMNS: [string, string][] = [
  ["phase", "Phase"],
  ["iteration", "Iteration"],
  ["time", "Time (s)"],
  ["timeTotal", "Total time (s)"],
  ["speeds", "Speed (km/h)"],
  ["speedsSi", "Speed (m/s)"],
  ["accelerations", "Acceleration (km/h/s)"],
  ["accelerationsSi", "Acceleration (m/s²)"],
];

const EXPORT_KEYS = EXPORT_COLUMNS.map(([key]) => key);

const LINES = [
  { dataKey: "accelerationsSi", stroke: "var(--color-accelerationsSi)" },
];

interface AccelerationTabProps {
  results: SimulationResults;
  onDownloadCSV: DownloadFn;
  onDownloadExcel: DownloadFn;
}

export default function AccelerationTab({
  results,
  onDownloadCSV,
  onDownloadExcel,
}: AccelerationTabProps) {
  const isStatic = (results.debugInfo?.simulationType || "dynamic") === "static";

  return (
    <ChartTab
      results={results}
      chartKey="acceleration"
      chartConfig={chartConfig}
      lines={LINES}
      xAxisKey={isStatic ? "speeds" : "timeTotal"}
      xAxisUnit={isStatic ? "km/h" : "s"}
      yAxisUnit="m/s²"
      exportColumns={EXPORT_COLUMNS}
      exportFilename="acceleration_data"
      exportKeys={EXPORT_KEYS}
      onDownloadCSV={onDownloadCSV}
      onDownloadExcel={onDownloadExcel}
    />
  );
}
