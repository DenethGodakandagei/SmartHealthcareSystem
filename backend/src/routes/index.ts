import express from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.route.js";
import reportRoutes from "./HealthcareReport.routes.js";
import doctorRoutes from "./doctor.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import staffRoutes from "./staff.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/reports", reportRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/staff", staffRoutes);

export default router;
