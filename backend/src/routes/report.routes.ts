import express from "express";
import {
  generateReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

// CRUD Routes
router.post("/", generateReport);        // Create
router.get("/", getReports);             // Read all
router.get("/:id", getReportById);       // Read single
router.put("/:id", updateReport);        // Update
router.delete("/:id", deleteReport);     // Delete

export default router;
