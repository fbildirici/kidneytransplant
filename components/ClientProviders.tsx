"use client";

import { ToastProvider } from "@/lib/toast-context";
import ToastContainer from "./ToastContainer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}
