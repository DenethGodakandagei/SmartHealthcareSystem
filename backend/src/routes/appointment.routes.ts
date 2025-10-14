import express from "express";
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  updateAppointmentStatus,
  updateAppointmentDetails,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", bookAppointment);
router.get("/", getAllAppointments);
router.get("/patient/:patientId", getAppointmentsByPatient);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.patch("/:appointmentId/status", updateAppointmentStatus);
router.put("/:appointmentId", updateAppointmentDetails);
router.delete("/:appointmentId", deleteAppointment);

export default router;
