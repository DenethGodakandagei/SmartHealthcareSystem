export interface IAppointment {
  _id: string;
  doctorId: {
    _id: string;
    doctorName?: string;
    userId?: {
      _id: string;
      name: string;
    };
  };
  patientId: {
    _id: string;
    userId?: {
      _id: string;
      name: string;
      contactNumber?: string;
    };
  };
  appointmentDate: string; // ISO string (e.g. "2025-10-16T08:30:00Z")
  timeSlot: {
    start: string;
    end: string;
  };
  status: "Pending" | "Confirmed" | "Cancelled";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
