import type { LabDataPoint, LabImportSource, LabMetricKey } from "@/lib/store";

const METRIC_ALIASES: Record<LabMetricKey, string[]> = {
  creatinine: ["kreatinin", "creatinine", "serum kreatinin", "krea", "serum kr.", "s.kreatinin"],
  urea: ["üre", "ure", "urea", "blood urea", "bun", "kan üre", "serum üre", "kan üre azotu"],
  uricAcid: ["ürik asit", "urik asit", "uric acid"],
  gfr: ["gfr", "egfr", "e-gfr", "glomeruler filtrasyon", "glomerüler filtrasyon", "ckd-epi gfr", "mdrd gfr", "tahmini gfr"],
  urineProtein: ["idrarda protein", "proteinuri", "proteinüri", "urine protein", "idrar protein"],
  urineCreatinine: ["idrarda kreatinin", "urine creatinine", "idrar kreatinin"],
  spotUrine: ["spot idrar", "protein/kreatinin", "protein kreatinin", "spot urine"],
  tacrolimus: ["tacrolimus", "takrolimus", "fk506"],
  hemoglobin: ["hemoglobin", "hgb", "hb"],
  potassium: ["potasyum", "potassium", "k+", "serum potasyum"],
  sodium: ["sodyum", "sodium", "na+", "serum sodyum"],
  phosphorus: ["fosfor", "phosphorus", "phosphate", "serum fosfor", "fosfat"],
  albumin: ["albumin", "albümin", "serum albümin"],
  crp: ["crp", "c-reaktif protein", "c reaktif protein", "c-reactive protein", "hs-crp"],
};

const DATE_PATTERNS = [
  /(\d{4})[-/.](\d{2})[-/.](\d{2})/,
  /(\d{2})[-/.](\d{2})[-/.](\d{4})/,
];

function parseNumber(raw: string): number | undefined {
  // Replace ALL commas with dots to handle Turkish decimal format (1,20 → 1.20)
  const match = raw.replace(/,/g, ".").match(/-?\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : undefined;
}

export function normalizeDateInput(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;

  const iso = text.match(DATE_PATTERNS[0]);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const local = text.match(DATE_PATTERNS[1]);
  if (local) return `${local[3]}-${local[2]}-${local[1]}`;

  if (/^\d{4}-\d{2}$/.test(text)) return text;

  return null;
}

export function extractFirstDate(text: string): string | null {
  for (const line of text.split(/\r?\n/)) {
    const normalized = normalizeDateInput(line);
    if (normalized) return normalized;
  }
  return null;
}

export function extractLabValuesFromText(text: string): Partial<LabDataPoint> {
  const lower = text.toLocaleLowerCase("tr-TR");
  const values: Partial<LabDataPoint> = {};

  (Object.keys(METRIC_ALIASES) as LabMetricKey[]).forEach((metricKey) => {
    const aliases = METRIC_ALIASES[metricKey];

    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Allow up to 30 non-digit/non-hyphen chars between alias and value
      // to handle wide column-aligned e-Nabız output (tabs, multiple spaces)
      const lineRegex = new RegExp(`${escaped}[^\\d-]{0,30}(-?\\d+[,.]?\\d*)`, "i");
      const lineMatch = lower.match(lineRegex);
      if (lineMatch?.[1]) {
        const value = parseNumber(lineMatch[1]);
        if (value !== undefined) {
          values[metricKey] = value;
          return;
        }
      }
    }

    for (const line of lower.split(/\r?\n/)) {
      if (!aliases.some((alias) => line.includes(alias))) continue;
      const value = parseNumber(line);
      if (value !== undefined) {
        values[metricKey] = value;
        break;
      }
    }
  });

  return values;
}

function normalizeHeader(header: string): string {
  return header
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();
}

function mapHeaderToMetric(header: string): LabMetricKey | null {
  const normalized = normalizeHeader(header);
  const direct = (Object.keys(METRIC_ALIASES) as LabMetricKey[]).find((metricKey) =>
    METRIC_ALIASES[metricKey].some((alias) => normalized.includes(alias))
  );
  return direct ?? null;
}

