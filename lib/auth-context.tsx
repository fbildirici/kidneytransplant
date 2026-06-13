"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

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
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (snap.exists()) {
            setProfile({ uid: firebaseUser.uid, ...(snap.data() as Omit<UserProfile, "uid">) });
          }
          // Set session cookie for middleware
          document.cookie = `renacare-auth=${firebaseUser.uid}; path=/; SameSite=Lax; max-age=86400`;
        } catch (err) {
          console.error("Kullanıcı profili alınamadı:", err);
        }
      } else {
        setProfile(null);
        document.cookie = "renacare-auth=; path=/; max-age=0";
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    document.cookie = "renacare-auth=; path=/; max-age=0";
    window.location.href = "/login";
  };

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
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  patient: "Hasta",
  doctor: "Doktor",
  dietitian: "Diyetisyen",
  coordinator: "Koordinatör",
};
