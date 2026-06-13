// Shared localStorage store for cross-role data sharing.
// All reads are safe on SSR via typeof window guards.

export type UserRole = "patient" | "doctor" | "dietitian" | "coordinator";
export type ProviderRole = "doctor" | "dietitian";
export type PatientStatus = "stable" | "warning" | "critical";
export type AppointmentStatus = "available" | "pending" | "approved" | "rejected";
export type LabImportSource = "manual" | "copy-paste" | "pdf" | "excel" | "csv" | "e-nabiz";

export interface PatientRecord {
  id: string;
  name: string;
  initials: string;
  age: number;
  transplantDate: string;
  lastVisit: string;
  status: PatientStatus;
  pendingMessages: number;
  bloodGroup: string;
  creatinine: string;
  tacrolimusLevel: string;
  weight: string;
  bmi: string;
  assignedDoctorName: string;
  assignedDietitianName: string;
  epicrisis: string;
  notes?: string;
  createdAt: string;
}

export interface StoredMedication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes: string;
  prescribedBy: string;
  prescribedDate: string;
  active: boolean;
}

export interface DietMeal {
  meal: string;
  items: string[];
}

export interface StoredDietPlan {
  patientId: string;
  prescribedBy: string;
  calorieTarget: number;
  proteinTarget: string;
  potassiumLimit: string;
  phosphorusLimit: string;
  fluidLimit: string;
  restrictions: string[];
  meals: DietMeal[];
  notes: string;
  lastUpdated: string;
  updatedByRole?: UserRole;
  patientEditable?: boolean;
  patientNotes?: string[];
}

export type LabMetricKey =
  | "creatinine"
  | "urea"
  | "uricAcid"
  | "gfr"
  | "urineProtein"
  | "urineCreatinine"
  | "spotUrine"
  | "tacrolimus"
  | "hemoglobin"
  | "potassium"
  | "sodium"
  | "phosphorus"
  | "albumin"
  | "crp";

export interface LabMetricDefinition {
  key: LabMetricKey;
  label: string;
  unit: string;
  color: string;
  normalMin: number;
  normalMax: number;
  description: string;
  higherIsBetter?: boolean;
}

export const LAB_METRIC_DEFINITIONS: LabMetricDefinition[] = [
  {
    key: "creatinine",
    label: "Kreatinin",
    unit: "mg/dL",
    color: "#0ea5e9",
    normalMin: 0.7,
    normalMax: 1.3,
    description: "Böbrek fonksiyonunun temel göstergesi",
  },
  {
    key: "urea",
    label: "Üre",
    unit: "mg/dL",
    color: "#f59e0b",
    normalMin: 15,
    normalMax: 45,
    description: "Protein metabolizması atığı",
  },
  {
    key: "uricAcid",
    label: "Ürik Asit",
    unit: "mg/dL",
    color: "#8b5cf6",
    normalMin: 3.5,
    normalMax: 7.2,
    description: "Gut riski ve böbrek yükü",
  },
  {
    key: "gfr",
    label: "GFR",
    unit: "mL/min/1.73m²",
    color: "#10b981",
    normalMin: 60,
    normalMax: 120,
    description: "Glomerüler filtrasyon hızı",
    higherIsBetter: true,
  },
  {
    key: "urineProtein",
    label: "İdrarda Protein",
    unit: "mg/gün",
    color: "#ef4444",
    normalMin: 0,
    normalMax: 150,
    description: "Proteinüri",
  },
  {
    key: "tacrolimus",
    label: "Tacrolimus",
    unit: "ng/mL",
    color: "#6366f1",
    normalMin: 8,
    normalMax: 12,
    description: "İmmünosupresyon düzeyi",
  },
  {
    key: "hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    color: "#ec4899",
    normalMin: 12,
    normalMax: 17,
    description: "Anemi takibi",
    higherIsBetter: true,
  },
  {
    key: "urineCreatinine",
    label: "İdrarda Kreatinin",
    unit: "mg/dL",
    color: "#06b6d4",
    normalMin: 60,
    normalMax: 300,
    description: "İdrar konsantrasyon göstergesi",
    higherIsBetter: true,
  },
  {
    key: "spotUrine",
    label: "Spot İdrar P/C",
    unit: "oran",
    color: "#f97316",
    normalMin: 0,
    normalMax: 0.2,
    description: "Protein/Kreatinin oranı",
  },
  {
    key: "potassium",
    label: "Potasyum",
    unit: "mmol/L",
    color: "#14b8a6",
    normalMin: 3.5,
    normalMax: 5.1,
    description: "Elektrolit dengesi",
  },
  {
    key: "sodium",
    label: "Sodyum",
    unit: "mmol/L",
    color: "#2563eb",
    normalMin: 135,
    normalMax: 145,
    description: "Sıvı-elektrolit dengesi",
  },
  {
    key: "phosphorus",
    label: "Fosfor",
    unit: "mg/dL",
    color: "#7c3aed",
    normalMin: 2.5,
    normalMax: 4.5,
    description: "Mineral metabolizması",
  },
  {
    key: "albumin",
    label: "Albümin",
    unit: "g/dL",
    color: "#059669",
    normalMin: 3.5,
    normalMax: 5.2,
    description: "Beslenme ve inflamasyon göstergesi",
    higherIsBetter: true,
  },
  {
    key: "crp",
    label: "CRP",
    unit: "mg/L",
    color: "#dc2626",
    normalMin: 0,
    normalMax: 5,
    description: "İnflamasyon göstergesi",
  },
];

