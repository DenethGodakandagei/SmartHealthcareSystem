"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../services/api";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterStaff() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    department: "",
    role: "staff",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", form);
      alert("Staff registered successfully!");
      router.push("/");
    } catch (err: any) {
      console.error("Error registering staff:", err);
      setError(err.response?.data?.message || "Failed to register staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-20">
      <div className="w-full max-w-md p-8 bg-white">
        {/* HEADER */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Register Staff</h1>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Contact Number */}
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={form.contactNumber}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="department"
              placeholder="Department (e.g., Reception, Lab)"
              value={form.department}
              onChange={handleChange}
              required
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-green-700 hover:bg-green-800 rounded-lg font-semibold shadow-md transition-colors duration-300 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Registering..." : "Register Staff"}
          </Button>
        </form>
      </div>
    </div>
  );
}
