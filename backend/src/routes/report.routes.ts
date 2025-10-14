import express from "express";
import { generate } from "../controllers/report.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", verifyToken, generate);

export default router;
