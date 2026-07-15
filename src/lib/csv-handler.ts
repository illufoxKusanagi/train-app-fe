/**
 * csv-handler.ts
 *
 * Centralised CSV utilities for the Train Simulation App.
 *
 * ─── Functions ───────────────────────────────────────────────────────────────
 *
 *  csvUploadHandler      – Parse a multi-column data CSV (slope, radius, v_limit,
 *                          station distances, dwell time, torque-speed curves, …).
 *                          Row 0 is treated as a header and is SKIPPED.
 *                          Returns `number[][]` (rows × columns).
 *
 *  csvPresetHandler      – Parse a key-value preset CSV used by parameter forms
 *                          (e.g. "track-parameters.csv").
 *                          Row 0 is treated as a header and is SKIPPED.
 *                          Returns `Record<string, number>`.
 *
 *  csvExportPresetHandler – Export a key-value config object as a preset CSV
 *                           (header row + one "key,value" row per field).
 *                           Replaces the old `exportConfigToCsv` helper.
 *
 *  csvOutputHandler      – Export a table of simulation results as a CSV
 *                          (header row + one data row per point).
 *                          Replaces the old `exportTableToCsv` helper.
 *
 * ─── CSV format conventions ──────────────────────────────────────────────────
 *
 *  Data CSVs (csvUploadHandler)
 *    Row 0  →  header  (e.g. "Start,End,Value")      ← SKIPPED
 *    Row 1+ →  numeric data
 *
 *    Single-column  : value
 *    Two-column     : start, end          (or any pair)
 *    Three-column   : start, end, value   (segment range + value)
 *
 *  Preset CSVs (csvPresetHandler / csvExportPresetHandler)
 *    Row 0  →  "key,value"  (header label)            ← SKIPPED
 *    Row 1+ →  "field_name,number"
 */

import { isQtWebChannelReady, saveFileWithDialog } from './qt-webchannel';
import { toast } from 'sonner';

// ─── Internal helpers ─────────────────────────────────────────────────────────

function escapeCsvValue(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  const escaped = s.replace(/"/g, '""');
  return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
}

export async function saveCsvString(
  csvContent: string,
  filename: string,
  successMessage = 'CSV saved successfully!'
): Promise<void> {
  if (isQtWebChannelReady()) {
    try {
      const result = await saveFileWithDialog(
        csvContent,
        filename,
        'CSV Files (*.csv);;All Files (*)'
      );
      if (result.success) {
        toast.success(successMessage);
      } else if (
        result.error &&
        result.error !== 'User cancelled file dialog'
      ) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to save CSV file'
      );
    }
    return;
  }

  // Browser fallback
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(successMessage);
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : 'Failed to export CSV file'
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Parse a data CSV file (e.g. slope profile, radius profile, torque-speed curve).
 *
 * - Row 0 is the **header** and is always skipped.
 * - Remaining rows are parsed as `number[][]`.
 * - Non-numeric values are coerced to `0`.
 *
 * @param csvText     Raw text content of the CSV file.
 * @param requiredColumns  Minimum number of columns required per row (0 = no minimum).
 * @returns           Parsed numeric rows (header excluded).
 * @throws            Error if a row has fewer columns than `requiredColumns`.
 */
export function csvUploadHandler(
  csvText: string,
  requiredColumns = 0
): number[][] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    throw new Error('CSV is empty.');
  }

  // Check if first row is a header
  let isHeader = false;
  const firstCol = lines[0].split(',')[0].trim();
  if (isNaN(parseFloat(firstCol))) {
    isHeader = true;
  }

  const dataLines = isHeader ? lines.slice(1) : lines;

  if (dataLines.length === 0) {
    throw new Error('CSV contains no data rows.');
  }

  return dataLines.map((line, idx) => {
    const values = line.split(',').map((v) => v.trim());

    if (requiredColumns > 0 && values.length < requiredColumns) {
      throw new Error(
        `Row ${idx + 2} has only ${values.length} column(s) — need at least ${requiredColumns}.`
      );
    }

    // TODO
    // Avoid silent coercion of invalid numeric cells to 0.
    // Invalid cells currently become 0, which can silently corrupt uploaded profiles. Fail fast with row/column context instead.

    return values.map((v) => {
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    });
  });
}

