// Basit localStorage tabanlı kimlik doğrulama — Firebase olmadan çalışır.
// Gerçek kullanıcı verisi localStorage'da şifresiz tutulur (prototip).

import type { UserRole } from "./auth-context";

export interface StoredUser {
  uid: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: UserRole;
  transplantDate?: string;
  bloodGroup?: string;
  doctorName?: string;
  doctorEmail?: string;
  specialty?: string;
  createdAt: string;
}

const USERS_KEY   = "renacare_users";
const SESSION_KEY = "renacare_session";

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function authSignIn(email: string, password: string): StoredUser {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("auth/invalid-credential");
  return user;
}

export function authCreateUser(
  data: Omit<StoredUser, "uid" | "createdAt">
): StoredUser {
  const users = getUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (exists) throw new Error("auth/email-already-in-use");

  const user: StoredUser = {
    ...data,
    uid: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export function getSession(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: StoredUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  document.cookie = `renacare-auth=${user.uid}; path=/; SameSite=Lax; max-age=86400`;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = "renacare-auth=; path=/; max-age=0";
}
