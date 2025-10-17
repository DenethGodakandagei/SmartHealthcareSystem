// __tests__/appointment.service.test.ts
import { AppointmentService } from "../services/appointment.service";
import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import Patient from "../models/patient.model";

jest.mock("../models/appointment.model");
jest.mock("../models/doctor.model");
jest.mock("../models/patient.model");

describe("AppointmentService", () => {
  let service: AppointmentService;

  beforeEach(() => {
    service = new AppointmentService();
    jest.clearAllMocks();
  });

  // --------------------- createAppointment tests ---------------------
  describe("createAppointment", () => {
    it("should create and return a new appointment", async () => {
      const mockDoctor = { _id: "d1" };
      const mockPatient = { _id: "p1" };
      const mockSave = jest.fn().mockResolvedValue({
        doctorId: "d1",
        patientId: "p1",
        status: "Pending",
      });

      (Doctor.findById as jest.Mock).mockResolvedValue(mockDoctor);
      (Patient.findOne as jest.Mock).mockResolvedValue(mockPatient);
      (Appointment as any).mockImplementation(() => ({ save: mockSave }));
      (Appointment.findOne as jest.Mock).mockResolvedValue(null);

      const data = {
        doctorId: "d1",
        patientId: "u1",
        appointmentDate: new Date(),
        timeSlot: { start: "10:00", end: "11:00" },
        reasonForVisit: "Checkup",
      };

      const result = await service.createAppointment(data as any);
      expect(result).toEqual({
        doctorId: "d1",
        patientId: "p1",
        status: "Pending",
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw error if doctor not found", async () => {
      (Doctor.findById as jest.Mock).mockResolvedValue(null);
      const data = { doctorId: "d1", patientId: "u1", appointmentDate: new Date(), timeSlot: { start: "10:00", end: "11:00" } };
      await expect(service.createAppointment(data as any)).rejects.toThrow("Doctor not found");
    });

    it("should throw error if patient not found", async () => {
      (Doctor.findById as jest.Mock).mockResolvedValue({ _id: "d1" });
      (Patient.findOne as jest.Mock).mockResolvedValue(null);
      const data = { doctorId: "d1", patientId: "u1", appointmentDate: new Date(), timeSlot: { start: "10:00", end: "11:00" } };
      await expect(service.createAppointment(data as any)).rejects.toThrow("Patient not found");
    });

    it("should throw error if time slot is already booked", async () => {
      (Doctor.findById as jest.Mock).mockResolvedValue({ _id: "d1" });
      (Patient.findOne as jest.Mock).mockResolvedValue({ _id: "p1" });
      (Appointment.findOne as jest.Mock).mockResolvedValue({}); // conflict exists

      const data = { doctorId: "d1", patientId: "u1", appointmentDate: new Date(), timeSlot: { start: "10:00", end: "11:00" } };
      await expect(service.createAppointment(data as any)).rejects.toThrow("This time slot is already booked.");
    });
  });

  // --------------------- getAllAppointments ---------------------
  describe("getAllAppointments", () => {
    it("should return all appointments", async () => {
      const mockAppointments = [{ id: 1 }, { id: 2 }];
      (Appointment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAppointments),
      });

      const result = await service.getAllAppointments();
      expect(result).toEqual(mockAppointments);
    });
  });

  // --------------------- getAppointmentsByPatient ---------------------
  describe("getAppointmentsByPatient", () => {
    it("should return appointments for a specific patient", async () => {
      const mockAppointments = [{ id: 1 }, { id: 2 }];
      (Appointment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAppointments),
      });

      const result = await service.getAppointmentsByPatient("p1");
      expect(Appointment.find).toHaveBeenCalledWith({ patientId: "p1" });
      expect(result).toEqual(mockAppointments);
    });
  });

  // --------------------- getAppointmentsByDoctor ---------------------
  describe("getAppointmentsByDoctor", () => {
    it("should return appointments for a specific doctor", async () => {
      const mockAppointments = [{ id: 1 }, { id: 2 }];
      (Appointment.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAppointments),
      });

      const result = await service.getAppointmentsByDoctor("d1");
      expect(Appointment.find).toHaveBeenCalledWith({ doctorId: "d1" });
      expect(result).toEqual(mockAppointments);
    });
  });

  // --------------------- updateAppointmentStatus ---------------------
  describe("updateAppointmentStatus", () => {
    it("should update status if valid", async () => {
      const updated = { id: "1", status: "Confirmed" };
      (Appointment.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);
      const result = await service.updateAppointmentStatus("1", "Confirmed");
      expect(result).toEqual(updated);
    });

    it("should throw error for invalid status", async () => {
      await expect(service.updateAppointmentStatus("1", "Invalid" as any)).rejects.toThrow("Invalid appointment status");
    });
  });

  // --------------------- updateAppointmentDetails ---------------------
  describe("updateAppointmentDetails", () => {
    it("should update appointment details", async () => {
      const updated = { id: "1", reasonForVisit: "Updated reason" };
      (Appointment.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateAppointmentDetails("1", { reasonForVisit: "Updated reason" });
      expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith("1", { reasonForVisit: "Updated reason" }, { new: true, runValidators: true });
      expect(result).toEqual(updated);
    });
  });

  // --------------------- deleteAppointment ---------------------
  describe("deleteAppointment", () => {
    it("should delete appointment", async () => {
      const deleted = { id: "1" };
      (Appointment.findByIdAndDelete as jest.Mock).mockResolvedValue(deleted);
      const result = await service.deleteAppointment("1");
      expect(result).toEqual(deleted);
    });
  });
});
