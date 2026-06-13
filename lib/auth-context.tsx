"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, clearSession, seedDemoUsers, type StoredUser } from "./simple-auth";

export type UserRole = "patient" | "doctor" | "dietitian" | "coordinator";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  transplantDate?: string;
  bloodGroup?: string;
  doctorName?: string;
  specialty?: string;
}

interface AuthContextType {
  user: StoredUser | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: () => {},
});

function toProfile(u: StoredUser): UserProfile {
  return {
    uid:           u.uid,
    email:         u.email,
    displayName:   u.displayName,
    firstName:     u.firstName,
    lastName:      u.lastName,
    role:          u.role,
    transplantDate: u.transplantDate,
    bloodGroup:    u.bloodGroup,
    doctorName:    u.doctorName,
    specialty:     u.specialty,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDemoUsers();
    const session = getSession();
    setUser(session);
    setLoading(false);
  }, []);

  const signOut = () => {
    clearSession();
    setUser(null);
    window.location.href = "/login";
  };

  const profile = user ? toProfile(user) : null;

  return (
    <AuthContext.Provider value={{ user, profile, role: profile?.role ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  patient:     "Hasta",
  doctor:      "Doktor",
  dietitian:   "Diyetisyen",
  coordinator: "Koordinatör",
};
