"use client";

import { ToastProvider } from "@/lib/toast-context";
import { AuthProvider } from "@/lib/auth-context";
import ToastContainer from "./ToastContainer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}
