import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import Patient from "../models/patient.model";
import User from "../models/user.model"; // Import User model to get patient/doctor names
import { IAppointment } from "../interfaces/appointment.interfaces";
import { Types } from "mongoose";

export class StaffService {
  async confirmAppointment(
    appointmentId: string,
    staffId: Types.ObjectId,
    notes?: string
  ): Promise<IAppointment | null> {
    console.log("confirmAppointment hit");
    // 1. Retrieve the appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    // 2. Verify staff member is logged in (this would typically be handled by middleware)
    const staff = await User.findById(staffId);
    if (!staff) {
      throw new Error("Staff member not authorized or not found.");
    }

    // 3. Check if appointment is already confirmed or cancelled
    if (
      appointment.status === "Confirmed" ||
      appointment.status === "Cancelled"
    ) {
      throw new Error(`Appointment is already ${appointment.status}.`);
    }

    // 4. Verify doctor's availability and patient details (simplified for now)
    // In a real system, this would involve more complex logic, e.g., checking doctor's schedule
    // and ensuring patient details are complete.
    const doctor = await Doctor.findById(appointment.doctorId).populate(
      "userId",
      "name"
    );
    if (!doctor) {
      throw new Error("Doctor associated with appointment not found.");
    }

    const patient = await Patient.findById(appointment.patientId).populate(
      "userId",
      "name"
    );
    if (!patient) {
      throw new Error("Patient associated with appointment not found.");
    }

    // Alternate Flow: If patient details are incomplete, staff member requests updates
    // This would typically involve a separate UI/API call to update patient details.
    // For this service, we'll assume details are sufficient or handled externally.
    if (!patient.contactNumber || !patient.age) {
      // Example of incomplete details
      // In a real scenario, you might throw an error or return a specific status
      console.warn(
        `Patient ${patient._id} details are incomplete. Confirmation proceeds.`
      );
    }

    // 5. Confirm the appointment
    appointment.status = "Confirmed";
    appointment.notes = notes || appointment.notes;
    // Add staffId and confirmationDate to the appointment if the interface allowed it
    // For now, we'll just update the status.
    // If I were allowed to modify appointment.interfaces.ts, I would add staffId and confirmationDate.

    const updatedAppointment = await appointment.save();

    // 6. Send notification (email/SMS) to the patient and doctor
    // This would involve integrating with an email/SMS service.
    // For now, we'll just log a message.
    console.log(
      `Notification sent to patient ${
        (patient.userId as any).name
      } and doctor ${
        (doctor.userId as any).name
      } for appointment ${appointmentId}.`
    );

    return updatedAppointment;
  }

  async rescheduleAppointment(
    appointmentId: string,
    staffId: Types.ObjectId,
    newDoctorId?: Types.ObjectId,
    newAppointmentDate?: Date,
    newTimeSlot?: { start: string; end: string }
  ): Promise<IAppointment | null> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error("Appointment not found.");
    }

    const staff = await User.findById(staffId);
    if (!staff) {
      throw new Error("Staff member not authorized or not found.");
    }

    // Check if the new doctor is available if a new doctor is suggested
    if (newDoctorId) {
      const newDoctor = await Doctor.findById(newDoctorId);
      if (!newDoctor) {
        throw new Error("New doctor not found.");
      }
      appointment.doctorId = newDoctorId;
    }

    if (newAppointmentDate) {
      appointment.appointmentDate = newAppointmentDate;
    }

    if (newTimeSlot) {
      appointment.timeSlot = newTimeSlot;
    }

    // Since "Rescheduled" is not a valid status in IAppointment,
    // we will set it to "Pending" and add a note.
    appointment.status = "Pending";
    appointment.notes =
      `Rescheduled from original appointment. New date: ${
        newAppointmentDate?.toISOString().split("T")[0] || "N/A"
      }, New time: ${newTimeSlot?.start || "N/A"}-${
        newTimeSlot?.end || "N/A"
      }. ` + (appointment.notes || "");

    const updatedAppointment = await appointment.save();

    // Send notification about rescheduling
    console.log(`Appointment ${appointmentId} rescheduled.`);

    return updatedAppointment;
  }

  async getPendingAppointments(): Promise<IAppointment[]> {
    return await Appointment.find({ status: "Pending" })
      .populate("doctorId", "doctorName") // Populate doctorName directly
      .populate("patientId", "userId") // Populate userId to get patient name
      .populate({
        path: "patientId",
        populate: {
          path: "userId",
          select: "name contactNumber", // Select name and contactNumber from User
        },
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name", // Select name from User for doctor
        },
      })
      .sort({ appointmentDate: 1, "timeSlot.start": 1 });
  }
}
