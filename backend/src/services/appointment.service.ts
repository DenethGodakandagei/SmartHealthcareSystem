import Appointment from "../models/appointment.model.ts";
import Doctor from "../models/doctor.model.ts";
import Patient from "../models/patient.model.ts";
import type { IAppointment } from "../interfaces/appointment.interfaces.ts";

export class AppointmentService {

  //  Book a new appointment
async createAppointment(data: IAppointment): Promise<IAppointment> {
    const mockPatientId = "670d6a132f18f9a0c3e67bcd"; // fallback for testing
    const { doctorId, patientId, appointmentDate, timeSlot, reasonForVisit, payment } = data;

    // ✅ Validate doctor existence
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    // ✅ Validate or use mock patient
    const patient = await Patient.findById(patientId || mockPatientId);
    if (!patient) throw new Error("Patient not found");

    // ✅ Check for conflicting appointment
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "timeSlot.start": timeSlot.start,
      status: { $in: ["Pending", "Confirmed"] },
    });

    if (existingAppointment) {
      throw new Error("This time slot is already booked.");
    }

    // ✅ Default payment info if not provided
    const paymentInfo = payment || {
      amount: 0, // default 0 if free consultation
      status: "Pending",
      transactionId: null,
    };

    const appointment = new Appointment({
      doctorId,
      patientId: patient._id,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      status: "Pending",
      payment: paymentInfo,
    });

    return await appointment.save();
  }


  //Get all appointments (admin-level)
  async getAllAppointments(): Promise<IAppointment[]> {
    return await Appointment.find()
      .populate("doctorId", "specialization hospitalName")
      .populate("patientId", "age gender contactNumber")
      .sort({ appointmentDate: -1 });
  }

  //Get appointments for a specific patient
  async getAppointmentsByPatient(patientId: string): Promise<IAppointment[]> {
    return await Appointment.find({ patientId })
      .populate("doctorId", "specialization hospitalName")
      .sort({ appointmentDate: -1 });
  }

  //Get appointments for a specific doctor
  async getAppointmentsByDoctor(doctorId: string): Promise<IAppointment[]> {
    return await Appointment.find({ doctorId })
      .populate("patientId", "age gender contactNumber")
      .sort({ appointmentDate: 1 });
  }

  //Update appointment status (Confirm, Cancel, Complete)
  async updateAppointmentStatus(
    appointmentId: string,
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  ): Promise<IAppointment | null> {
    const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid appointment status");
    }

    return await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );
  }

  //Update any appointment details (used by admin)
  async updateAppointmentDetails(
    appointmentId: string,
    data: Partial<IAppointment>
  ): Promise<IAppointment | null> {
    return await Appointment.findByIdAndUpdate(appointmentId, data, {
      new: true,
      runValidators: true,
    });
  }

  //Cancel (delete) an appointment
  async deleteAppointment(appointmentId: string): Promise<IAppointment | null> {
    return await Appointment.findByIdAndDelete(appointmentId);
  }
}
