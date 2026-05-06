import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <div className="shrink-0 border-r border-border">
        <Sidebar></Sidebar>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
}
