import type { Request, Response } from "express";
import * as service from "../services/appointment.service.js";
import { sendNotification } from "../utils/notification.util.js";

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, scheduledAt, reason } = req.body;

    const payload = { patientId, doctorId, scheduledAt: new Date(scheduledAt), reason };

    // naive availability check for the exact slot
    const available = await service.findAvailable(doctorId, new Date(scheduledAt), new Date(scheduledAt));
    if (!available) return res.status(409).json({ message: "Selected time slot is not available" });

    const appointment = await service.createAppointment(payload);

    // notify doctor (dummy)
    sendNotification(doctorId, `New appointment: ${appointment.reference}`);

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getPending = async (req: Request, res: Response) => {
  try {
    const items = await service.getPendingAppointments();
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.id;
    const staffId = req.user?.userId;
    const appt = await service.confirmAppointment(appointmentId, staffId);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    // notify patient and doctor
    sendNotification(appt.patientId?.toString(), `Your appointment ${appt.reference} is confirmed`);
    sendNotification(appt.doctorId?.toString(), `Appointment ${appt.reference} confirmed by staff`);

    res.json({ message: "Appointment confirmed", appointment: appt });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
