import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Doctors - MediMeet",
  description: "Browse and book appointments with top healthcare providers",
};

interface DoctorsLayoutProps {
  children: ReactNode;
}

export default function DoctorsLayout({ children }: DoctorsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );
}
