"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HomeIcon,
  CalendarIcon,
  FileTextIcon,
  UserIcon,
  StethoscopeIcon,
} from "lucide-react";
import { HealthcareReportGenerator } from "@/components/HealthcareReportGenerator";

export default function MedicalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("medical");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Navigate to corresponding page if needed
    switch (tab) {
      case "dashboard":
        router.push("/");
        break;
      case "operational":
        router.push("/operational");
        break;
      case "medical":
        router.push("/medical");
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    {
      icon: <HomeIcon size={18} />,
      label: "Dashboard",
      active: activeTab === "dashboard",
      onClick: () => handleTabChange("dashboard"),
    },
    {
      icon: <CalendarIcon size={18} />,
      label: "Appointments",
      active: activeTab === "appointments",
      onClick: () => handleTabChange("appointments"),
    },
    {
      icon: <FileTextIcon size={18} />,
      label: "Records",
      active: activeTab === "records",
      onClick: () => handleTabChange("records"),
    },
    {
      icon: <UserIcon size={18} />,
      label: "Profile",
      active: activeTab === "profile",
      onClick: () => handleTabChange("profile"),
    },
    {
      icon: <StethoscopeIcon size={18} />,
      label: "Medical Reports",
      active: activeTab === "medical",
      onClick: () => handleTabChange("medical"),
    },
    {
      icon: <FileTextIcon size={18} />,
      label: "Operational Reports",
      active: activeTab === "operational",
      onClick: () => handleTabChange("operational"),
    },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      title="Medical Reports"
      userName="Dr. John Smith"
      userRole="Cardiologist"
    >
      {/* Main Content */}
      <div className="w-full bg-white p-6 rounded-lg shadow-sm">
        <HealthcareReportGenerator />
      </div>
    </DashboardLayout>
  );
}
