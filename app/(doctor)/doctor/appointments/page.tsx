import ProviderAppointmentsManager from "@/components/appointments/ProviderAppointmentsManager";

export default function DoctorAppointmentsPage() {
  return (
    <ProviderAppointmentsManager
      providerRole="doctor"
      providerName="Dr. Ayşe Kaya"
      specialty="Nefroloji"
      accent={{
        banner: "from-teal-600 via-teal-500 to-emerald-600",
        soft: "bg-teal-50",
        text: "text-teal-700",
        border: "border-teal-200",
        strong: "bg-teal-500 hover:bg-teal-600",
      }}
    />
  );
}
