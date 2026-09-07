import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AppLayout({
  children,
  breadcrumb,
  title,
  activeRoute,
}: {
  children: React.ReactNode;
  breadcrumb: string;
  title: string;
  activeRoute?: string;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar activeRoute={activeRoute} />
      <main className="ml-[248px] flex flex-1 flex-col">
        <PageHeader breadcrumb={breadcrumb} title={title} />
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
