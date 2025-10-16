"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { HomeIcon, CalendarIcon, FileTextIcon, UserIcon, StethoscopeIcon } from 'lucide-react';
import { OperationalReportGenerator } from '@/components/OperationalReportGenerator';
export default function OperationalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('operational');
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'medical') {
      router.push('/medical');
    }
  };
  const sidebarItems = [{
    icon: <HomeIcon size={18} />,
    label: "Dashboard",
    active: activeTab === 'dashboard',
    onClick: () => handleTabChange('dashboard')
  }, {
    icon: <CalendarIcon size={18} />,
    label: "Appointments",
    active: false,
    onClick: () => {}
  }, {
    icon: <FileTextIcon size={18} />,
    label: "Records",
    active: false,
    onClick: () => {}
  }, {
    icon: <UserIcon size={18} />,
    label: "Profile",
    active: false,
    onClick: () => {}
  }, {
    icon: <StethoscopeIcon size={18} />,
    label: "Medical Reports",
    active: activeTab === 'medical',
    onClick: () => handleTabChange('medical')
  }, {
    icon: <FileTextIcon size={18} />,
    label: "Operational Reports",
    active: activeTab === 'operational',
    onClick: () => handleTabChange('operational')
  }];
  return <DashboardLayout sidebarItems={sidebarItems} title="Operational Reports" userName="Dr. John Smith" userRole="Cardiologist">
      <OperationalReportGenerator />
    </DashboardLayout>;
}