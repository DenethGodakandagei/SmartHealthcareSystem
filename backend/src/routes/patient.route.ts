import express from "express";
import { getAllPatients, getPatientById } from "../controllers/patient.controller.js";
import { verifyDoctor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyDoctor, getAllPatients);
router.get("/:id", verifyDoctor, getPatientById);

export default router;
