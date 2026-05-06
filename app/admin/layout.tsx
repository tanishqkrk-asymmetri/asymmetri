import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex">
      <div className="border-r border-gray-200">
        <Sidebar></Sidebar>
      </div>
      {children}
    </main>
  );
}
