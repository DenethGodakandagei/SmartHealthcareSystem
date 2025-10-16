import express from "express";
import authRoutes from "./auth.routes";
import patientRoutes from "./patient.route";
import HealthcareReportRoutes from "./HealthcareReport.routes";
import doctorRoutes from "./doctor.routes";
import appointmentRoutes from "./appointment.routes";
import recordRoutes from "./record.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/reports", HealthcareReportRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/records", recordRoutes);

export default router;
