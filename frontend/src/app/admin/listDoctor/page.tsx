"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Stethoscope, Calendar, Clock, Hospital } from "lucide-react";

interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  consultationFee: number;
  contactNumber: string;
  availableDays: string[];
  availableTimeSlots: { start: string; end: string }[];
  bio: string;
  hospitalName: string;
  profileImage: string;
}

const ViewDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Doctors</h1>
      {loading && <p>Loading doctors...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-4">
        {doctors.map((doc) => (
          <Card key={doc._id} className="border p-4 flex flex-col md:flex-row gap-4">
            {doc.profileImage && (
              <img src={doc.profileImage} alt={doc.doctorName} className="w-24 h-24 rounded-full object-cover" />
            )}
            <CardContent className="flex-1 flex flex-col gap-2">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                {doc.doctorName}
              </h2>
              <p className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-gray-500" />
                {doc.specialization} | {doc.experienceYears} yrs
              </p>
              <p className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-gray-500" />
                {doc.hospitalName}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Available Days: {doc.availableDays.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Time Slots:{" "}
                {doc.availableTimeSlots.map((slot) => `${slot.start} - ${slot.end}`).join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
        {doctors.length === 0 && !loading && <p>No doctors found.</p>}
      </div>
    </div>
  );
};

export default ViewDoctorsPage;
