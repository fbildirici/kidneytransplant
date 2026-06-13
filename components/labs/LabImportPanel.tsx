"use client";

import { ChangeEvent, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  appendLabData,
  LAB_METRIC_DEFINITIONS,
  LabDataPoint,
  LabImportSource,
} from "@/lib/store";
import {
  buildSingleLabPoint,
  parseDelimitedLabText,
  parseRowsIntoLabData,
} from "@/lib/lab-utils";
import { useToast } from "@/lib/toast-context";
import {
  CheckCircle2,
  ClipboardPaste,
  FileSpreadsheet,
  FileText,
  Loader2,
  Save,
  Upload,
  WandSparkles,
} from "lucide-react";

const TODAY_ISO = new Date().toISOString().slice(0, 10);

const SAMPLE_ENABIZ_TEXT = `Biyokimya ve Hematoloji Sonuçları
Tarih: ${TODAY_ISO}

Kreatinin                1,20    mg/dL
Üre                      32,0    mg/dL
Ürik Asit                5,80    mg/dL
GFR (CKD-EPI)            65,0    mL/min
Potasyum                 4,80    mmol/L
Sodyum                   139,0   mmol/L
Fosfor                   3,90    mg/dL
Albümin                  4,10    g/dL
CRP                      3,20    mg/L
Hemoglobin               14,2    g/dL
Tacrolimus               10,5    ng/mL`;

const SAMPLE_CBC_TEXT = `Tam Kan Sayımı
Tarih: ${TODAY_ISO}

WBC (Lökosit)            7,50    K/µL
RBC (Eritrosit)          4,80    M/µL
Hemoglobin               14,2    g/dL
Hematokrit               42,5    %
MCV                      88,5    fL
MCH                      29,6    pg
MCHC                     33,4    g/dL
PLT (Trombosit)          245     K/µL
NEU (Nötrofil)           65,2    %
LYM (Lenfosit)           25,3    %
MON (Monosit)            7,10    %
EOS (Eozinofil)          2,10    %
BAS (Bazofil)            0,30    %`;

const MANUAL_KEYS = [
  "creatinine",
  "gfr",
  "tacrolimus",
  "urea",
  "hemoglobin",
  "potassium",
  "sodium",
  "phosphorus",
] as const;

async function loadXlsxClient() {
  return XLSX;
}

async function loadPdfJsClient() {
  const pdfjs = await import("pdfjs-dist");
  return pdfjs;
}

type Mode = "paste" | "file" | "manual";

interface LabImportPanelProps {
  patientId: string;
  patientName: string;
  importedBy: string;
  onImported?: (points: LabDataPoint[]) => void;
}

function nowLabel(): string {
  return new Date().toLocaleString("tr-TR");
}

function renderValue(value: number | undefined): string {
  return typeof value === "number" ? value.toString() : "-";
}

