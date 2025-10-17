"use client";

import React, { useContext, } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button"; 
import { Badge } from "./ui/badge"; 
import { AuthContext } from "../context/authcontext"; 
import { Calendar, ShieldCheck, Stethoscope, User } from "lucide-react";

export default function Header() {

  const { user, token, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo-single.png"
            alt="Medimeet Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Right Section */}
       <div className="flex items-center space-x-4">
          {user && token ? (
            <>
              {/* Admin Links */}
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Admin Dashboard
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <ShieldCheck className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Doctor Links */}
              {user?.role === "doctor" && (
                <Link href="/doctor">
                  <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Doctor Dashboard
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <Stethoscope className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Patient Links */}
              {user?.role === "patient" && (
                <Link href="/appointments">
                  <Button variant="outline" className="hidden md:inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    My Appointments
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {/* Logout Button */}
              {["admin", "doctor", "patient", "staff"].includes(user?.role) && (
                <Link onClick={logout} href={"/"}>
                  <Badge
                    variant="outline"
                    className="h-9 bg-[#E50914] border-[#B1060F] px-3 py-1 flex items-center gap-2 hover:bg-[#F6121D] transition-colors rounded-md text-white font-bold"
                  >
                    Logout
                  </Badge>
                </Link>
              )}

              {/* User Info */}
              <div className="flex items-center gap-2 border-l pl-4">
                <User className="w-5 h-5 text-gray-600" />
                <div className="flex flex-col justify-center text-right">
                  <span className="text-sm text-gray-700 font-medium leading-none">
                    {user?.name || "Guest"}
                  </span>
                  <span className="text-xs text-emerald-500 leading-none p-1 font-semibold">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sign Up Button */}
              <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-100" 
                >
                  <Link href="/register">Register as Patient</Link>
                </Button>
              

              {/* Guest Info */}
              <div className="flex items-center gap-2 border-l pl-4">
                <User className="w-5 h-5 text-gray-600" />
                <div className="flex flex-col justify-center text-right">
                  <span className="text-sm text-gray-700 font-medium leading-none">
                    Guest
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}