export interface LabDataPoint {
  date: string;
  creatinine?: number;
  urea?: number;
  uricAcid?: number;
  gfr?: number;
  urineProtein?: number;
  urineCreatinine?: number;
  spotUrine?: number;
  tacrolimus?: number;
  hemoglobin?: number;
  potassium?: number;
  sodium?: number;
  phosphorus?: number;
  albumin?: number;
  crp?: number;
  sourceType?: LabImportSource;
  sourceLabel?: string;
  sourceFileName?: string;
  importedAt?: string;
  importedBy?: string;
  notes?: string;
  rawText?: string;
  rawResults?: Record<string, string>;
}

export interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  providerRole: ProviderRole;
  providerName: string;
  specialty: string;
  location: string;
  available: boolean;
  status: AppointmentStatus;
  bookedByPatientId?: string;
  bookedByPatientName?: string;
  bookedAt?: string;
  requestedByRole?: UserRole;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdByRole?: UserRole;
}

export interface CohortMetricSummary {
  key: LabMetricKey;
  label: string;
  unit: string;
  latestMean: number;
  change12m: number;
  normalMin: number;
  normalMax: number;
}

export interface RetrospectiveCohortSummary {
  patientCount: number;
  monthlyAverages: LabDataPoint[];
  metricSummaries: CohortMetricSummary[];
}

const TODAY = new Date().toISOString().split("T")[0];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const DEFAULT_PATIENTS: PatientRecord[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    initials: "AY",
    age: 45,
    transplantDate: "2023-06-15",
    lastVisit: "2026-02-10",
    status: "stable",
    pendingMessages: 2,
    bloodGroup: "A Rh+",
    creatinine: "1.2 mg/dL",
    tacrolimusLevel: "12.5 ng/mL",
    weight: "78 kg",
    bmi: "24.5",
    assignedDoctorName: "Dr. Ayşe Kaya",
    assignedDietitianName: "Dyt. Zeynep Arslan",
    epicrisis:
      "Ahmet Yılmaz, 45 yaşında erkek hasta. 15.06.2023 tarihinde canlı vericiden böbrek nakli yapıldı. İmmünosupresif tedavi: Tacrolimus + Mycophenolate + Prednizolon. Son kontrolde kreatinin 1.2 mg/dL, Tacrolimus 12.5 ng/mL (hafif yüksek). Akut rejeksiyon bulgusu yok.",
    notes: "Beslenme uyumu iyi. Düzenli takipte.",
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Fatma Demir",
    initials: "FD",
    age: 38,
    transplantDate: "2024-03-03",
    lastVisit: "2026-02-05",
    status: "warning",
    pendingMessages: 1,
    bloodGroup: "B Rh+",
    creatinine: "1.8 mg/dL",
    tacrolimusLevel: "6.2 ng/mL",
    weight: "65 kg",
    bmi: "23.1",
    assignedDoctorName: "Dr. Ayşe Kaya",
    assignedDietitianName: "Dyt. Zeynep Arslan",
    epicrisis:
      "Fatma Demir, 38 yaşında kadın hasta. 03.03.2024 tarihinde kadavradan böbrek nakli. Kreatinin artışı ve düşük Tacrolimus nedeniyle yakın takip altında. Biyopsi değerlendiriliyor.",
    notes: "Fosfor ve potasyum yüksek eğilimli.",
    createdAt: "2026-01-12",
  },
  {
    id: "3",
    name: "Mehmet Çelik",
    initials: "MÇ",
    age: 52,
    transplantDate: "2022-11-20",
    lastVisit: "2026-02-01",
    status: "critical",
    pendingMessages: 3,
    bloodGroup: "0 Rh-",
    creatinine: "2.4 mg/dL",
    tacrolimusLevel: "4.1 ng/mL",
    weight: "89 kg",
    bmi: "27.8",
    assignedDoctorName: "Dr. Ayşe Kaya",
    assignedDietitianName: "Dyt. Zeynep Arslan",
    epicrisis:
      "Mehmet Çelik, 52 yaşında erkek hasta. 20.11.2022 tarihinde canlı vericiden nakil. Akut rejeksiyon episodu. Kreatinin 2.4 mg/dL, Tacrolimus 4.1 ng/mL (kritik). Pulse steroid başlandı. Yatış planlandı.",
    notes: "Sıvı ve tuz kısıtlaması kritik.",
    createdAt: "2026-01-15",
  },
  {
    id: "4",
    name: "Zeynep Arslan",
    initials: "ZA",
    age: 29,
    transplantDate: "2025-09-08",
    lastVisit: "2026-02-12",
    status: "stable",
    pendingMessages: 0,
    bloodGroup: "AB Rh+",
    creatinine: "0.9 mg/dL",
    tacrolimusLevel: "9.8 ng/mL",
    weight: "58 kg",
    bmi: "21.5",
    assignedDoctorName: "Dr. Ayşe Kaya",
    assignedDietitianName: "Dyt. Zeynep Arslan",
    epicrisis:
      "Zeynep Arslan, 29 yaşında kadın hasta. 08.09.2025 tarihinde canlı vericiden nakil. Komplikasyonsuz seyir. Kreatinin 0.9 mg/dL, Tacrolimus 9.8 ng/mL.",
    notes: "Erken nakil sonrası dönem.",
    createdAt: "2026-02-01",
  },
];

