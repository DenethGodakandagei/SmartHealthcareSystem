import { StaffService } from "../../src/services/staff.service"; // adjust path
import Appointment from "../../src/models/appointment.model"; // adjust path
import Doctor from "../../src/models/doctor.model"; // adjust path
import Patient from "../../src/models/patient.model"; // adjust path
import User from "../../src/models/user.model"; // adjust path
import { Types } from "mongoose";
import { IAppointment } from "../../src/interfaces/appointment.interfaces"; // Assuming you have this interface

// Mock all Mongoose models
jest.mock("../../src/models/appointment.model");
jest.mock("../../src/models/doctor.model");
jest.mock("../../src/models/patient.model");
jest.mock("../../src/models/user.model");

const MockAppointment = Appointment as jest.Mocked<typeof Appointment>;
const MockDoctor = Doctor as jest.Mocked<typeof Doctor>;
const MockPatient = Patient as jest.Mocked<typeof Patient>;
const MockUser = User as jest.Mocked<typeof User>;

const staffService = new StaffService();

// Mock data (Using valid 24-character hex strings for ObjectIds)
const appointmentId = new Types.ObjectId().toHexString();
const staffId = new Types.ObjectId("60c728b7e2a9695624760000");
const doctorId = new Types.ObjectId("60c728b7e2a9695624761111");
const patientId = new Types.ObjectId("60c728b7e2a9695624762222");
const newDoctorId = new Types.ObjectId("60c728b7e2a9695624769999");

// Helper to create a mock appointment object with a save method
const createMockAppointment = (
  status: "Pending" | "Confirmed" | "Cancelled" = "Pending",
  notes?: string
) =>
  ({
    _id: appointmentId,
    doctorId,
    patientId,
    appointmentDate: new Date(),
    timeSlot: { start: "09:00", end: "10:00" },
    status,
    notes,
    save: jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    }),
  } as unknown as IAppointment & { save: jest.Mock });

// Helper to create mock user/patient/doctor objects with populated data
const createMockUser = (name: string, role: string) => ({
  _id: new Types.ObjectId(),
  name,
  role,
});

const createMockDoctor = (name: string) => ({
  _id: doctorId,
  userId: createMockUser(name, "Doctor"),
});

const createMockPatient = (
  name: string,
  contactNumber?: string,
  age?: number
) => ({
  _id: patientId,
  userId: createMockUser(name, "Patient"),
  contactNumber,
  age,
});

