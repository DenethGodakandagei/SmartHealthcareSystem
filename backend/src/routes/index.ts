import express from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.route.js";
import recordRoutes from "./record.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import reportRoutes from "./report.routes.js";

const router = express.Router();

// Group all route modules under /api
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/records", recordRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/reports", reportRoutes);

export default router;
