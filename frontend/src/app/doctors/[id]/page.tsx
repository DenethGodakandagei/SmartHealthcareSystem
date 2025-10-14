"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, Star } from "lucide-react";

interface TimeSlot {
  start: string;
  end: string;
}

interface Rating {
  patientId: string;
  rating: number;
  comment: string;
}

interface Doctor {
  _id: string;
  doctorName: string;
  specialization: string;
  experienceYears: number;
  qualification: string;
  consultationFee: number;
  contactNumber: string;
  availableDays: string[];
  availableTimeSlots: TimeSlot[];
  bio?: string;
  hospitalName: string;
  profileImage?: string;
  ratings: Rating[];
  isAvailable: boolean;
}

export default function DoctorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://localhost:5000/api/doctors/${id}`); // Your backend controller route
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch doctor");

        setDoctor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading doctor...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!doctor) return <p className="text-center mt-10">Doctor not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <Card className="max-w-3xl w-full border-emerald-900/20 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {/* Profile Image */}
            <div className="w-28 h-28 rounded-full bg-emerald-900/20 flex items-center justify-center">
              {doctor.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  className="w-28 h-28 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-emerald-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-black">{doctor.doctorName}</h2>
            <Badge
              variant="outline"
              className={`${
                doctor.isAvailable
                  ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                  : "bg-red-200 border-red-400 text-red-700"
              }`}
            >
              {doctor.isAvailable ? "Available" : "Not Available"}
            </Badge>

            <p className="text-gray-700 mt-2 text-center">
              {doctor.specialization} • {doctor.experienceYears} years experience
            </p>

            <p className="text-sm text-muted-foreground mt-2 text-center">
              {doctor.qualification}
            </p>

            <p className="text-sm text-muted-foreground mt-2 text-center">
              Hospital: {doctor.hospitalName}
            </p>

            <p className="text-sm text-muted-foreground mt-1 text-center">
              Consultation Fee: ${doctor.consultationFee}
            </p>

            <p className="text-sm text-muted-foreground mt-1 text-center">
              Contact: {doctor.contactNumber}
            </p>

            {doctor.bio && (
              <p className="text-gray-600 mt-4 text-center">{doctor.bio}</p>
            )}

            {/* Availability */}
            <div className="mt-4 w-full">
              <h4 className="font-semibold text-gray-900 mb-2">Available Days & Time Slots</h4>
              <ul className="text-sm text-muted-foreground">
                {doctor.availableDays.map((day, i) => (
                  <li key={i}>
                    <span className="font-medium">{day}:</span>{" "}
                    {doctor.availableTimeSlots.map((slot, j) => (
                      <span key={j}>
                        {slot.start} - {slot.end} {j < doctor.availableTimeSlots.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ratings */}
            {doctor.ratings.length > 0 && (
              <div className="mt-4 w-full">
                <h4 className="font-semibold text-gray-900 mb-2">Patient Ratings</h4>
                <ul className="text-sm text-muted-foreground">
                  {doctor.ratings.map((r, i) => (
                    <li key={i} className="mb-2">
                      <Star className="inline-block h-4 w-4 text-yellow-400 mr-1" />
                      {r.rating} - {r.comment || "No comment"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 w-full sm:w-auto"
              >
                <a href={`tel:${doctor.contactNumber}`}>
                  <Calendar className="h-4 w-4 mr-2 inline-block" />
                  Make an Appoinment
                </a>
              </Button>
            </div>

            <Button
              className="bg-gray-300 text-black hover:bg-gray-400 mt-6"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
