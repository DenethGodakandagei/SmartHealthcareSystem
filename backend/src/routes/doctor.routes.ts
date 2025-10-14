import express from "express";
import {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
} from "../controllers/doctor.controller.ts";

const router = express.Router();

// Doctor Routes
router.post("/", registerDoctor);
router.get("/", getAllDoctors);
router.get("/search", searchDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
