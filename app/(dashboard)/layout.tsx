import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DemoBanner from "@/components/ui/DemoBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <DemoBanner />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