export default function LabImportPanel({
  patientId,
  patientName,
  importedBy,
  onImported,
}: LabImportPanelProps) {
  const [mode, setMode] = useState<Mode>("paste");
  const [reportDate, setReportDate] = useState(TODAY_ISO);
  const [rawText, setRawText] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<LabDataPoint[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const toast = useToast();

  const previewCards = useMemo(
    () =>
      preview.map((point) => ({
        point,
        metrics: MANUAL_KEYS.filter((key) => typeof point[key] === "number"),
        rawEntries: Object.entries(point.rawResults ?? {}),
      })),
    [preview]
  );

  const withMeta = (
    points: LabDataPoint[],
    sourceType: LabImportSource,
    sourceLabel: string,
    rawSource?: string
  ): LabDataPoint[] =>
    points.map((point) => ({
      ...point,
      sourceType,
      sourceLabel,
      sourceFileName: fileName || undefined,
      importedAt: nowLabel(),
      importedBy,
      notes: notes || point.notes,
      rawText: rawSource ?? point.rawText,
    }));

  const applyPreview = (
    points: LabDataPoint[],
    sourceType: LabImportSource,
    sourceLabel: string,
    rawSource?: string
  ) => {
    if (!points.length) {
      setError("Sonuçlardan tanınabilir laboratuvar verisi çıkarılamadı.");
      setPreview([]);
      return;
    }
    setError("");
    setPreview(withMeta(points, sourceType, sourceLabel, rawSource));
  };

  // ─── Paste mode parser ────────────────────────────────────────────────────
  // BUG FIX: Do NOT treat comma as a delimiter indicator.
  // Turkish lab results use comma as the decimal separator (e.g. "1,20 mg/dL").
  // Routing comma-containing text through the CSV parser produces completely
  // wrong values (e.g. creatinine = 4 instead of 1.20).
  // Only use structured table parsing for tab- or semicolon-delimited text.
  const parseRawTextInput = () => {
    const trimmed = rawText.trim();
    if (!trimmed) {
      setError("Yapıştırılan metin boş.");
      return;
    }

    if (trimmed.includes("\t") || trimmed.includes(";")) {
      const parsedRows = parseDelimitedLabText(trimmed, reportDate, "copy-paste");
      if (parsedRows.length > 0) {
        applyPreview(parsedRows, "copy-paste", "Kopyala-yapıştır tablosu", trimmed);
        return;
      }
    }

    // Freeform text parser — handles e-Nabız style, Turkish decimal commas,
    // wide column-aligned spaces, GFR (CKD-EPI) parenthetical formats, etc.
    const single = buildSingleLabPoint(trimmed, reportDate, "copy-paste", {
      sourceLabel: "Kopyala-yapıştır raporu",
    });
    if (!single) {
      setError(
        "Metinde tanınabilir laboratuvar değeri bulunamadı. " +
        "Değerlerin yanında birim veya parametre adı olduğundan emin olun, " +
        "ya da Manuel sekmesini kullanın."
      );
      return;
    }

    applyPreview([single], "copy-paste", "Kopyala-yapıştır raporu", trimmed);
  };

  // ─── Manual mode parser ───────────────────────────────────────────────────
  const parseManualInput = () => {
    const point: LabDataPoint = {
      date: reportDate,
      sourceType: "manual",
      sourceLabel: "Doktor manuel girişi",
    };

    MANUAL_KEYS.forEach((key) => {
      const raw = manualValues[key];
      if (!raw) return;
      const value = Number(raw.replace(",", "."));
      if (Number.isFinite(value)) point[key] = value;
    });

    const hasValue = MANUAL_KEYS.some((key) => typeof point[key] === "number");
    if (!hasValue) {
      setError("En az bir laboratuvar parametresi girin.");
      return;
    }

    applyPreview([point], "manual", "Doktor manuel girişi");
  };

  // ─── File upload handler ──────────────────────────────────────────────────
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError("");
    setFileName(file.name);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

      if (["csv", "txt", "tsv"].includes(extension)) {
        const text = await file.text();
        setRawText(text);
        const parsed = parseDelimitedLabText(
          text,
          reportDate,
          extension === "csv" ? "csv" : "copy-paste"
        );
        if (parsed.length > 0) {
          applyPreview(
            parsed,
            extension === "csv" ? "csv" : "copy-paste",
            `${file.name} dosyası`,
            text
          );
        } else {
          const single = buildSingleLabPoint(text, reportDate, "copy-paste", {
            sourceFileName: file.name,
          });
          if (!single) throw new Error("Dosya içeriğinden laboratuvar verisi ayrıştırılamadı.");
          applyPreview([single], "copy-paste", `${file.name} dosyası`, text);
        }
      } else if (["xlsx", "xls"].includes(extension)) {
        const xlsx = await loadXlsxClient();
        const data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        });
        const parsed = parseRowsIntoLabData(rows, reportDate, "excel");
        if (!parsed.length)
          throw new Error("Excel dosyasında tanınabilir laboratuvar kolonu bulunamadı.");
        applyPreview(parsed, "excel", `${file.name} Excel aktarımı`);
      } else if (extension === "pdf") {
        const pdfjs = await loadPdfJsClient();
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
        const data = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data }).promise;
        const pageTexts: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pageTexts.push(
            content.items.map((item) => ("str" in item ? item.str : "")).join(" ")
          );
        }
        const text = pageTexts.join("\n");
        setRawText(text);
        const single = buildSingleLabPoint(text, reportDate, "pdf", {
          sourceFileName: file.name,
          sourceLabel: "PDF raporu",
        });
        if (!single)
          throw new Error(
            "PDF metninden laboratuvar değeri çıkarılamadı. " +
            "Kopyala/Yapıştır sekmesiyle deneyin."
          );
        applyPreview([single], "pdf", "PDF raporu", text);
      } else {
        throw new Error("Desteklenmeyen dosya türü. PDF, XLSX, XLS, CSV veya TXT yükleyin.");
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Dosya işlenemedi.";
      setError(message);
      setPreview([]);
    } finally {
      setBusy(false);
    }
  };

  // ─── Save preview to store ────────────────────────────────────────────────
  const savePreview = () => {
    if (!preview.length) {
      setError("Önce kaydedilecek bir önizleme oluşturun.");
      return;
    }

    const allSaved = appendLabData(patientId, preview);
    const justImported = allSaved.filter((point) =>
      preview.some((candidate) => candidate.date === point.date)
    );
    onImported?.(justImported);

    const metricCount = preview.reduce((sum, p) => {
      const typed = Object.keys(p).filter(
        (k) => k !== "date" && typeof (p as unknown as Record<string, unknown>)[k] === "number"
      ).length;
      const raw = Object.keys(p.rawResults ?? {}).length;
      return sum + typed + raw;
    }, 0);

    toast.addToast(
      `${patientName} için ${metricCount} laboratuvar değeri kaydedildi.`,
      "success"
    );
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);

    setPreview([]);
    setNotes("");
    setRawText("");
    setManualValues({});
    setError("");
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-card">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-text-primary">Laboratuvar Import Merkezi</p>
          <p className="text-xs text-text-muted">
            {patientName} için e-Nabız, PDF, Excel veya kopyala-yapıştır ile sonuç ekleyin.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { id: "paste", label: "Metin / e-Nabız", icon: WandSparkles },
            { id: "file",  label: "PDF / Excel",     icon: Upload },
            { id: "manual", label: "Manuel",          icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setMode(item.id as Mode); setError(""); setPreview([]); }}
              className={`flex items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                mode === item.id
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        {/* ── Left: input area ── */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Rapor Tarihi
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Not</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örnek: e-Nabız Haziran paneli"
                className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Paste mode */}
          {mode === "paste" && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-text-secondary">
                  e-Nabız veya laboratuvar raporunuzu yapıştırın
                </label>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setRawText(SAMPLE_ENABIZ_TEXT); setError(""); }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-[var(--radius-md)] transition-colors cursor-pointer"
                  >
                    <ClipboardPaste size={12} />
                    Biyokimya
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRawText(SAMPLE_CBC_TEXT); setError(""); }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 border border-navy-200 px-2.5 py-1.5 rounded-[var(--radius-md)] transition-colors cursor-pointer"
                  >
                    <ClipboardPaste size={12} />
                    Tam Kan
                  </button>
                </div>
              </div>
              <textarea
                rows={10}
                value={rawText}
                onChange={(e) => { setRawText(e.target.value); setError(""); }}
                placeholder={
                  "e-Nabız'dan Ctrl+A, Ctrl+C ile kopyalayıp yapıştırın.\n\n" +
                  "Örnek format:\n" +
                  "Kreatinin        1,20    mg/dL\n" +
                  "Potasyum         4,80    mmol/L\n" +
                  "GFR (CKD-EPI)   65,0    mL/min\n" +
                  "Hemoglobin       14,2    g/dL\n" +
                  "Tacrolimus       10,5    ng/mL"
                }
                className="modern-field w-full resize-none rounded-[var(--radius-xl)] border border-border px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={parseRawTextInput}
                className="rounded-[var(--radius-lg)] bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
              >
                Metni Analiz Et
              </button>
            </div>
          )}

          {/* File mode */}
          {mode === "file" && (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-border bg-surface-muted px-4 py-10 text-center hover:border-teal-300 hover:bg-teal-50/60 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,.txt,.tsv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="space-y-2">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-xl)] bg-surface shadow-card">
                    <FileSpreadsheet size={20} className="text-teal-600" />
                  </span>
                  <span className="block text-sm font-semibold text-text-secondary">
                    PDF, Excel veya CSV yükle
                  </span>
                  <span className="block text-xs text-text-muted">
                    e-Nabız PDF, laboratuvar Excel listesi veya metin dosyası desteklenir
                  </span>
                </span>
              </label>
              {busy && (
                <div className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-surface-muted px-3 py-2 text-sm text-text-secondary">
                  <Loader2 size={15} className="animate-spin" />
                  Dosya işleniyor...
                </div>
              )}
              {fileName && (
                <p className="text-xs text-text-tertiary">Seçilen dosya: {fileName}</p>
              )}
            </div>
          )}

          {/* Manual mode */}
          {mode === "manual" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {MANUAL_KEYS.map((key) => {
                const metric = LAB_METRIC_DEFINITIONS.find((m) => m.key === key);
                if (!metric) return null;
                return (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                      {metric.label} ({metric.unit})
                    </label>
                    <input
                      type="text"
                      value={manualValues[key] ?? ""}
                      onChange={(e) =>
                        setManualValues((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={metric.normalMin.toString()}
                      className="modern-field w-full rounded-[var(--radius-lg)] border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                );
              })}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={parseManualInput}
                  className="rounded-[var(--radius-lg)] bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
                >
                  Manuel Girdiyi Hazırla
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-[var(--radius-lg)] border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              {error}
            </div>
          )}
        </div>

        {/* ── Right: preview ── */}
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface-muted p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-text-primary">Önizleme</p>
              <p className="text-xs text-text-muted">
                Kaydetmeden önce ayrıştırılan değerleri kontrol edin.
              </p>
            </div>
            <button
              type="button"
              onClick={savePreview}
              disabled={preview.length === 0}
              className={`rounded-[var(--radius-lg)] px-3 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                justSaved ? "bg-success-500" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              <span className="flex items-center gap-2">
                {justSaved ? <CheckCircle2 size={13} /> : <Save size={13} />}
                {justSaved ? "Kaydedildi!" : "Kaydet"}
              </span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {previewCards.length === 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-text-muted">
                Henüz önizleme yok.
                <br />
                <span className="text-xs">
                  Metni analiz ettikten sonra burada görünecek.
                </span>
              </div>
            ) : (
              previewCards.map(({ point, metrics, rawEntries }, index) => {
                const totalCount = metrics.length + rawEntries.length;
                return (
                <div
                  key={`${point.date}-${index}`}
                  className="rounded-[var(--radius-xl)] border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{point.date}</p>
                      <p className="text-xs text-text-muted">{point.sourceLabel}</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                      {totalCount} değer
                    </span>
                  </div>

                  {metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {metrics.map((metricKey) => {
                        const metric = LAB_METRIC_DEFINITIONS.find((m) => m.key === metricKey);
                        if (!metric) return null;
                        const val = point[metricKey] as number;
                        const inRange = val >= metric.normalMin && val <= metric.normalMax;
                        return (
                          <div
                            key={metricKey}
                            className={`rounded-[var(--radius-lg)] px-3 py-2 ${
                              inRange ? "bg-success-50" : "bg-warning-50"
                            }`}
                          >
                            <p className="text-[11px] font-medium text-text-tertiary">
                              {metric.label}
                            </p>
                            <p className={`text-sm font-bold ${inRange ? "text-success-700" : "text-warning-700"}`}>
                              {renderValue(val)} {metric.unit}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {rawEntries.length > 0 && (
                    <div className="rounded-[var(--radius-lg)] border border-border bg-surface-muted overflow-hidden">
                      <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-text-muted border-b border-border">
                        Tüm Çıkarılan Değerler ({rawEntries.length})
                      </p>
                      <div className="divide-y divide-border max-h-48 overflow-y-auto">
                        {rawEntries.map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between px-3 py-1.5 gap-2">
                            <span className="text-xs text-text-secondary truncate">{label}</span>
                            <span className="text-xs font-semibold text-text-primary flex-shrink-0">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
