import express from "express";
import { bookAppointment, getPending, confirm } from "../controllers/appointment.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public booking endpoint (patient)
router.post("/book", verifyToken, bookAppointment);

// Staff endpoints
router.get("/pending", verifyToken, getPending);
router.post("/:id/confirm", verifyToken, confirm);

export default router;