const DEFAULT_MEDICATIONS: Record<string, StoredMedication[]> = {
  "1": [
    {
      id: "m1-1",
      patientId: "1",
      name: "Tacrolimus (Prograf)",
      dosage: "1.5mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Aç karnına",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2023-06-15",
      active: true,
    },
    {
      id: "m1-2",
      patientId: "1",
      name: "Mycophenolate (CellCept)",
      dosage: "500mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Tacrolimus ile birlikte alınabilir",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2023-06-15",
      active: true,
    },
    {
      id: "m1-3",
      patientId: "1",
      name: "Prednizolon",
      dosage: "5mg",
      frequency: "Günde 1 kez",
      times: ["09:00"],
      notes: "Kahvaltıdan sonra",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2023-06-15",
      active: true,
    },
  ],
  "2": [
    {
      id: "m2-1",
      patientId: "2",
      name: "Tacrolimus (Prograf)",
      dosage: "2mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Kan düzeyi takibi yapılmalı",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2024-03-03",
      active: true,
    },
    {
      id: "m2-2",
      patientId: "2",
      name: "Mycophenolate (CellCept)",
      dosage: "750mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Mide bulantısı varsa yemekle alınabilir",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2024-03-03",
      active: true,
    },
  ],
  "3": [
    {
      id: "m3-1",
      patientId: "3",
      name: "Tacrolimus (Prograf)",
      dosage: "3mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Hedef düzey 8-12 ng/mL",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2022-11-20",
      active: true,
    },
    {
      id: "m3-2",
      patientId: "3",
      name: "Prednizolon",
      dosage: "20mg",
      frequency: "Günde 1 kez",
      times: ["09:00"],
      notes: "Rejeksiyon tedavisi sonrası",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2025-01-15",
      active: true,
    },
  ],
  "4": [
    {
      id: "m4-1",
      patientId: "4",
      name: "Tacrolimus (Prograf)",
      dosage: "2mg",
      frequency: "Günde 2 kez",
      times: ["08:00", "20:00"],
      notes: "Aç karnına alınmalı",
      prescribedBy: "Dr. Ayşe Kaya",
      prescribedDate: "2025-09-08",
      active: true,
    },
  ],
};

const DEFAULT_DIET_PLANS: Record<string, StoredDietPlan> = {
  "1": {
    patientId: "1",
    prescribedBy: "Dyt. Zeynep Arslan",
    calorieTarget: 2000,
    proteinTarget: "80g/gün",
    potassiumLimit: "2.5g/gün",
    phosphorusLimit: "1000mg/gün",
    fluidLimit: "2L/gün",
    restrictions: ["Greyfurt/Pomelo yasak", "Potasyum kısıtlı", "Tuz kısıtlı (<5g/gün)"],
    meals: [
      { meal: "Kahvaltı (07:30)", items: ["2 yumurta beyazı omlet", "2 dilim tam buğday ekmeği"] },
      { meal: "Öğle (12:00)", items: ["120g ızgara tavuk", "Pirinç pilavı", "Haşlanmış sebze"] },
      { meal: "Akşam (18:30)", items: ["Sebze çorbası", "100g balık", "Zeytinyağlı sebze"] },
    ],
    notes: "Greyfurt ve pomelo kesinlikle yasak. Su tüketimi 2L/gün.",
    lastUpdated: "2026-02-10",
    updatedByRole: "dietitian",
    patientEditable: true,
    patientNotes: ["Ara öğünde elma tercih ediyor."],
  },
  "2": {
    patientId: "2",
    prescribedBy: "Dyt. Zeynep Arslan",
    calorieTarget: 1800,
    proteinTarget: "72g/gün",
    potassiumLimit: "2.0g/gün",
    phosphorusLimit: "800mg/gün",
    fluidLimit: "1.8L/gün",
    restrictions: ["Greyfurt/Pomelo yasak", "Fosfor kısıtlı", "Potasyum kısıtlı"],
    meals: [
      { meal: "Kahvaltı", items: ["2 yumurta beyazı", "1 dilim beyaz ekmek"] },
      { meal: "Öğle", items: ["100g haşlanmış tavuk", "Pirinç", "Haşlanmış sebze"] },
      { meal: "Akşam", items: ["Az tuzlu çorba", "Haşlanmış balık"] },
    ],
    notes: "Süt ürünleri azaltılacak.",
    lastUpdated: "2026-02-05",
    updatedByRole: "dietitian",
    patientEditable: true,
  },
  "3": {
    patientId: "3",
    prescribedBy: "Dyt. Zeynep Arslan",
    calorieTarget: 1800,
    proteinTarget: "60g/gün",
    potassiumLimit: "1.5g/gün",
    phosphorusLimit: "700mg/gün",
    fluidLimit: "1.2L/gün",
    restrictions: ["Sıvı kısıtlaması (1.2L/gün)", "Potasyum kısıtlı", "Fosfor kısıtlı", "Tuz yasak"],
    meals: [
      { meal: "Kahvaltı", items: ["1 yumurta beyazı", "1 dilim ekmek"] },
      { meal: "Öğle", items: ["80g haşlanmış tavuk", "Az pirinç pilavı"] },
      { meal: "Akşam", items: ["Az sıvı çorba", "80g balık"] },
    ],
    notes: "Sıvı kısıtlaması kritik.",
    lastUpdated: "2026-02-01",
    updatedByRole: "dietitian",
    patientEditable: true,
  },
  "4": {
    patientId: "4",
    prescribedBy: "Dyt. Zeynep Arslan",
    calorieTarget: 1900,
    proteinTarget: "75g/gün",
    potassiumLimit: "2.5g/gün",
    phosphorusLimit: "1000mg/gün",
    fluidLimit: "2L/gün",
    restrictions: ["Greyfurt/Pomelo yasak", "Çiğ et/balık yasak"],
    meals: [
      { meal: "Kahvaltı", items: ["2 yumurta", "Peynir", "2 dilim ekmek"] },
      { meal: "Öğle", items: ["120g pişmiş tavuk", "Pilav veya makarna"] },
      { meal: "Akşam", items: ["Çorba", "Et veya balık", "Sebze"] },
    ],
    notes: "Pastörize olmayan ürün yasak.",
    lastUpdated: "2026-02-12",
    updatedByRole: "dietitian",
    patientEditable: true,
  },
};

