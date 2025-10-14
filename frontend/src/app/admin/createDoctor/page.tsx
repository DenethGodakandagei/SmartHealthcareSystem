"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Calendar, Clock, Briefcase, DollarSign, Phone, FileText, Hospital, Image } from "lucide-react";

interface DoctorForm {
  doctorName: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  consultationFee: number;
  contactNumber: string;
  availableDays: string[];
  availableTimeSlotsStart: string[];
  availableTimeSlotsEnd: string[];
  bio: string;
  hospitalName: string;
  profileImage: string;
}

const initialForm: DoctorForm = {
  doctorName: "",
  specialization: "",
  experienceYears: 0,
  qualification: "",
  consultationFee: 0,
  contactNumber: "",
  availableDays: [],
  availableTimeSlotsStart: [],
  availableTimeSlotsEnd: [],
  bio: "",
  hospitalName: "",
  profileImage: "",
};

const CreateDoctorPage = () => {
  const [form, setForm] = useState<DoctorForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert time slots into objects as required by schema
      const availableTimeSlots = form.availableTimeSlotsStart.map((start, index) => ({
        start,
        end: form.availableTimeSlotsEnd[index] || start,
      }));

      const payload = {
        doctorName: form.doctorName,
        specialization: form.specialization,
        experienceYears: form.experienceYears,
        qualification: form.qualification,
        consultationFee: form.consultationFee,
        contactNumber: form.contactNumber,
        availableDays: form.availableDays,
        availableTimeSlots,
        bio: form.bio,
        hospitalName: form.hospitalName,
        profileImage: form.profileImage,
      };

      const res = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create doctor");

      alert("Doctor created successfully!");
      setForm(initialForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Doctor</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          <input type="text" name="doctorName" placeholder="Name" value={form.doctorName} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-gray-500" />
          <input type="text" name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input type="number" name="experienceYears" placeholder="Experience Years" value={form.experienceYears} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <input type="text" name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <input type="number" name="consultationFee" placeholder="Consultation Fee" value={form.consultationFee} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <input type="text" name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} required className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Available Days (comma separated)" value={form.availableDays.join(",")} onChange={(e) => setForm(prev => ({ ...prev, availableDays: e.target.value.split(",") }))} className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Time Slot Starts (comma separated e.g., 08:30,09:30)" value={form.availableTimeSlotsStart.join(",")} onChange={(e) => setForm(prev => ({ ...prev, availableTimeSlotsStart: e.target.value.split(",") }))} className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Time Slot Ends (comma separated e.g., 09:30,10:30)" value={form.availableTimeSlotsEnd.join(",")} onChange={(e) => setForm(prev => ({ ...prev, availableTimeSlotsEnd: e.target.value.split(",") }))} className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <input type="text" name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Hospital className="w-5 h-5 text-gray-500" />
          <input type="text" name="hospitalName" placeholder="Hospital Name" value={form.hospitalName} onChange={handleChange} className="flex-1 p-2 border rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-gray-500" />
          <input type="text" name="profileImage" placeholder="Profile Image URL" value={form.profileImage} onChange={handleChange} className="flex-1 p-2 border rounded" />
        </div>

        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Doctor"}</Button>
      </form>
    </div>
  );
};

export default CreateDoctorPage;
