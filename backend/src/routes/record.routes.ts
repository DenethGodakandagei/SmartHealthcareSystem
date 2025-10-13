import express from "express";
import {
  getPatientRecord,
  updateTreatment,
  updatePrescription,
} from "../controllers/record.controller.js";
import { verifyDoctor } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:patientId", verifyDoctor, getPatientRecord);
router.put("/:patientId/treatment", verifyDoctor, updateTreatment);
router.put("/:patientId/prescription", verifyDoctor, updatePrescription);

export default router;
