export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  transplantDate?: string;
  doctorName?: string;
  doctorEmail?: string;
  bloodType?: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes?: string;
  color: string;
  active: boolean;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  userId: string;
  takenAt: string;
  scheduledTime: string;
  taken: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  forwardedToDoctor?: boolean;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  title?: string;
}

export interface DoctorMessage {
  id: string;
  userId: string;
  subject: string;
  content: string;
  urgency: "low" | "medium" | "high";
  status: "sent" | "read" | "replied";
  fromAI?: boolean;
  aiMessageId?: string;
  reply?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  doctor: string;
  location?: string;
  notes?: string;
}

export interface NutritionCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: NutritionItem[];
}

export interface NutritionItem {
  name: string;
  status: "recommended" | "limited" | "avoid";
  note?: string;
}

export interface WaterLog {
  date: string;
  glasses: number;
  goal: number;
}
