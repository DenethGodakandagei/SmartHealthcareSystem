import { Router } from "express";
import { getAllPatients, getPatientById, updatePatient, deletePatient } from "../controllers/patient.controller.js";

const router = Router();

router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
