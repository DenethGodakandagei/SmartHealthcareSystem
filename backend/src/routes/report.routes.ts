import express from "express";
import {
  generateReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

// Create / Generate a new report
router.post("/", generateReport);

// Get all reports
router.get("/", getReports);

// Get single report by ID
router.get("/:id", getReportById);

// Update report
router.put("/:id", updateReport);

// Delete report
router.delete("/:id", deleteReport);

export default router;
