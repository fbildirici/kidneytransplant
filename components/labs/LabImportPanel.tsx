"use client";

import { ChangeEvent, useMemo, useState } from "react";
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
import { FileSpreadsheet, FileText, Loader2, Save, Upload, WandSparkles } from "lucide-react";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";

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
  return pdfjsLib;
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
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [rawText, setRawText] = useState("");
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<LabDataPoint[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});

  const previewCards = useMemo(
    () =>
      preview.map((point) => ({
        point,
        metrics: MANUAL_KEYS.filter((key) => typeof point[key] === "number"),
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

  const applyPreview = (points: LabDataPoint[], sourceType: LabImportSource, sourceLabel: string, rawSource?: string) => {
    if (!points.length) {
      setError("Sonuçlardan tanınabilir laboratuvar verisi çıkarılamadı.");
      setPreview([]);
      return;
    }

    setError("");
    setPreview(withMeta(points, sourceType, sourceLabel, rawSource));
  };

  const parseRawTextInput = () => {
    const trimmed = rawText.trim();
    if (!trimmed) {
      setError("Yapıştırılan metin boş.");
      return;
    }

    const parsedRows =
      trimmed.includes("\t") || trimmed.includes(";") || trimmed.includes(",")
        ? parseDelimitedLabText(trimmed, reportDate, "copy-paste")
        : [];

    if (parsedRows.length > 0) {
      applyPreview(parsedRows, "copy-paste", "Kopyala-yapıştır tablosu", trimmed);
      return;
    }

    const single = buildSingleLabPoint(trimmed, reportDate, "copy-paste", {
      sourceLabel: "Kopyala-yapıştır raporu",
    });
    if (!single) {
      setError("Metinde tanınabilir laboratuvar değeri bulunamadı.");
      return;
    }

    applyPreview([single], "copy-paste", "Kopyala-yapıştır raporu", trimmed);
  };

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

        const parsed = parseDelimitedLabText(text, reportDate, extension === "csv" ? "csv" : "copy-paste");
        if (parsed.length > 0) {
          applyPreview(parsed, extension === "csv" ? "csv" : "copy-paste", `${file.name} dosyasi`, text);
        } else {
          const single = buildSingleLabPoint(text, reportDate, "copy-paste", { sourceFileName: file.name });
          if (!single) throw new Error("Dosya iceriginden laboratuvar verisi ayrıştırılamadı.");
          applyPreview([single], "copy-paste", `${file.name} dosyasi`, text);
        }
      } else if (["xlsx", "xls"].includes(extension)) {
        const xlsx = await loadXlsxClient();
        const data = await file.arrayBuffer();
        const workbook = xlsx.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
        const parsed = parseRowsIntoLabData(rows, reportDate, "excel");
        if (!parsed.length) throw new Error("Excel dosyasinda tanınabilir laboratuvar kolonu bulunamadı.");
        applyPreview(parsed, "excel", `${file.name} Excel aktarımı`);
      } else if (extension === "pdf") {
        const pdfjs = await loadPdfJsClient();
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

        const data = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data }).promise;
        const pageTexts: string[] = [];

        for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex);
          const content = await page.getTextContent();
          const text = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          pageTexts.push(text);
        }

        const text = pageTexts.join("\n");
        setRawText(text);
        const single = buildSingleLabPoint(text, reportDate, "pdf", {
          sourceFileName: file.name,
          sourceLabel: "PDF raporu",
        });
        if (!single) throw new Error("PDF metninden laboratuvar değeri çıkarılamadı. Kopyala/Yapıştır sekmesiyle manuel düzeltme yapabilirsiniz.");
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

  const savePreview = () => {
    if (!preview.length) {
      setError("Önce kaydedilecek bir önizleme oluşturun.");
      return;
    }

    const saved = appendLabData(patientId, preview);
    const justImported = saved.filter((point) => preview.some((candidate) => candidate.date === point.date));
    onImported?.(justImported);
    setPreview([]);
    setNotes("");
    setRawText("");
    setManualValues({});
    setError("");
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Laboratuvar Import Merkezi</p>
          <p className="text-xs text-slate-400">{patientName} icin e-Nabız, PDF, Excel veya kopyala-yapıştır ile sonuç ekleyin.</p>
        </div>
        <div className="flex gap-2">
          {[
            { id: "paste", label: "Copy/Paste", icon: WandSparkles },
            { id: "file", label: "PDF / Excel", icon: Upload },
            { id: "manual", label: "Manuel", icon: FileText },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id as Mode)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                mode === item.id
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Rapor Tarihi</label>
              <input
                type="date"
                value={reportDate}
                onChange={(event) => setReportDate(event.target.value)}
                className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Not</label>
              <input
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Ornek: e-Nabiz 26 Nisan paneli"
                className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {mode === "paste" && (
            <div className="space-y-3">
              <textarea
                rows={10}
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
                placeholder="e-Nabiz, web sitesi veya PDF'den laboratuvar metnini yapistirin..."
                className="modern-field w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={parseRawTextInput}
                className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
              >
                Yapiştırılan Metni Ayrıştır
              </button>
            </div>
          )}

          {mode === "file" && (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center hover:border-teal-300 hover:bg-teal-50/60 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,.txt,.tsv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="space-y-2">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <FileSpreadsheet size={20} className="text-teal-600" />
                  </span>
                  <span className="block text-sm font-semibold text-slate-700">
                    PDF, Excel veya CSV yukle
                  </span>
                  <span className="block text-xs text-slate-400">
                    e-Nabiz PDF, laboratuvar Excel listesi veya metin dosyası desteklenir
                  </span>
                </span>
              </label>
              {busy && (
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  <Loader2 size={15} className="animate-spin" />
                  Dosya işleniyor...
                </div>
              )}
              {fileName && <p className="text-xs text-slate-500">Seçilen dosya: {fileName}</p>}
            </div>
          )}

          {mode === "manual" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {MANUAL_KEYS.map((key) => {
                const metric = LAB_METRIC_DEFINITIONS.find((item) => item.key === key);
                if (!metric) return null;

                return (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      {metric.label} ({metric.unit})
                    </label>
                    <input
                      type="text"
                      value={manualValues[key] ?? ""}
                      onChange={(event) =>
                        setManualValues((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                      placeholder={metric.normalMin.toString()}
                      className="modern-field w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                );
              })}

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={parseManualInput}
                  className="rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600 transition-colors cursor-pointer"
                >
                  Manuel Girdiyi Hazirla
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Önizleme</p>
              <p className="text-xs text-slate-400">Kaydetmeden önce ayrıştırılan değerleri kontrol edin.</p>
            </div>
            <button
              type="button"
              onClick={savePreview}
              disabled={preview.length === 0}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                <Save size={13} />
                Kaydet
              </span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {previewCards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                Henüz önizleme yok.
              </div>
            ) : (
              previewCards.map(({ point, metrics }, index) => (
                <div key={`${point.date}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{point.date}</p>
                      <p className="text-xs text-slate-400">{point.sourceType} importu</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                      {metrics.length} metrik
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {metrics.map((metricKey) => {
                      const metric = LAB_METRIC_DEFINITIONS.find((item) => item.key === metricKey);
                      if (!metric) return null;
                      return (
                        <div key={metricKey} className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-medium text-slate-500">{metric.label}</p>
                          <p className="text-sm font-bold text-slate-900">
                            {renderValue(point[metricKey])} {metric.unit}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
