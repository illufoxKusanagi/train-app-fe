"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { api, ApiError } from "@/services/api";
import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSystemStatus } from "@/contexts/SystemStatusContext";

/**
 * Translate a backend warning/error key like "WARN_CSV_EMPTY:Motor efficiency"
 * into the user's locale.  Keys may contain a `:` separator whose RHS is a
 * dynamic parameter (dataName).
 */
function translateWarning(
  key: string,
  tw: (k: string, params?: Record<string, string>) => string,
): string {
  const [base, param] = key.split(":");
  try {
    if (param) {
      return tw(base, { dataName: param });
    }
    return tw(base);
  } catch {
    // Fallback: return raw key if translation is missing
    return key;
  }
}

export function SimulationButtons() {
  const [isRunningStatic, setIsRunningStatic] = useState(false);
  const [isRunningDynamic, setIsRunningDynamic] = useState(false);
  const router = useRouter();
  const t = useTranslations("Simulation");
  const tw = useTranslations("warnings");
  const te = useTranslations("errors");
  const { isSystemBusy, isOptimizationRunning, refreshStatus, triggerCooldown } =
    useSystemStatus();

  // Ref always holds the latest value — avoids stale closure in async polling
  const optRunningRef = useRef(isOptimizationRunning);
  useEffect(() => {
    optRunningRef.current = isOptimizationRunning;
  }, [isOptimizationRunning]);

  const isLocalBusy = isRunningStatic || isRunningDynamic;

  const runSimulation = async (type: "static" | "dynamic") => {
    const setLoading =
      type === "static" ? setIsRunningStatic : setIsRunningDynamic;

    setLoading(true);
    triggerCooldown();
    try {
      await api.startSimulation({ type });

      let statusResult = await api.getSimulationStatus();
      while (statusResult.isRunning) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        statusResult = await api.getSimulationStatus();
      }

      // If the backend returned the optimization guard stub instead of real
      // completion data, don't show the "completed" toast or redirect.
      if (statusResult.simulationStatus === "optimization_running") {
        return;
      }

      window.dispatchEvent(new Event("simulationUpdated"));

      const maxSpeed = statusResult.summary?.maxSpeed ?? 0;

      toast.success(
        t("completed", {
          type: type === "static" ? t("static") : t("dynamic"),
        }),
        { description: t("maxSpeed", { speed: maxSpeed.toFixed(2) }) },
      );

      // Display warnings — translate the backend keys
      if (statusResult.warnings && statusResult.warnings.length > 0) {
        statusResult.warnings.forEach((warning) => {
          toast.warning(t("warning"), {
            description: translateWarning(warning, tw),
            duration: 5000,
          });
        });
      }

      // Display errors — translate the backend keys
      if (statusResult.errors && statusResult.errors.length > 0) {
        statusResult.errors.forEach((error) => {
          toast.error(t("error"), {
            description: translateWarning(error, te),
            duration: 8000,
          });
        });
      }

      // Skip redirect if optimization started while we were polling.
      // Two-step guard: fast ref check, then a fresh API call to close any
      // race window between polling intervals.
      if (!optRunningRef.current) {
        const freshStatus = await api.getOptimizationStatus();
        if (!freshStatus.isRunning) {
          router.push("/output");
        }
      }
    } catch (error) {
      console.error("Simulation failed:", error);
      if (error instanceof ApiError && error.busy) {
        toast.error(t("busyTitle"), { description: t("busyDescription") });
      } else {
        toast.error(t("failed"), { description: t("failedDescription") });
      }
    } finally {
      setLoading(false);
      refreshStatus();
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        id="sim-static-btn"
        onClick={() => runSimulation("static")}
        disabled={isLocalBusy || isSystemBusy}
        variant="default"
        size="default"
      >
        {isRunningStatic ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {t("running")}
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            {t("static")}
          </>
        )}
      </Button>
      <Button
        id="sim-dynamic-btn"
        onClick={() => runSimulation("dynamic")}
        disabled={isLocalBusy || isSystemBusy}
        variant="default"
        size="default"
      >
        {isRunningDynamic ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {t("running")}
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            {t("dynamic")}
          </>
        )}
      </Button>
    </div>
  );
}
