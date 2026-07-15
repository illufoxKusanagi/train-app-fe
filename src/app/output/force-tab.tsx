import { useMemo, useState, useEffect } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import type { SimulationResults } from "@/services/api";
import ChartTab, { type DownloadFn } from "./chart-tab";

const BASE_EXPORT_COLUMNS: [string, string][] = [
  ["phase", "Phase"],
  ["iteration", "Iteration"],
  ["time", "Time (s)"],
  ["timeTotal", "Total time (s)"],
  ["speeds", "Speed (km/h)"],
  ["motorForce", "F Motor"],
  ["tractionForcePerMotor", "F Motor /TM"],
];

const BASE_LINES = [
  { dataKey: "motorForce", stroke: "var(--color-motorForce)" },
];

const STATIC_EXTRA_LINES = [
  {
    dataKey: "motorResistancesOption1",
    stroke: "var(--color-motorResistancesOption1)",
    strokeWidth: 1.5,
    strokeDasharray: "4 2",
  },
  {
    dataKey: "motorResistancesOption2",
    stroke: "var(--color-motorResistancesOption2)",
    strokeWidth: 1.5,
    strokeDasharray: "4 2",
  },
  {
    dataKey: "motorResistancesOption3",
    stroke: "var(--color-motorResistancesOption3)",
    strokeWidth: 1.5,
    strokeDasharray: "4 2",
  },
  {
    dataKey: "motorResistancesOption4",
    stroke: "var(--color-motorResistancesOption4)",
    strokeWidth: 1.5,
    strokeDasharray: "4 2",
  },
];

interface ForceTabProps {
  results: SimulationResults;
  onDownloadCSV: DownloadFn;
  onDownloadExcel: DownloadFn;
}

export default function ForceTab({
  results,
  onDownloadCSV,
  onDownloadExcel,
}: ForceTabProps) {
  const simulationType = results.debugInfo?.simulationType || "dynamic";
  const isStatic = simulationType === "static";

  const [slopes, setSlopes] = useState<number[]>([0, 5, 10, 25]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("form_track-params");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSlopes([
          parsed.slope_option1 ?? 0,
          parsed.slope_option2 ?? 5,
          parsed.slope_option3 ?? 10,
          parsed.slope_option4 ?? 25,
        ]);
      }
    } catch (e) {
      console.error("Failed to load slopes for force tab:", e);
    }
  }, []);

  const chartConfig = useMemo(() => ({
    motorForce: {
      label: "Motor Force (N)",
      color: "var(--chart-1)",
    },
    motorResistancesOption1: {
      label: `Run Res at ${slopes[0]}‰ (N)`,
      color: "var(--chart-4)",
    },
    motorResistancesOption2: {
      label: `Run Res at ${slopes[1]}‰ (N)`,
      color: "var(--chart-5)",
    },
    motorResistancesOption3: {
      label: `Run Res at ${slopes[2]}‰ (N)`,
      color: "#10b981",
    },
    motorResistancesOption4: {
      label: `Run Res at ${slopes[3]}‰ (N)`,
      color: "#f43f5e",
    },
  }) satisfies ChartConfig, [slopes]);

  const exportColumns = useMemo<[string, string][]>(
    () =>
      isStatic
        ? [
            ...BASE_EXPORT_COLUMNS,
            ["motorResistancesOption1", `Run res at ${slopes[0]}`],
            ["motorResistancesOption2", `Run res at ${slopes[1]}`],
            ["motorResistancesOption3", `Run res at ${slopes[2]}`],
            ["motorResistancesOption4", `Run res at ${slopes[3]}`],
          ]
        : BASE_EXPORT_COLUMNS,
    [isStatic, slopes],
  );

  const lines = useMemo(
    () => (isStatic ? [...BASE_LINES, ...STATIC_EXTRA_LINES] : BASE_LINES),
    [isStatic],
  );

  const exportKeys = useMemo(
    () => exportColumns.map(([key]) => key),
    [exportColumns],
  );

  return (
    <ChartTab
      results={results}
      chartKey="force"
      chartConfig={chartConfig}
      lines={lines}
      xAxisKey={isStatic ? "speeds" : "timeTotal"}
      xAxisUnit={isStatic ? "km/h" : "s"}
      yAxisUnit="N"
      exportColumns={exportColumns}
      exportFilename="force_data"
      exportKeys={exportKeys}
      onDownloadCSV={onDownloadCSV}
      onDownloadExcel={onDownloadExcel}
    />
  );
}
