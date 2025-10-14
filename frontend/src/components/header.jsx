"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Calendar,
  CreditCard,
  ShieldCheck,
  Stethoscope,
  User,
} from "lucide-react";

export default function Header() {
  // Temporary static roles for demo
  const isAdmin = false;
  const isDoctor = false;
  const isPatient = false;

  return (
    <header className="fixed top-0 left-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/admin/listDoctor" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo-single.png"
            alt="Medicare Logo"
            width={160}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Admin Links */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <ShieldCheck className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Doctor Links */}
          {isDoctor && (
            <Link href="/doctor">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Stethoscope className="h-4 w-4" />
                Doctor Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Stethoscope className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Patient Links */}
          {isPatient && (
            <Link href="/appointments">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                My Appointments
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Sample Badge */}
          {!isPatient && (
            <Link href="/">
              <Badge
                variant="outline"
                className="h-9 bg-emerald-900/20 border-emerald-700/30 px-3 py-1 flex items-center gap-2"
              >
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Sign In</span>
              </Badge>
            </Link>
          )}

          {/* User Section (temporary) */}
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">John Doe</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
