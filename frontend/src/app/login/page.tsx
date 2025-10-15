"use client";

import { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/authcontext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      console.log("Login response data:", data);
       const userRole = data?.user?.role;
     
         if (userRole === "doctor") {
      router.push("/doctor/dashboard");
    } else if (userRole === "staff") {
      router.push("/staff");
    } else if (userRole === "manager" || userRole === "admin") {
      router.push("/admin");
    } else if (userRole === "patient") {
      router.push("/");
    } else {
      router.push("/"); 
    }
     alert("Login successful!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