describe("StaffService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Standard mock for populate chain in getPendingAppointments
    const mockPopulate = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    };
    MockAppointment.find.mockReturnValue(mockPopulate as any);
  });

  // ----------------------------------------------------------------------------------
  // confirmAppointment Tests
  // ----------------------------------------------------------------------------------

  describe("confirmAppointment", () => {
    it("should successfully confirm a pending appointment", async () => {
      const mockApp = createMockAppointment("Pending", "Initial note");
      const mockStaff = createMockUser("Jane Staff", "Receptionist");
      const mockDoctor = createMockDoctor("Dr. Smith");
      const mockPatient = createMockPatient("John Doe", "1234567890", 30);

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);

      // FIX: Mock to allow .populate() chaining by returning an object with a mockable populate function
      MockDoctor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDoctor),
      } as any);
      MockPatient.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPatient),
      } as any);

      const newNotes = "Confirmed by staff, patient info verified.";
      const result = await staffService.confirmAppointment(
        appointmentId,
        staffId,
        newNotes
      );

      expect(mockApp.status).toBe("Confirmed");
      expect(mockApp.notes).toBe(newNotes);
      expect(mockApp.save).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockApp);
    });

    it("should use existing notes if new notes are not provided", async () => {
      const mockApp = createMockAppointment("Pending", "Original note");
      const mockStaff = createMockUser("Jane Staff", "Receptionist");
      const mockDoctor = createMockDoctor("Dr. Smith");
      const mockPatient = createMockPatient("John Doe", "1234567890", 30);

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);

      // FIX: Mock to allow .populate() chaining
      MockDoctor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDoctor),
      } as any);
      MockPatient.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPatient),
      } as any);

      await staffService.confirmAppointment(appointmentId, staffId, undefined);

      expect(mockApp.notes).toBe("Original note");
    });

    it("should throw error if appointment is not found", async () => {
      MockAppointment.findById.mockResolvedValue(null);
      await expect(
        staffService.confirmAppointment(appointmentId, staffId, "notes")
      ).rejects.toThrow("Appointment not found.");
    });

    it("should throw error if staff member is not found", async () => {
      const mockApp = createMockAppointment();
      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(null);

      await expect(
        staffService.confirmAppointment(appointmentId, staffId)
      ).rejects.toThrow("Staff member not authorized or not found.");
    });

    it.each(["Confirmed", "Cancelled"])(
      "should throw error if appointment is already %s",
      async (status) => {
        const mockApp = createMockAppointment(
          status as "Confirmed" | "Cancelled"
        );
        const mockStaff = createMockUser("Staff", "Receptionist");

        MockAppointment.findById.mockResolvedValue(mockApp as any);
        MockUser.findById.mockResolvedValue(mockStaff as any);

        await expect(
          staffService.confirmAppointment(appointmentId, staffId)
        ).rejects.toThrow(`Appointment is already ${status}.`);
      }
    );

    it("should throw error if associated doctor is not found", async () => {
      const mockApp = createMockAppointment();
      const mockStaff = createMockUser("Staff", "Receptionist");

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);

      // FIX: The findById must return a mock object that supports .populate, which then resolves to null
      MockDoctor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        staffService.confirmAppointment(appointmentId, staffId)
      ).rejects.toThrow("Doctor associated with appointment not found.");
    });

    it("should throw error if associated patient is not found", async () => {
      const mockApp = createMockAppointment();
      const mockStaff = createMockUser("Staff", "Receptionist");
      const mockDoctor = createMockDoctor("Dr. Smith");

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);

      // FIX: Doctor findById must succeed first
      MockDoctor.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDoctor),
      } as any);

      // FIX: Patient findById must support .populate, which then resolves to null
      MockPatient.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        staffService.confirmAppointment(appointmentId, staffId)
      ).rejects.toThrow("Patient associated with appointment not found.");
    });
  });

  // ----------------------------------------------------------------------------------
  // rescheduleAppointment Tests
  // ----------------------------------------------------------------------------------

  describe("rescheduleAppointment", () => {
    const newDate = new Date("2024-01-01T10:00:00.000Z");
    const newTimeSlot = { start: "10:00", end: "11:00" };

    it("should successfully reschedule appointment with new date and time", async () => {
      const mockApp = createMockAppointment();
      const mockStaff = createMockUser("Jane Staff", "Receptionist");

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);

      const result = await staffService.rescheduleAppointment(
        appointmentId,
        staffId,
        undefined,
        newDate,
        newTimeSlot
      );

      expect(mockApp.appointmentDate).toBe(newDate);
      expect(mockApp.timeSlot).toBe(newTimeSlot);
      expect(mockApp.status).toBe("Pending");
      expect(mockApp.notes).toContain("Rescheduled from original appointment.");
      expect(mockApp.save).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockApp);
    });

    it("should successfully reschedule appointment with new doctor", async () => {
      const mockApp = createMockAppointment();
      const mockStaff = createMockUser("Jane Staff", "Receptionist");
      const mockNewDoctor = createMockDoctor("Dr. New");
      mockNewDoctor._id = newDoctorId;

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);
      MockDoctor.findById.mockResolvedValue(mockNewDoctor as any);

      const result = await staffService.rescheduleAppointment(
        appointmentId,
        staffId,
        newDoctorId
      );

      expect(mockApp.doctorId).toBe(newDoctorId);
      expect(mockApp.status).toBe("Pending");
      expect(result).toBe(mockApp);
      expect(MockDoctor.findById).toHaveBeenCalledWith(newDoctorId);
    });

    it("should throw error if appointment is not found", async () => {
      MockAppointment.findById.mockResolvedValue(null);
      await expect(
        staffService.rescheduleAppointment(appointmentId, staffId)
      ).rejects.toThrow("Appointment not found.");
    });

    it("should throw error if staff member is not found", async () => {
      const mockApp = createMockAppointment();
      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(null);

      await expect(
        staffService.rescheduleAppointment(appointmentId, staffId)
      ).rejects.toThrow("Staff member not authorized or not found.");
    });

    it("should throw error if new doctor is not found", async () => {
      const mockApp = createMockAppointment();
      const mockStaff = createMockUser("Jane Staff", "Receptionist");

      MockAppointment.findById.mockResolvedValue(mockApp as any);
      MockUser.findById.mockResolvedValue(mockStaff as any);
      MockDoctor.findById.mockResolvedValue(null);

      await expect(
        staffService.rescheduleAppointment(appointmentId, staffId, newDoctorId)
      ).rejects.toThrow("New doctor not found.");
    });
  });

  // ----------------------------------------------------------------------------------
  // getPendingAppointments Tests
  // ----------------------------------------------------------------------------------

  describe("getPendingAppointments", () => {
    it("should return a list of pending appointments", async () => {
      const pendingAppsData = [
        createMockAppointment("Pending"),
        createMockAppointment("Pending"),
      ];

      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(pendingAppsData),
      };
      MockAppointment.find.mockReturnValue(mockPopulate as any);

      const result = await staffService.getPendingAppointments();

      expect(MockAppointment.find).toHaveBeenCalledWith({ status: "Pending" });
      expect(mockPopulate.populate).toHaveBeenCalledTimes(4); // Four populate calls in the service method
      expect(mockPopulate.sort).toHaveBeenCalledWith({
        appointmentDate: 1,
        "timeSlot.start": 1,
      });
      expect(result).toEqual(pendingAppsData);
    });

    it("should return an empty array if no pending appointments are found", async () => {
      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      };
      MockAppointment.find.mockReturnValue(mockPopulate as any);

      const result = await staffService.getPendingAppointments();

      expect(result).toEqual([]);
    });
  });
});