/**
 * Parse a key-value **preset** CSV (parameter form config files).
 *
 * Expected format:
 * ```
 * key,value          ← Row 0: header — SKIPPED
 * n_station,3
 * x_station,2000
 * …
 * ```
 *
 * @param csvText  Raw text content of the CSV file.
 * @returns        Map of field name → numeric value (invalid rows are skipped).
 */
export function csvPresetHandler(csvText: string): Record<string, number> {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return {};

  // Check if first row is a header (e.g., "key,value" or non-numeric value)
  let isHeader = false;
  const firstCommaIdx = lines[0].indexOf(',');
  if (firstCommaIdx !== -1) {
    const rightSide = lines[0].slice(firstCommaIdx + 1).trim();
    if (isNaN(parseFloat(rightSide))) {
      isHeader = true;
    }
  } else {
    isHeader = true; // No comma, likely a header or invalid row
  }

  const dataLines = isHeader ? lines.slice(1) : lines;

  const result: Record<string, number> = {};
  for (const line of dataLines) {
    const commaIdx = line.indexOf(',');
    if (commaIdx === -1) continue;

    const key = line.slice(0, commaIdx).trim();
    const rawValue = line.slice(commaIdx + 1).trim();
    const value = Number(rawValue);

    if (key && Number.isFinite(value)) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Export a parameter form config object as a preset CSV.
 *
 * Output format:
 * ```
 * key,value
 * n_station,3
 * x_station,2000
 * …
 * ```
 *
 * `_file` fields (used internally by upload widgets) are automatically excluded.
 *
 * @param data             Form values object.
 * @param filename         Default filename for the save dialog (e.g. "track-parameters.csv").
 * @param successMessage   Toast message shown on success.
 */
export async function csvExportPresetHandler(
  data: Record<string, unknown>,
  filename: string,
  successMessage = 'CSV exported successfully!'
): Promise<void> {
  const rows = Object.entries(data).filter(
    ([key, value]) =>
      !key.endsWith('_file') &&
      value !== undefined &&
      value !== null &&
      value !== ''
  );

  if (rows.length === 0) {
    toast.warning('No data to export.');
    return;
  }

  const header = 'key,value';
  const dataLines = rows.map(
    ([k, v]) => `${escapeCsvValue(k)},${escapeCsvValue(v)}`
  );
  const csvContent = [header, ...dataLines].join('\n') + '\n';

  await saveCsvString(csvContent, filename, successMessage);
}

/**
 * Export simulation result rows as a CSV (e.g. the Output page download).
 *
 * Output format:
 * ```
 * Speed (km/h),Time (s),…
 * 60,0.1,…
 * …
 * ```
 *
 * @param rows      Array of result objects.
 * @param columns   Column definitions: `{ key: keyof T, header: string }[]`.
 * @param filename  Default filename for the save dialog.
 * @param successMessage  Toast message shown on success.
 */
export async function csvOutputHandler<T extends object>(
  rows: T[],
  columns: { key: keyof T & string; header: string }[],
  filename: string,
  successMessage = 'CSV exported successfully!'
): Promise<void> {
  if (rows.length === 0) {
    toast.warning('No data to export.');
    return;
  }

  const header = columns.map((c) => escapeCsvValue(c.header)).join(',');
  const dataLines = rows.map((row) =>
    columns.map((c) => escapeCsvValue(row[c.key] ?? '')).join(',')
  );
  const csvContent = [header, ...dataLines].join('\n') + '\n';

  await saveCsvString(csvContent, filename, successMessage);
}
