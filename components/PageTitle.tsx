"use client";

import { useEffect } from "react";

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | RenaCare`;
    return () => {
      document.title = prev;
    };
  }, [title]);

  return null;
}
