import express from "express";
import {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorByUserId,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorsBySpecialty,
} from "../controllers/doctor.controller.ts";

const router = express.Router();

// Doctor Routes
router.post("/", registerDoctor);
router.get("/", getAllDoctors);
router.get("/user/:userId", getDoctorByUserId);
router.get("/search", searchDoctors);
router.get("/specialty/:specialty", getDoctorsBySpecialty);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
