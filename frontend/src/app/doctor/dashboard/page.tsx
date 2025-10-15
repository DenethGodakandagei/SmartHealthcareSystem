"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthContext } from "@/context/authcontext";
import { Home, Calendar, FileText, User, LogOut } from "lucide-react";

interface PatientIdObj {
  _id: string;
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  timeSlot: { start: string; end: string };
  patientId: string | PatientIdObj;
}

interface Record {
  _id: string;
  treatment: {
    diagnosis: string;
    notes: string;
    procedures: string;
  };
  prescription: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
}

interface Doctor {
  _id: string;
}

const DoctorDashboard: React.FC = () => {
  const { user, token } = useContext(AuthContext);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [newRecord, setNewRecord] = useState({
    diagnosis: "",
    notes: "",
    procedures: "",
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch doctor info
  useEffect(() => {
    if (!user?._id) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch doctor data");
      }
    };

    fetchDoctor();
  }, [user, token]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/appointments");
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  const fetchRecords = async (patientId: string | PatientIdObj) => {
    setLoading(true);
    try {
      const id = typeof patientId === "string" ? patientId : patientId._id;
      const res = await axios.get(`http://localhost:5000/api/records/patient/${id}`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageAppointment = (appt: Appointment) => {
    setSelectedAppointment(appt);
    fetchRecords(appt.patientId);
  };

  const handleSaveRecord = async () => {
    if (!selectedAppointment || !doctor) return;

    const patientId =
      typeof selectedAppointment.patientId === "string"
        ? selectedAppointment.patientId
        : selectedAppointment.patientId._id;

    const payload = {
      patientId,
      doctorId: doctor._id,
      appointmentId: selectedAppointment._id,
      treatment: {
        diagnosis: newRecord.diagnosis,
        notes: newRecord.notes,
        procedures: newRecord.procedures,
      },
      prescription: {
        name: newRecord.name,
        dosage: newRecord.dosage,
        frequency: newRecord.frequency,
        duration: newRecord.duration,
      },
    };

    try {
      if (editingRecordId) {
        await axios.put(`http://localhost:5000/api/records/${editingRecordId}`, payload);
        alert("Record updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/records", payload);
        alert("Record added successfully");
      }

      setNewRecord({
        diagnosis: "",
        notes: "",
        procedures: "",
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      });
      setEditingRecordId(null);
      fetchRecords(selectedAppointment.patientId);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save record");
    }
  };

  const handleEditRecord = (record: Record) => {
    setEditingRecordId(record._id);
    setNewRecord({
      diagnosis: record.treatment.diagnosis,
      notes: record.treatment.notes,
      procedures: record.treatment.procedures,
      name: record.prescription.name,
      dosage: record.prescription.dosage,
      frequency: record.prescription.frequency,
      duration: record.prescription.duration,
    });
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/records/${recordId}`);
      alert("Record deleted successfully");
      if (selectedAppointment) fetchRecords(selectedAppointment.patientId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg w-64 p-6 flex flex-col justify-between transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div>
          <h1 className="text-2xl font-bold mb-6">Doctor Panel</h1>
          <nav className="flex flex-col gap-3">
            <Button variant="ghost" className="justify-start gap-2">
              <Home /> Dashboard
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <Calendar /> Appointments
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <FileText /> Records
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <User /> Profile
            </Button>
          </nav>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Mobile Sidebar Toggle */}
        <Button className="md:hidden mb-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "Close Menu" : "Open Menu"}
        </Button>

        <h2 className="text-2xl font-bold mb-4">Appointments</h2>

        <Card className="p-4 mb-6">
          {appointments.map((appt) => (
            <div key={appt._id} className="flex justify-between items-center p-2 border rounded mb-2">
              <span>
                {new Date(appt.appointmentDate).toLocaleDateString()} | {appt.timeSlot.start} - {appt.timeSlot.end}
              </span>
              <Button onClick={() => handleManageAppointment(appt)}>Manage</Button>
            </div>
          ))}
        </Card>

        {selectedAppointment && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">Selected Appointment</h3>
            <span>
              {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} | {selectedAppointment.timeSlot.start} - {selectedAppointment.timeSlot.end}
            </span>
          </Card>
        )}

        {selectedAppointment && (
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-2">Patient Records</h3>

            {loading ? (
              <p>Loading records...</p>
            ) : records.length === 0 ? (
              <p>No records found.</p>
            ) : (
              records.map((record) => (
                <div key={record._id} className="border p-3 rounded mb-3">
                  <p><strong>Treatment:</strong> {record.treatment.diagnosis}</p>
                  <p><strong>Notes:</strong> {record.treatment.notes}</p>
                  <p><strong>Procedures:</strong> {record.treatment.procedures}</p>
                  <p><strong>Prescription:</strong> {record.prescription.name}</p>
                  <p><strong>Dosage:</strong> {record.prescription.dosage}</p>
                  <p><strong>Frequency:</strong> {record.prescription.frequency}</p>
                  <p><strong>Duration:</strong> {record.prescription.duration}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleEditRecord(record)}>Edit</Button>
                    <Button onClick={() => handleDeleteRecord(record._id)}>Delete</Button>
                  </div>
                </div>
              ))
            )}

            <Card className="p-4 mt-4">
              <h3 className="font-semibold text-lg mb-2">{editingRecordId ? "Edit Record" : "Add New Record"}</h3>
              <div className="flex flex-col gap-2">
                {["diagnosis", "notes", "procedures", "name", "dosage", "frequency", "duration"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(newRecord as any)[field]}
                    onChange={(e) => setNewRecord({ ...newRecord, [field]: e.target.value })}
                    className="border p-2 rounded"
                  />
                ))}
                <Button onClick={handleSaveRecord}>{editingRecordId ? "Update Record" : "Add Record"}</Button>
              </div>
            </Card>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
