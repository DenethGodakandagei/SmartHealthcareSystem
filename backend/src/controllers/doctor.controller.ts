import { Request, Response } from "express";
import { DoctorService } from "../services/doctor.service.ts";

const doctorService = new DoctorService();

// Register a new doctor
export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ message: "Doctor created successfully!", doctor });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error while creating doctor." });
  }
};

// Get all doctors
export const getAllDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching doctors." });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching doctor details." });
  }
};

// Get doctors by specialty 
export const getDoctorsBySpecialty = async (req: Request, res: Response) => {
  try {
    // 1. Get the specialization from the request query parameters (e.g., /doctors/specialty?specialization=Cardiology)
    const specialization = req.query.specialization?.toString();

    if (!specialization) {
      return res.status(400).json({ message: "Specialization query parameter is required." });
    }

    // 2. Call the service layer method to fetch doctors
    // You will need to implement a 'getDoctorsBySpecialization' method in your DoctorService
    const doctors = await doctorService.getDoctorsBySpecialization(specialization);

    if (doctors.length === 0) {
      // Optional: Return a 404 if no doctors are found for the given specialization
      return res.status(404).json({ message: `No doctors found for specialization: ${specialization}` });
    }

    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching doctors by specialization." });
  }
};


// Update doctor details
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const updatedDoctor = await doctorService.updateDoctor(req.params.id, req.body);
    if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor details updated successfully!", doctor: updatedDoctor });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating doctor details." });
  }
};

// Delete doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const deletedDoctor = await doctorService.deleteDoctor(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor profile deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting doctor profile." });
  }
};

// Search doctors
export const searchDoctors = async (req: Request, res: Response) => {
  try {
    const { specialization, hospitalName } = req.query;
    const doctors = await doctorService.searchDoctors({ 
      specialization: specialization?.toString(), 
      hospitalName: hospitalName?.toString() 
    });
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: "Error searching doctors." });
  }
};
