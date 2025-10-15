import express from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.route.js";
import recordRoutes from "./record.routes.js";
import doctorRoutes from "./doctor.routes.ts";
import appointmentRoutes from "./appointment.routes.ts";

const router = express.Router();

// Group all route modules under /api
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/records", recordRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);

export default router;
