"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface TimeSlot {
  start: string;
  end: string;
}

interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  hospitalName: string;
  qualification: string;
  consultationFee: number;
  availableDays: string[];
  availableTimeSlots: TimeSlot[];
  profileImage?: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = searchParams.get("doctorId");
  const patientId = searchParams.get("patientId");

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [fetchingDoctor, setFetchingDoctor] = useState<boolean>(true);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        setFetchingDoctor(true);
        const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch doctor");
        setDoctor(data);
      } catch (err: any) {
        setMessage(`❌ ${err.message}`);
      } finally {
        setFetchingDoctor(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Handle booking appointment
  const handleBookAppointment = async () => {
    if (!appointmentDate || !selectedSlot) {
      setMessage("⚠️ Please select both a date and time slot.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          patientId,
          appointmentDate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to book appointment");

      setMessage("✅ Appointment booked successfully!");
      setTimeout(() => router.push(`/doctors/${doctorId}`), 2000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDoctor) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading doctor details...</p>
    );
  }

  if (!doctor) {
    return (
      <p className="text-center mt-10 text-red-500">
        Doctor not found or invalid doctor ID.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10">
      <Card className="max-w-lg w-full border-emerald-900/20 shadow-md">
        <CardContent className="py-8 px-6">
          <div className="flex flex-col items-center">
            {/* Doctor Profile */}
            <div className="w-24 h-24 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-emerald-500" />
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center">
              {doctor.doctorName}
            </h2>
            <p className="text-sm text-gray-600 text-center">
              {doctor.specialization} | {doctor.qualification}
            </p>
            <p className="text-sm text-gray-500 text-center">
              Hospital: {doctor.hospitalName}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Fee: ${doctor.consultationFee}
            </p>

            {/* Appointment Form */}
            <div className="w-full mt-2">
              <h4 className="font-medium text-gray-800 mb-2">Select Date</h4>
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAppointmentDate(e.target.value)
                }
                className="mb-4"
              />

              <h4 className="font-medium text-gray-800 mb-2">Select Time Slot</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {doctor.availableTimeSlots.length > 0 ? (
                  doctor.availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={selectedSlot?.start === slot.start ? "default" : "outline"}
                      className={`${
                        selectedSlot?.start === slot.start
                          ? "bg-emerald-600 text-white"
                          : "border-emerald-400 text-emerald-600"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start} - {slot.end}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No time slots available</p>
                )}
              </div>

              {/* Available Days */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Available Days</h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableDays.map((day, index) => (
                    <Badge key={index} className="bg-emerald-100 text-emerald-700" variant="default">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleBookAppointment}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {loading ? "Booking..." : "Confirm Appointment"}
              </Button>

              {/* Message */}
              {message && (
                <p
                  className={`mt-4 text-center text-sm ${
                    message.startsWith("✅")
                      ? "text-green-600"
                      : message.startsWith("❌")
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Back Button */}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
