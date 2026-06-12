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
    "bg-medical-50 text-medical-700 border-medical-200",
    "bg-success-50 text-success-700 border-success-200",
    "bg-navy-50 text-navy-700 border-navy-200",
    "bg-navy-50 text-navy-700 border-navy-200",
    "bg-medical-50 text-medical-700 border-medical-200",
    "bg-danger-50 text-danger-700 border-danger-200",
  ];
  return colors[index % colors.length];
}

export function getUrgencyColor(urgency: "low" | "medium" | "high"): string {
  switch (urgency) {
    case "low":
      return "bg-success-50 text-success-700";
    case "medium":
      return "bg-warning-50 text-warning-700";
    case "high":
      return "bg-danger-50 text-danger-700";
  }
}

export function getStatusColor(status: "sent" | "read" | "replied"): string {
  switch (status) {
    case "sent":
      return "bg-navy-50 text-navy-700";
    case "read":
      return "bg-warning-50 text-warning-700";
    case "replied":
      return "bg-success-50 text-success-700";
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
