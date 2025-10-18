import { Router } from "express";
import { StaffController } from "../controllers/staff.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();
const staffController = new StaffController();

// Apply verifyToken to all staff routes

// Get all pending appointments for staff to review
router.get(
  "/appointments/pending",
  verifyToken,
  staffController.getPendingAppointments
);

// Confirm an appointment
router.patch(
  "/appointments/:appointmentId/confirm",
  verifyToken,
  staffController.confirmAppointment
);

// Reschedule an appointment
router.patch(
  "/appointments/:appointmentId/reschedule",
  verifyToken,
  staffController.rescheduleAppointment
);

export default router;