function generateLabData(
  months: string[],
  creatinineVals: number[],
  ureaVals: number[],
  uricAcidVals: number[],
  gfrVals: number[],
  urineProteinVals: number[],
  tacrolimusVals: number[],
  hemoglobinVals: number[],
  potassiumVals: number[],
  sodiumVals: number[],
  phosphorusVals: number[],
): LabDataPoint[] {
  return months.map((date, i) => ({
    date,
    creatinine: creatinineVals[i],
    urea: ureaVals[i],
    uricAcid: uricAcidVals[i],
    gfr: gfrVals[i],
    urineProtein: urineProteinVals[i],
    urineCreatinine: Math.round(70 + ((i * 17) % 130)),
    spotUrine: parseFloat((urineProteinVals[i] / Math.max(300, 900 + i * 50)).toFixed(2)),
    tacrolimus: tacrolimusVals[i],
    hemoglobin: hemoglobinVals[i],
    potassium: potassiumVals[i],
    sodium: sodiumVals[i],
    phosphorus: phosphorusVals[i],
    albumin: parseFloat((4.1 - i * 0.01).toFixed(1)),
    crp: parseFloat((2.2 + (i % 3) * 0.4).toFixed(1)),
    sourceType: "manual",
    sourceLabel: "Başlangıç demo verisi",
  }));
}

const DEFAULT_MONTHS = [
  "2025-05",
  "2025-06",
  "2025-07",
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
];

const DEFAULT_LAB_DATA: Record<string, LabDataPoint[]> = {
  "1": generateLabData(
    DEFAULT_MONTHS,
    [1.0, 1.0, 1.1, 1.1, 1.1, 1.2, 1.1, 1.2, 1.2, 1.2, 1.2, 1.1],
    [28, 29, 30, 31, 30, 32, 31, 33, 34, 35, 36, 34],
    [5.2, 5.4, 5.1, 5.3, 5.5, 5.6, 5.4, 5.7, 5.8, 5.9, 6.0, 5.7],
    [72, 71, 70, 69, 68, 67, 68, 66, 65, 64, 64, 68],
    [80, 85, 90, 88, 92, 95, 91, 98, 100, 105, 108, 94],
    [10.2, 10.8, 9.8, 11.2, 10.5, 11.8, 10.9, 12.1, 11.5, 12.0, 11.8, 10.9],
    [13.8, 13.9, 13.7, 14.0, 13.8, 13.6, 13.9, 13.7, 13.5, 13.6, 13.4, 13.7],
    [4.4, 4.5, 4.6, 4.7, 4.5, 4.6, 4.4, 4.7, 4.8, 4.9, 4.7, 4.5],
    [139, 139, 138, 140, 139, 140, 138, 139, 140, 141, 139, 140],
    [3.7, 3.8, 3.9, 4.0, 3.8, 4.0, 3.9, 4.1, 4.0, 4.1, 4.2, 3.9]
  ),
  "2": generateLabData(
    DEFAULT_MONTHS,
    [1.3, 1.4, 1.4, 1.5, 1.5, 1.6, 1.6, 1.7, 1.7, 1.7, 1.8, 1.7],
    [32, 34, 35, 37, 38, 40, 41, 43, 44, 45, 47, 42],
    [5.8, 6.0, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 6.6],
    [60, 58, 57, 55, 54, 52, 51, 49, 48, 47, 46, 50],
    [140, 155, 162, 175, 180, 190, 195, 200, 205, 210, 215, 188],
    [9.2, 8.8, 7.5, 7.2, 6.9, 6.5, 6.8, 6.3, 6.5, 6.2, 6.0, 7.4],
    [12.5, 12.3, 12.1, 11.9, 11.8, 11.6, 11.5, 11.3, 11.2, 11.0, 10.9, 11.2],
    [4.8, 4.9, 5.0, 5.2, 5.3, 5.1, 5.0, 5.2, 5.1, 5.3, 5.2, 4.9],
    [138, 137, 138, 137, 136, 137, 138, 137, 136, 137, 136, 138],
    [4.3, 4.2, 4.4, 4.5, 4.6, 4.4, 4.3, 4.5, 4.6, 4.5, 4.7, 4.3]
  ),
  "3": generateLabData(
    DEFAULT_MONTHS,
    [1.5, 1.6, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.3, 2.0],
    [40, 42, 43, 45, 48, 52, 55, 58, 62, 65, 68, 58],
    [6.5, 6.7, 6.9, 7.0, 7.2, 7.5, 7.8, 8.0, 8.2, 8.4, 8.5, 7.4],
    [50, 48, 47, 45, 42, 40, 37, 35, 32, 30, 29, 38],
    [200, 220, 235, 250, 280, 310, 340, 370, 400, 420, 440, 330],
    [8.5, 7.2, 6.5, 5.8, 5.2, 4.8, 4.5, 4.2, 4.0, 3.8, 4.1, 7.6],
    [13.0, 12.8, 12.5, 12.2, 12.0, 11.8, 11.5, 11.2, 11.0, 10.8, 10.6, 11.4],
    [5.1, 5.2, 5.3, 5.5, 5.7, 5.8, 5.9, 6.0, 6.1, 6.1, 6.2, 5.4],
    [137, 137, 136, 135, 135, 134, 134, 133, 133, 132, 132, 135],
    [4.5, 4.6, 4.8, 5.0, 5.1, 5.2, 5.4, 5.6, 5.8, 5.9, 6.0, 5.1]
  ),
  "4": generateLabData(
    DEFAULT_MONTHS.slice(-7),
    [1.2, 1.1, 1.0, 1.0, 0.9, 0.9, 1.0],
    [32, 30, 28, 27, 26, 27, 29],
    [5.5, 5.3, 5.1, 5.0, 4.8, 4.9, 5.0],
    [60, 64, 68, 72, 75, 76, 74],
    [120, 110, 95, 88, 82, 80, 86],
    [10.5, 10.2, 9.8, 9.9, 9.8, 10.0, 9.7],
    [13.2, 13.5, 13.7, 13.8, 14.0, 14.1, 14.0],
    [4.5, 4.4, 4.3, 4.2, 4.2, 4.3, 4.4],
    [139, 140, 140, 141, 141, 140, 140],
    [3.8, 3.7, 3.6, 3.6, 3.5, 3.6, 3.7]
  ),
};

