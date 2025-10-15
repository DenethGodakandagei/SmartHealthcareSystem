import { Request, Response } from "express";
import RecordService from "../services/record.service.js";

// Get all records
export const getAllRecords = async (_req: Request, res: Response) => {
  try {
    const records = await RecordService.getAllRecords();
    res.status(200).json(records);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching records", error: error.message });
  }
};
// Get records by patient
export const getRecordsByPatient = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  try {
    const records = await RecordService.getRecordsByPatient(patientId);
    res.status(200).json(records);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching records", error: error.message });
  }
};

// Add new record
export const addRecord = async (req: Request, res: Response) => {
  try {
    console.log("Add Record Body:", req.body); // for debugging
    const record = await RecordService.addRecord(req.body);
    res.status(201).json({ message: "Record added successfully", record });
  } catch (error: any) {
    console.error("Add Record Error:", error);
    res.status(500).json({ message: "Error adding record", error: error.message });
  }
};

// Update record
export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const record = await RecordService.updateRecord(id, req.body);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record updated successfully", record });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating record", error: error.message });
  }
};

// Delete record
export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await RecordService.deleteRecord(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting record", error: error.message });
  }
};
