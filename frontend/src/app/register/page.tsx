"use client";

import { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Step 1: Register the main user account
    const { data: userData } = await API.post("/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

   

    login(userData);
    alert("Registered successfully!");
    router.push("/");

  } catch (err: any) {
    console.error("Registration error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Patient Registration
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* USER FIELDS */}
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* ROLE SELECTION */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>

          {/* PATIENT-SPECIFIC FIELDS */}
          {form.role === "patient" && (
            <>
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                name="contactNumber"
                type="text"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />

              <input
                name="address"
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
