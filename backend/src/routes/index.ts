import express from "express";
import authRoutes from "./auth.routes.js";
import patientRoutes from "./patient.route.js";
import recordRoutes from "./record.routes.js";

const router = express.Router();

// Group all route modules under /api
router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/records", recordRoutes);

export default router;
