"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";
import { DoctorCard } from "./components/doctor-card";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  email?: string;
  phone?: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all doctors on initial render
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch doctors");
      setDoctors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter doctors when a specialty is selected
  const handleSpecialtyClick = (specialty: string | null) => {
    setSelectedSpecialty(specialty);
    if (!specialty) {
      setFilteredDoctors(doctors); // Show all doctors
    } else {
      setFilteredDoctors(doctors.filter((doc) => doc.specialization === specialty));
    }
  };

  return (
    <div className="min-h-screen bg-50 py-10 px-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
        <p className="text-gray-600 text-lg max-w-xl">
          Browse by specialty or click a specialty card to filter doctors.
        </p>
      </div>

      {/* Specialties Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <Card
          className={`cursor-pointer border ${
            selectedSpecialty === null ? "border-emerald-400 shadow-md" : "border-gray-200"
          } hover:border-emerald-400/60 transition-all bg-white`}
          onClick={() => handleSpecialtyClick(null)}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <div className="text-emerald-600">🩺</div>
            </div>
            <h3 className="font-medium text-gray-900">All</h3>
          </CardContent>
        </Card>

        {SPECIALTIES.map((specialty) => (
          <Card
            key={specialty.name}
            className={`cursor-pointer border ${
              selectedSpecialty === specialty.name
                ? "border-emerald-400 shadow-md"
                : "border-gray-200"
            } hover:border-emerald-400/60 transition-all bg-white`}
            onClick={() => handleSpecialtyClick(specialty.name)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <div className="text-emerald-600">{specialty.icon}</div>
              </div>
              <h3 className="font-medium text-gray-900">{specialty.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Doctors List */}
      <div>
        {loading && <p className="text-center text-gray-700">Loading doctors...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && filteredDoctors.length === 0 && (
          <p className="text-center text-gray-700">No doctors available.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}
