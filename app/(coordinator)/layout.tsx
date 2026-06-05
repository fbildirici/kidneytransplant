import CoordinatorSidebar from "@/components/layout/CoordinatorSidebar";
import Header from "@/components/layout/Header";

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <CoordinatorSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
