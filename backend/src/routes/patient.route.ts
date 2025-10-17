import { Router } from "express";
import Patient from "../models/patient.model.js";
import { getAllPatients, getPatientById, updatePatient, deletePatient ,getPatientByUserId } from "../controllers/patient.controller.js";

const router = Router();

router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.get("/user/:id", getPatientByUserId);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
// Express route example
router.get("/patients/by-user/:userId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.userId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