const DEFAULT_SLOTS: AppointmentSlot[] = [
  {
    id: "doctor-1",
    date: addDays(TODAY, 5),
    time: "09:00",
    providerRole: "doctor",
    providerName: "Dr. Ayşe Kaya",
    specialty: "Nefroloji",
    location: "Merkez Üniversite Hastanesi",
    available: false,
    status: "approved",
    bookedByPatientId: "1",
    bookedByPatientName: "Ahmet Yılmaz",
    bookedAt: addDays(TODAY, -2),
    requestedByRole: "patient",
    approvedBy: "Koordinatör Selin Demir",
    approvedAt: addDays(TODAY, -2),
    createdByRole: "doctor",
  },
  {
    id: "doctor-2",
    date: addDays(TODAY, 7),
    time: "10:00",
    providerRole: "doctor",
    providerName: "Dr. Ayşe Kaya",
    specialty: "Nefroloji",
    location: "Merkez Üniversite Hastanesi",
    available: false,
    status: "pending",
    bookedByPatientId: "2",
    bookedByPatientName: "Fatma Demir",
    bookedAt: TODAY,
    requestedByRole: "patient",
    createdByRole: "doctor",
  },
  {
    id: "doctor-3",
    date: addDays(TODAY, 10),
    time: "14:30",
    providerRole: "doctor",
    providerName: "Dr. Ayşe Kaya",
    specialty: "Nefroloji",
    location: "Merkez Üniversite Hastanesi",
    available: true,
    status: "available",
    createdByRole: "doctor",
  },
  {
    id: "dietitian-1",
    date: addDays(TODAY, 6),
    time: "11:00",
    providerRole: "dietitian",
    providerName: "Dyt. Zeynep Arslan",
    specialty: "Beslenme",
    location: "Merkez Üniversite Hastanesi",
    available: false,
    status: "pending",
    bookedByPatientId: "1",
    bookedByPatientName: "Ahmet Yılmaz",
    bookedAt: TODAY,
    requestedByRole: "patient",
    createdByRole: "dietitian",
  },
  {
    id: "dietitian-2",
    date: addDays(TODAY, 12),
    time: "13:30",
    providerRole: "dietitian",
    providerName: "Dyt. Zeynep Arslan",
    specialty: "Beslenme",
    location: "Merkez Üniversite Hastanesi",
    available: true,
    status: "available",
    createdByRole: "dietitian",
  },
];

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const SLOT_VERSION = "v2";

const KEYS = {
  patients: "renacare_patients",
  medications: (pid: string) => `renacare_meds_${pid}`,
  dietPlan: (pid: string) => `renacare_diet_${pid}`,
  labData: (pid: string) => `renacare_labs_${pid}`,
  slots: "renacare_slots",
  slotsVersion: "renacare_slots_version",
  messages: "renacare_messages",
  messagesSeeded: "renacare_messages_seeded_v1",
};

function sortByDateAsc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

function createInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function normalizeStatusFromLabs(point?: LabDataPoint): PatientStatus {
  if (!point) return "stable";
  if ((point.creatinine ?? 0) >= 2.0 || (point.tacrolimus ?? 9) < 5 || (point.gfr ?? 100) < 40) return "critical";
  if ((point.creatinine ?? 0) >= 1.5 || (point.tacrolimus ?? 9) < 8 || (point.gfr ?? 100) < 60) return "warning";
  return "stable";
}

function formatMetric(value: number | undefined, unit: string, digits = 1): string {
  if (value === undefined) return `- ${unit}`;
  return `${value.toFixed(digits)} ${unit}`;
}

function mergeLabPoints(current: LabDataPoint[], incoming: LabDataPoint[]): LabDataPoint[] {
  const map = new Map<string, LabDataPoint>();
  [...current, ...incoming].forEach((point) => {
    const existing = map.get(point.date);
    map.set(point.date, { ...existing, ...point });
  });
  return sortByDateAsc(Array.from(map.values()));
}

