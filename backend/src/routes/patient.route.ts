import { Router } from "express";
import { getAllPatients, getPatientById, updatePatient, deletePatient ,getPatientByUserId } from "../controllers/patient.controller.js";

const router = Router();

router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.get("/user/:id", getPatientByUserId);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
