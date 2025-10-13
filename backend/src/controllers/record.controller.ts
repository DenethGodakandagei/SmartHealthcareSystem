import type { Request, Response } from "express";
import Record from "../models/record.model.js";

// ✅ Get a patient record
export const getPatientRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const record = await Record.findOne({ patientId: req.params.patientId })
      .populate("patientId")
      .populate("doctorId", "name email");

    if (!record) {
      res.status(404).json({ message: "Record not found" });
      return;
    }

    res.json(record);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update treatment details
export const updateTreatment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { diagnosis, notes, procedures } = req.body;

    const record = await Record.findOneAndUpdate(
      { patientId: req.params.patientId },
      {
        $set: {
          "treatment.diagnosis": diagnosis,
          "treatment.notes": notes,
          "treatment.procedures": procedures,
          "treatment.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!record) {
      res.status(404).json({ message: "Record not found" });
      return;
    }

    res.json({ message: "Treatment updated successfully", record });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update prescription details
export const updatePrescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, dosage, frequency, duration } = req.body;

    const record = await Record.findOneAndUpdate(
      { patientId: req.params.patientId },
      {
        $set: {
          "prescription.name": name,
          "prescription.dosage": dosage,
          "prescription.frequency": frequency,
          "prescription.duration": duration,
          "prescription.updatedAt": new Date(),
        },
      },
      { new: true }
    );

    if (!record) {
      res.status(404).json({ message: "Record not found" });
      return;
    }

    res.json({ message: "Prescription updated successfully", record });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
