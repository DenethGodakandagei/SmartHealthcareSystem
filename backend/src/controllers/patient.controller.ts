import type { Request, Response } from "express";
import Patient from "../models/patient.model.js";

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const patients = await Patient.find().populate("userId", "name email");
    res.json(patients);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id).populate("userId");
    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
      return;
    }
    res.json(patient);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
