import { Users } from "lucide-react"; // Using Users icon for staff
import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Staff Dashboard - SmartHealthcareSystem",
  description: "Manage appointments and patient records",
};

export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<Users />} title="Staff Dashboard" />

      {children}
    </div>
  );
}