function hash(seed: number): number {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getMonthlyRange(): string[] {
  return DEFAULT_MONTHS;
}

export function getPatients(): PatientRecord[] {
  return safeGet(KEYS.patients, DEFAULT_PATIENTS);
}

export function setPatients(patients: PatientRecord[]): void {
  safeSet(KEYS.patients, patients);
}

export function getPatient(patientId: string): PatientRecord | null {
  return getPatients().find((patient) => patient.id === patientId) ?? null;
}

export function createPatient(
  input: Omit<PatientRecord, "id" | "initials" | "createdAt" | "status" | "creatinine" | "tacrolimusLevel"> &
    Partial<Pick<PatientRecord, "status" | "creatinine" | "tacrolimusLevel">>,
  options?: {
    medications?: StoredMedication[];
    dietPlan?: StoredDietPlan | null;
    labs?: LabDataPoint[];
  }
): PatientRecord {
  const id = `p-${Date.now()}`;
  const patient: PatientRecord = {
    ...input,
    id,
    initials: createInitials(input.name),
    createdAt: TODAY,
    status: input.status ?? normalizeStatusFromLabs(options?.labs?.[options.labs.length - 1]),
    creatinine: input.creatinine ?? formatMetric(options?.labs?.[options.labs.length - 1]?.creatinine, "mg/dL"),
    tacrolimusLevel: input.tacrolimusLevel ?? formatMetric(options?.labs?.[options.labs.length - 1]?.tacrolimus, "ng/mL"),
  };

  const patients = [...getPatients(), patient];
  setPatients(patients);

  if (options?.medications) {
    setMedications(
      id,
      options.medications.map((med, index) => ({
        ...med,
        id: med.id || `m-${id}-${index + 1}`,
        patientId: id,
      }))
    );
  }

  if (options?.dietPlan) {
    setDietPlan(id, {
      ...options.dietPlan,
      patientId: id,
    });
  }

  if (options?.labs?.length) {
    setLabData(id, options.labs);
  }

  return patient;
}

export function updatePatient(patientId: string, partial: Partial<PatientRecord>): PatientRecord | null {
  let updatedPatient: PatientRecord | null = null;
  const patients = getPatients().map((patient) => {
    if (patient.id !== patientId) return patient;
    updatedPatient = { ...patient, ...partial };
    return updatedPatient;
  });
  setPatients(patients);
  return updatedPatient;
}

export function getMedications(patientId: string): StoredMedication[] {
  return safeGet(KEYS.medications(patientId), DEFAULT_MEDICATIONS[patientId] ?? []);
}

export function setMedications(patientId: string, meds: StoredMedication[]): void {
  safeSet(KEYS.medications(patientId), meds);
}

export function getDietPlan(patientId: string): StoredDietPlan | null {
  return safeGet(KEYS.dietPlan(patientId), DEFAULT_DIET_PLANS[patientId] ?? null);
}

export function setDietPlan(patientId: string, plan: StoredDietPlan): void {
  safeSet(KEYS.dietPlan(patientId), plan);
}

export function getLabData(patientId: string): LabDataPoint[] {
  return sortByDateAsc(safeGet(KEYS.labData(patientId), DEFAULT_LAB_DATA[patientId] ?? []));
}

export function setLabData(patientId: string, points: LabDataPoint[]): void {
  safeSet(KEYS.labData(patientId), sortByDateAsc(points));

  const latest = sortByDateAsc(points).at(-1);
  if (latest) {
    updatePatient(patientId, {
      status: normalizeStatusFromLabs(latest),
      creatinine: latest.creatinine !== undefined ? `${latest.creatinine.toFixed(1)} mg/dL` : undefined,
      tacrolimusLevel: latest.tacrolimus !== undefined ? `${latest.tacrolimus.toFixed(1)} ng/mL` : undefined,
      lastVisit: latest.date.length === 7 ? `${latest.date}-01` : latest.date,
    });
  }
}

export function appendLabData(patientId: string, points: LabDataPoint[]): LabDataPoint[] {
  const merged = mergeLabPoints(getLabData(patientId), points);
  setLabData(patientId, merged);
  return merged;
}

export function getAllPatientsLabData(): Record<string, LabDataPoint[]> {
  return getPatients().reduce<Record<string, LabDataPoint[]>>((acc, patient) => {
    acc[patient.id] = getLabData(patient.id);
    return acc;
  }, {});
}

export function getLatestLabPoint(patientId: string): LabDataPoint | null {
  const points = getLabData(patientId);
  return points.at(-1) ?? null;
}

export function getLabImportHistory(patientId: string): LabDataPoint[] {
  return getLabData(patientId)
    .filter((point) => point.sourceType || point.sourceLabel || point.sourceFileName)
    .reverse();
}

export function getSlots(): AppointmentSlot[] {
  if (typeof window !== "undefined") {
    const storedVersion = window.localStorage.getItem(KEYS.slotsVersion);
    if (storedVersion !== SLOT_VERSION) {
      window.localStorage.removeItem(KEYS.slots);
      window.localStorage.setItem(KEYS.slotsVersion, SLOT_VERSION);
    }
  }
  return safeGet(KEYS.slots, DEFAULT_SLOTS);
}

export function setSlots(slots: AppointmentSlot[]): void {
  safeSet(KEYS.slots, slots);
}

export function getProviderSlots(providerRole: ProviderRole): AppointmentSlot[] {
  return getSlots().filter((slot) => slot.providerRole === providerRole);
}

export function getPendingAppointments(): AppointmentSlot[] {
  return getSlots().filter((slot) => slot.status === "pending");
}

export function getPatientAppointments(patientId: string): AppointmentSlot[] {
  return getSlots()
    .filter((slot) => slot.bookedByPatientId === patientId)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function bookAppointment(
  slotId: string,
  patientId: string,
  patientName: string
): AppointmentSlot | null {
  let booked: AppointmentSlot | null = null;
  const updated = getSlots().map((slot) => {
    if (slot.id !== slotId || slot.status !== "available") return slot;
    booked = {
      ...slot,
      available: false,
      status: "pending",
      bookedByPatientId: patientId,
      bookedByPatientName: patientName,
      bookedAt: TODAY,
      requestedByRole: "patient",
    };
    return booked;
  });
  setSlots(updated);
  return booked;
}

export function approveAppointment(slotId: string, coordinatorName: string): AppointmentSlot | null {
  let updatedSlot: AppointmentSlot | null = null;
  const updated = getSlots().map((slot) => {
    if (slot.id !== slotId) return slot;
    updatedSlot = {
      ...slot,
      status: "approved",
      available: false,
      approvedBy: coordinatorName,
      approvedAt: TODAY,
      rejectionReason: undefined,
    };
    return updatedSlot;
  });
  setSlots(updated);
  return updatedSlot;
}

export function rejectAppointment(slotId: string, coordinatorName: string, reason: string): AppointmentSlot | null {
  let updatedSlot: AppointmentSlot | null = null;
  const updated = getSlots().map((slot) => {
    if (slot.id !== slotId) return slot;
    updatedSlot = {
      ...slot,
      status: "rejected",
      available: false,
      approvedBy: coordinatorName,
      approvedAt: TODAY,
      rejectionReason: reason,
    };
    return updatedSlot;
  });
  setSlots(updated);
  return updatedSlot;
}

export function resetAppointment(slotId: string): AppointmentSlot | null {
  let updatedSlot: AppointmentSlot | null = null;
  const updated = getSlots().map((slot) => {
    if (slot.id !== slotId) return slot;
    updatedSlot = {
      ...slot,
      available: true,
      status: "available",
      bookedByPatientId: undefined,
      bookedByPatientName: undefined,
      bookedAt: undefined,
      requestedByRole: undefined,
      approvedBy: undefined,
      approvedAt: undefined,
      rejectionReason: undefined,
    };
    return updatedSlot;
  });
  setSlots(updated);
  return updatedSlot;
}

export function addProviderSlots(newSlots: AppointmentSlot[]): AppointmentSlot[] {
  const existing = getSlots();
  const updated = [...existing, ...newSlots];
  setSlots(updated);
  return updated;
}

export function getLiveCohortAverage(months?: string[]): LabDataPoint[] {
  const allData = getAllPatientsLabData();
  const allMonths = months ?? Array.from(new Set(Object.values(allData).flat().map((point) => point.date))).sort();

  return allMonths.map((date) => {
    const result: LabDataPoint = { date };

    LAB_METRIC_DEFINITIONS.forEach((metric) => {
      const values = Object.values(allData)
        .map((points) => points.find((point) => point.date === date)?.[metric.key])
        .filter((value): value is number => typeof value === "number");

      if (values.length > 0) {
        result[metric.key] = parseFloat((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
      }
    });

    return result;
  });
}

export function getRetrospectiveCohortSummary(patientCount = 1000): RetrospectiveCohortSummary {
  const months = getMonthlyRange();
  const monthlyAverages = months.map((date, index) => {
    const momentum = index / Math.max(1, months.length - 1);
    return {
      date,
      creatinine: parseFloat((1.28 - momentum * 0.08 + hash(index + 2) * 0.03).toFixed(2)),
      urea: parseFloat((36 - momentum * 2 + hash(index + 4) * 1.5).toFixed(1)),
      uricAcid: parseFloat((5.9 - momentum * 0.2 + hash(index + 6) * 0.15).toFixed(2)),
      gfr: parseFloat((61 + momentum * 4 + hash(index + 8) * 1.5).toFixed(1)),
      urineProtein: parseFloat((145 - momentum * 18 + hash(index + 10) * 5).toFixed(1)),
      tacrolimus: parseFloat((8.9 + hash(index + 12) * 0.8).toFixed(2)),
      hemoglobin: parseFloat((12.7 + momentum * 0.4 + hash(index + 14) * 0.2).toFixed(2)),
      potassium: parseFloat((4.6 + hash(index + 16) * 0.2).toFixed(2)),
      sodium: parseFloat((138.4 + hash(index + 18) * 0.8).toFixed(1)),
      phosphorus: parseFloat((4.1 - momentum * 0.15 + hash(index + 20) * 0.1).toFixed(2)),
      albumin: parseFloat((4.1 + momentum * 0.08 + hash(index + 22) * 0.05).toFixed(2)),
      crp: parseFloat((3.1 - momentum * 0.5 + hash(index + 24) * 0.2).toFixed(2)),
    } as LabDataPoint;
  });

  const metricSummaries = LAB_METRIC_DEFINITIONS.map((metric) => {
    const first = monthlyAverages[0]?.[metric.key] ?? 0;
    const latest = monthlyAverages.at(-1)?.[metric.key] ?? 0;
    return {
      key: metric.key,
      label: metric.label,
      unit: metric.unit,
      latestMean: latest,
      change12m: parseFloat((latest - first).toFixed(2)),
      normalMin: metric.normalMin,
      normalMax: metric.normalMax,
    };
  });

  return {
    patientCount,
    monthlyAverages,
    metricSummaries,
  };
}

export function getCohortSnapshotCards() {
  const liveAverage = getLiveCohortAverage();
  const latest = liveAverage.at(-1);
  return [
    {
      label: "Ortalama Kreatinin",
      value: latest?.creatinine !== undefined ? `${latest.creatinine.toFixed(2)} mg/dL` : "-",
    },
    {
      label: "Ortalama GFR",
      value: latest?.gfr !== undefined ? `${latest.gfr.toFixed(1)} mL/min` : "-",
    },
    {
      label: "Ortalama Tacrolimus",
      value: latest?.tacrolimus !== undefined ? `${latest.tacrolimus.toFixed(1)} ng/mL` : "-",
    },
  ];
}

// ========================================================
// MESSAGING SYSTEM
// ========================================================

export interface StoredMessage {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  senderRole: "patient" | "doctor";
  senderName: string;
  subject: string;
  content: string;
  urgency: "low" | "medium" | "high";
  sentAt: string;
  readByDoctor: boolean;
  replyContent?: string;
  repliedAt?: string;
  repliedBy?: string;
}

const DEFAULT_MESSAGES: StoredMessage[] = [
  {
    id: "msg_demo_1",
    patientId: "1",
    patientName: "Ahmet Yılmaz",
    patientInitials: "AY",
    senderRole: "patient",
    senderName: "Ahmet Yılmaz",
    subject: "Tacrolimus seviyesi hakkında",
    content: "Sayın Dr. Kaya, son kan tahlilimde tacrolimus seviyem 12.5 ng/mL çıktı. Bu değer normal aralıkta mı? Endişelenmeli miyim? Biraz yorgunluk hissediyorum ayrıca.",
    urgency: "medium",
    sentAt: "2026-06-01T10:30:00.000Z",
    readByDoctor: true,
    replyContent: "Ahmet Bey, tacrolimus seviyeniz biraz yüksek (hedef 8-12 ng/mL). Şu anki dozunuzu 1.5mg'a düşürelim. 1 hafta sonra tekrar kan tahlili yaptırın. Yorgunluk bu değerle ilgili olabilir. İyi dileklerimle.",
    repliedAt: "2026-06-01T14:20:00.000Z",
    repliedBy: "Dr. Ayşe Kaya",
  },
  {
    id: "msg_demo_2",
    patientId: "1",
    patientName: "Ahmet Yılmaz",
    patientInitials: "AY",
    senderRole: "patient",
    senderName: "Ahmet Yılmaz",
    subject: "Ayak bileğinde şişlik",
    content: "Son birkaç gündür sağ ayak bileğimde hafif şişlik fark ettim. Ağrı yok ama endişeliyim. Acil bir durum olabilir mi?",
    urgency: "high",
    sentAt: "2026-06-05T08:15:00.000Z",
    readByDoctor: true,
    replyContent: "Ahmet Bey, ödem böbrek nakli hastalarında görülebilir. Ancak muayene etmem gerekiyor. Lütfen kliniğimizle yarın randevu alın. Tuz alımınızı azaltın ve ayaklarınızı yüksekte tutun. Dr. Kaya",
    repliedAt: "2026-06-05T09:45:00.000Z",
    repliedBy: "Dr. Ayşe Kaya",
  },
  {
    id: "msg_demo_3",
    patientId: "1",
    patientName: "Ahmet Yılmaz",
    patientInitials: "AY",
    senderRole: "patient",
    senderName: "Ahmet Yılmaz",
    subject: "İlaç yan etkisi - Baş ağrısı",
    content: "Mycophenolate almaya başladıktan sonra düzenli baş ağrıları yaşıyorum. Bu normal bir yan etki mi? Nasıl geçirebilirim?",
    urgency: "medium",
    sentAt: "2026-06-10T17:00:00.000Z",
    readByDoctor: false,
  },
  {
    id: "msg_demo_4",
    patientId: "2",
    patientName: "Fatma Demir",
    patientInitials: "FD",
    senderRole: "patient",
    senderName: "Fatma Demir",
    subject: "Potasyum kısıtlaması hakkında",
    content: "Sayın Dr. Kaya, potasyum kısıtlaması nedeniyle hangi meyveleri yiyebileceğimi tam olarak anlayamadım. Elma ve armut uygun mu?",
    urgency: "low",
    sentAt: "2026-06-08T11:00:00.000Z",
    readByDoctor: false,
  },
  {
    id: "msg_demo_5",
    patientId: "3",
    patientName: "Mehmet Çelik",
    patientInitials: "MÇ",
    senderRole: "patient",
    senderName: "Mehmet Çelik",
    subject: "Ayak bileğinde şişlik - Acil",
    content: "Dr. Kaya, son 2 gündür sağ ayak bileğimde ciddi şişlik var. Nefes almakta da biraz zorluk çekiyorum. Acil bir durum mu bu?",
    urgency: "high",
    sentAt: "2026-06-11T07:30:00.000Z",
    readByDoctor: false,
  },
];

function getAllMessages(): StoredMessage[] {
  if (typeof window === "undefined") return DEFAULT_MESSAGES;
  if (!localStorage.getItem(KEYS.messagesSeeded)) {
    localStorage.setItem(KEYS.messages, JSON.stringify(DEFAULT_MESSAGES));
    localStorage.setItem(KEYS.messagesSeeded, "1");
  }
  try {
    return JSON.parse(localStorage.getItem(KEYS.messages) ?? "[]") as StoredMessage[];
  } catch {
    return DEFAULT_MESSAGES;
  }
}

function saveAllMessages(msgs: StoredMessage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.messages, JSON.stringify(msgs));
}

export function getPatientMessages(patientId: string): StoredMessage[] {
  return getAllMessages()
    .filter((m) => m.patientId === patientId)
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export function getDoctorMessages(): StoredMessage[] {
  return getAllMessages().sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

export function sendPatientMessage(
  msg: Omit<StoredMessage, "id" | "sentAt" | "readByDoctor">
): StoredMessage {
  const all = getAllMessages();
  const newMsg: StoredMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    sentAt: new Date().toISOString(),
    readByDoctor: false,
  };
  saveAllMessages([...all, newMsg]);
  return newMsg;
}

export function replyToMessage(
  messageId: string,
  replyContent: string,
  repliedBy: string
): void {
  const all = getAllMessages();
  saveAllMessages(
    all.map((m) =>
      m.id === messageId
        ? { ...m, replyContent, repliedAt: new Date().toISOString(), repliedBy, readByDoctor: true }
        : m
    )
  );
}

export function markDoctorRead(messageIds: string[]): void {
  const all = getAllMessages();
  saveAllMessages(
    all.map((m) =>
      messageIds.includes(m.id) ? { ...m, readByDoctor: true } : m
    )
  );
}
