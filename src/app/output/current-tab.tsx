"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { SimulationResults } from "@/services/api";
import ChartTab, { type DownloadFn } from "./chart-tab";

const chartConfig = {
  vvvfCurrents: {
    label: "VVVF Current (A)",
    color: "var(--chart-1)",
  },
  catenaryCurrents: {
    label: "Catenary Current (A)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const EXPORT_COLUMNS: [string, string][] = [
  ["phase", "Phase"],
  ["iteration", "Iteration"],
  ["time", "Time (s)"],
  ["timeTotal", "Total time (s)"],
  ["speeds", "Speed (km/h)"],
  ["catenaryCurrents", "Catenary current"],
  ["vvvfCurrents", "VVVF current"],
];

const EXPORT_KEYS = EXPORT_COLUMNS.map(([key]) => key);

interface CurrentTabProps {
  results: SimulationResults;
  onDownloadCSV: DownloadFn;
  onDownloadExcel: DownloadFn;
}

export default function CurrentTab({
  results,
  onDownloadCSV,
  onDownloadExcel,
}: CurrentTabProps) {
  const simulationType = results.debugInfo?.simulationType || "dynamic";
  const isStatic = simulationType === "static";

  return (
    <ChartTab
      results={results}
      chartKey="current"
      chartConfig={chartConfig}
      lines={[
        { dataKey: "vvvfCurrents", stroke: "var(--color-vvvfCurrents)" },
        {
          dataKey: "catenaryCurrents",
          stroke: "var(--color-catenaryCurrents)",
        },
      ]}
      xAxisKey={isStatic ? "speeds" : "timeTotal"}
      xAxisUnit={isStatic ? "km/h" : "s"}
      yAxisUnit="A"
      exportColumns={EXPORT_COLUMNS}
      exportFilename="current_data"
      exportKeys={EXPORT_KEYS}
      onDownloadCSV={onDownloadCSV}
      onDownloadExcel={onDownloadExcel}
    />
  );
}
