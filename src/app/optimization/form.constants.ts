import { InputType } from "@/types/input-types";
import { z } from "zod";

const inputErrorMessage: string = "This Value must be a number";

const membershipField = (max: number) =>
  z.coerce
    .number<number>({ error: inputErrorMessage })
    .min(0, { error: "Value must be non-negative" })
    .max(max, { error: `Value cannot exceed ${max}` });

export const OptimizationFormSchema = z.object({
  // Acceleration search boundaries (m/s²)
  accelMin: membershipField(10),
  accelMax: membershipField(10),
  // Weakening point search boundaries (km/h)
  weakeningMin: membershipField(500),
  weakeningMax: membershipField(500),
  
  // Constraints
  maxTravelTime: z.number().min(0).transform((val) => (val === 0 ? undefined : val)).optional(),
  maxPeakPower: z.number().min(0).transform((val) => (val === 0 ? undefined : val)).optional(),
  maxEnergy: z.number().min(0).transform((val) => (val === 0 ? undefined : val)).optional(),
});

export const accelerationFormDatas: InputType[] = [
  { label: "Minimum", unit: "m/s²", type: "field", name: "accelMin" },
  { label: "Maximum", unit: "m/s²", type: "field", name: "accelMax" },
];

export const weakeningFormDatas: InputType[] = [
  { label: "Minimum", unit: "km/h", type: "field", name: "weakeningMin" },
  { label: "Maximum", unit: "km/h", type: "field", name: "weakeningMax" },
];

export const constraintFormDatas: InputType[] = [
  { label: "Max Travel Time", unit: "s", type: "field", name: "maxTravelTime" },
  { label: "Max Peak Power", unit: "kW", type: "field", name: "maxPeakPower" },
  { label: "Max Energy", unit: "kWh", type: "field", name: "maxEnergy" },
];
