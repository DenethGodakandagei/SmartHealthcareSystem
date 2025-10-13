import type { Request, Response } from "express";
import { PatientService } from "../services/patient.service.js";

const patientService = new PatientService();

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json(patients);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const updated = await patientService.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const deleted = await patientService.deletePatient(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
