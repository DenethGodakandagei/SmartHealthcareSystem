import type { Request, Response } from "express";
import { RecordService } from "../services/record.service.js";

const recordService = new RecordService();

export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const records = await recordService.getAllRecords();
    res.status(200).json(records);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const record = await recordService.createRecord(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const updated = await recordService.updateRecord(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const deleted = await recordService.deleteRecord(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
