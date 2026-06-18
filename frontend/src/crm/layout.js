import CrmSidebar from "@/components/crm/CrmSidebar";

export default function CrmLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <CrmSidebar />

      <div className="ml-[280px]">
        {children}
      </div>
    </div>
  );
}