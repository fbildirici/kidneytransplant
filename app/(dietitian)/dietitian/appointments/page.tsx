import ProviderAppointmentsManager from "@/components/appointments/ProviderAppointmentsManager";
import PageTitle from "@/components/PageTitle";

export default function DietitianAppointmentsPage() {
  return (
    <>
      <PageTitle title="Randevularım" />
      <ProviderAppointmentsManager
      providerRole="dietitian"
      providerName="Dyt. Zeynep Arslan"
      specialty="Klinik Beslenme"
      accent={{
        banner: "from-emerald-600 via-emerald-500 to-green-600",
        soft: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        strong: "bg-emerald-500 hover:bg-emerald-600",
      }}
    />
    </>
  );
}