function getRowDate(row: Record<string, unknown>): string | null {
  const candidate = Object.entries(row).find(([key]) =>
    ["date", "tarih", "report date", "lab date"].includes(normalizeHeader(key))
  );
  if (!candidate) return null;
  return normalizeDateInput(String(candidate[1] ?? ""));
}

export function parseRowsIntoLabData(
  rows: Record<string, unknown>[],
  fallbackDate: string,
  sourceType: LabImportSource
): LabDataPoint[] {
  const parsedRows = rows
    .map((row, index) => {
      const point: LabDataPoint = {
        date: getRowDate(row) ?? fallbackDate,
        sourceType,
      };

      Object.entries(row).forEach(([key, rawValue]) => {
        const metricKey = mapHeaderToMetric(key);
        if (!metricKey) return;
        const value = parseNumber(String(rawValue ?? ""));
        if (value !== undefined) point[metricKey] = value;
      });

      const hasMetric = Object.keys(point).some((key) => key !== "date" && key !== "sourceType");
      return hasMetric ? { ...point, sourceLabel: `Satir ${index + 1}` } : null;
    })
    .filter((point) => point !== null);

  return parsedRows;
}

export function parseDelimitedLabText(
  rawText: string,
  fallbackDate: string,
  sourceType: LabImportSource
): LabDataPoint[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const delimiter = lines[0].includes("\t") ? "\t" : lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(delimiter);
    return headers.reduce<Record<string, unknown>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });

  return parseRowsIntoLabData(rows, fallbackDate, sourceType);
}

// Extracts ANY "Label   Value [Unit]" pair from freeform text.
// Used as a fallback so CBC / urinalysis / unknown panels never produce empty results.
export function extractGeneralLabValues(text: string): Record<string, string> {
  const seen = new Set<string>();
  const results: Record<string, string> = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.length < 3 || !/\d/.test(line)) continue;

    let label = "";
    let valueStr = "";
    let unit = "";

    // Priority 1: colon separator — "Hemoglobin: 14,2 g/dL"
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const potLabel = line.slice(0, colonIdx).trim();
      const rest = line.slice(colonIdx + 1).trimStart();
      const nm = rest.match(/^(-?[\d,\.]+)\s*([A-Za-zÇçĞğİıÖöŞşÜüµ\/\%²³·]+)?/);
      if (nm && potLabel.length >= 2 && !/^\d/.test(potLabel) && !potLabel.includes("http")) {
        label = potLabel;
        valueStr = nm[1];
        unit = nm[2]?.trim() ?? "";
      }
    }

    // Priority 2: 2+ consecutive spaces — "WBC (Lökosit)     7,50    K/µL    4,50-11,00    Normal"
    if (!label) {
      const spIdx = line.search(/\s{2,}/);
      if (spIdx > 0) {
        const potLabel = line.slice(0, spIdx).trim();
        const rest = line.slice(spIdx).trimStart();
        const nm = rest.match(/^(-?[\d,\.]+)\s*([A-Za-zÇçĞğİıÖöŞşÜüµ\/\%²³·]+)?/);
        if (nm && potLabel.length >= 2 && !/^\d/.test(potLabel)) {
          label = potLabel;
          valueStr = nm[1];
          unit = nm[2]?.trim() ?? "";
        }
      }
    }

    if (label && valueStr && !seen.has(label.toLocaleLowerCase("tr-TR"))) {
      seen.add(label.toLocaleLowerCase("tr-TR"));
      results[label] = unit ? `${valueStr} ${unit}` : valueStr;
    }
  }

  return results;
}

export function buildSingleLabPoint(
  rawText: string,
  fallbackDate: string,
  sourceType: LabImportSource,
  meta?: Partial<LabDataPoint>
): LabDataPoint | null {
  const values = extractLabValuesFromText(rawText);
  const rawResults = extractGeneralLabValues(rawText);

  const hasTyped = Object.keys(values).length > 0;
  const hasRaw = Object.keys(rawResults).length > 0;

  if (!hasTyped && !hasRaw) return null;

  return {
    date: extractFirstDate(rawText) ?? fallbackDate,
    sourceType,
    rawText,
    rawResults: hasRaw ? rawResults : undefined,
    ...values,
    ...meta,
  };
}
