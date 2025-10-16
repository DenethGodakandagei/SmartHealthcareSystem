// routes/HealthcareReportRoutes.ts
import { Router } from "express";
import { HealthcareReportController } from "../controllers/HealthcareReport.controller";

const router = Router();
const controller = new HealthcareReportController();

router.post("/", (req, res) => controller.createReport(req, res));
router.get("/", (req, res) => controller.getAllReports(req, res));
router.get("/:id", (req, res) => controller.getReportById(req, res));
router.put("/:id", (req, res) => controller.updateReport(req, res));
router.delete("/:id", (req, res) => controller.deleteReport(req, res));

export default router;
