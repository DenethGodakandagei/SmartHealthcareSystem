import { Request, Response, NextFunction } from "express";
import { StaffService } from "../services/staff.service.js";
import { Types } from "mongoose";

// Extend the Request interface to include the user property
interface AuthRequest extends Request {
  user?: {
    userId: Types.ObjectId;
    role: string;
  };
}

const staffService = new StaffService();

export class StaffController {
  async getPendingAppointments(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pendingAppointments = await staffService.getPendingAppointments();
      res.status(200).json(pendingAppointments);
    } catch (error) {
      next(error);
    }
  }

  async confirmAppointment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { appointmentId } = req.params;
      const { notes } = req.body;
      const staffId = req.user?.userId; // still using ID if available

      console.log("STAFFID", staffId);

      if (!staffId) {
        return res
          .status(401)
          .json({ message: "Staff ID not found in token." });
      }

      if (!Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
      }

      const confirmedAppointment = await staffService.confirmAppointment(
        appointmentId,
        staffId,
        notes
      );

      if (!confirmedAppointment) {
        return res.status(404).json({
          message: "Appointment not found or could not be confirmed.",
        });
      }

      res.status(200).json({
        message: "Appointment confirmed successfully.",
        appointment: confirmedAppointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async rescheduleAppointment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { appointmentId } = req.params;
      const { newDoctorId, newAppointmentDate, newTimeSlot } = req.body;
      const staffId = req.user?.userId;

      if (!staffId) {
        return res
          .status(401)
          .json({ message: "Staff ID not found in token." });
      }

      if (!Types.ObjectId.isValid(appointmentId)) {
        return res.status(400).json({ message: "Invalid appointment ID." });
      }
      if (newDoctorId && !Types.ObjectId.isValid(newDoctorId)) {
        return res.status(400).json({ message: "Invalid new doctor ID." });
      }

      const rescheduledAppointment = await staffService.rescheduleAppointment(
        appointmentId,
        staffId,
        newDoctorId,
        newAppointmentDate ? new Date(newAppointmentDate) : undefined,
        newTimeSlot
      );

      if (!rescheduledAppointment) {
        return res.status(404).json({
          message: "Appointment not found or could not be rescheduled.",
        });
      }

      res.status(200).json({
        message: "Appointment rescheduled successfully.",
        appointment: rescheduledAppointment,
      });
    } catch (error) {
      next(error);
    }
  }
}
