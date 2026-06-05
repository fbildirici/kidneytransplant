export function cn(...classes: (string | boolean | undefined | null | number)[]): string {
  return classes.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(time: string): string {
  return time;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "İyi geceler";
  if (hour < 12) return "Günaydın";
  if (hour < 18) return "İyi günler";
  return "İyi akşamlar";
}

export function getMedicationColor(index: number): string {
  const colors = [
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
    "bg-sky-100 text-sky-700 border-sky-200",
    "bg-violet-100 text-violet-700 border-violet-200",
    "bg-rose-100 text-rose-700 border-rose-200",
  ];
  return colors[index % colors.length];
}

export function getUrgencyColor(urgency: "low" | "medium" | "high"): string {
  switch (urgency) {
    case "low":
      return "bg-emerald-100 text-emerald-700";
    case "medium":
      return "bg-amber-100 text-amber-700";
    case "high":
      return "bg-red-100 text-red-700";
  }
}

export function getStatusColor(status: "sent" | "read" | "replied"): string {
  switch (status) {
    case "sent":
      return "bg-sky-100 text-sky-700";
    case "read":
      return "bg-amber-100 text-amber-700";
    case "replied":
      return "bg-emerald-100 text-emerald-700";
  }
}

export function getStatusText(status: "sent" | "read" | "replied"): string {
  switch (status) {
    case "sent":
      return "Gönderildi";
    case "read":
      return "Okundu";
    case "replied":
      return "Yanıtlandı";
  }
}
