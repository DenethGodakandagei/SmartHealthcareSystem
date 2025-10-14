import { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";

const appointmentService = new AppointmentService();

/**
 * @desc Book a new appointment
 * @route POST /api/appointments
 */
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json({
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Get all appointments (admin)
 * @route GET /api/appointments
 */
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch appointments." });
  }
};

/**
 * @desc Get appointments by patient ID
 * @route GET /api/appointments/patient/:patientId
 */
export const getAppointmentsByPatient = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAppointmentsByPatient(req.params.patientId);
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch patient appointments." });
  }
};

/**
 * @desc Get appointments by doctor ID
 * @route GET /api/appointments/doctor/:doctorId
 */
export const getAppointmentsByDoctor = async (req: Request, res: Response) => {
  try {
    const appointments = await appointmentService.getAppointmentsByDoctor(req.params.doctorId);
    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch doctor appointments." });
  }
};

/**
 * @desc Update appointment status
 * @route PATCH /api/appointments/:appointmentId/status
 */
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const updated = await appointmentService.updateAppointmentStatus(
      req.params.appointmentId,
      req.body.status
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: `Appointment status updated successfully.`,
      appointment: updated,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Update appointment details
 * @route PUT /api/appointments/:appointmentId
 */
export const updateAppointmentDetails = async (req: Request, res: Response) => {
  try {
    const updated = await appointmentService.updateAppointmentDetails(req.params.appointmentId, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({
      message: "Appointment updated successfully.",
      appointment: updated,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc Delete an appointment
 * @route DELETE /api/appointments/:appointmentId
 */
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const deleted = await appointmentService.deleteAppointment(req.params.appointmentId);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};
