import { Router } from "express";
import { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord } from "../controllers/record.controller.js";

const router = Router();

router.get("/", getAllRecords);
router.get("/:id", getRecordById);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;
