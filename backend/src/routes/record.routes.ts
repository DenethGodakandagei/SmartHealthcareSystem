import express from "express";
import {
  getAllRecords,
  getRecordsByPatient,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller.js";

const router = express.Router();

// Record routes
router.get("/", getAllRecords);
router.get("/patient/:patientId", getRecordsByPatient);
router.post("/", addRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;
