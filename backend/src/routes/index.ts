import express from "express";
import authRoutes from "./auth.routes";
import patientRoutes from "./patient.route";
import reportRoutes from "./report.routes";
import doctorRoutes from "./doctor.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/patients", patientRoutes);
router.use("/reports", reportRoutes);
router.use("/doctors", doctorRoutes);

export default router;
