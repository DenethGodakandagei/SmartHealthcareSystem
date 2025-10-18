/* eslint-disable @typescript-eslint/no-explicit-any */
// This import must be a named import to match 'export class StaffController' in the source file.
import { StaffController } from "../../src/controllers/staff.controller"; // adjust path
import { StaffService } from "../../src/services/staff.service";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

// Mock the service
jest.mock("../../src/services/staff.service");

// Casting the mocked class as the actual service's type helps with intellisense
const mockedService = new StaffService() as jest.Mocked<StaffService>;
const staffController = new StaffController();

// Mirror the AuthRequest interface from your controller/middleware context
interface AuthRequest extends Request {
  user?: {
    userId: Types.ObjectId;
    role: string;
  };
}

// Helper for typed mock request
const mockReq = (
  params = {},
  body = {},
  // Using a valid ObjectId for safety
  user: AuthRequest["user"] = {
    userId: new Types.ObjectId("60c728b7e2a9695624765432"),
    role: "staff",
  }
): AuthRequest =>
  ({
    params,
    body,
    user,
  } as AuthRequest);

// Helper for mock response
const mockRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe("StaffController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Inject the mocked service into the controller instance
    (staffController as any).staffService = mockedService;
  });

  // ----------------------------------------------------------------------------------
  // getPendingAppointments Tests
  // ----------------------------------------------------------------------------------

  describe("getPendingAppointments", () => {
    it("should return pending appointments with 200 status", async () => {
      const pendingApps = [
        {
          _id: "appoint123",
          status: "Pending",
          doctorId: "doc1",
          patientId: "pat1",
        },
      ];
      mockedService.getPendingAppointments.mockResolvedValue(
        pendingApps as any
      );

      const req = mockReq();
      const res = mockRes();

      await staffController.getPendingAppointments(
        req,
        res as Response,
        mockNext
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(pendingApps);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next on service error", async () => {
      mockedService.getPendingAppointments.mockRejectedValue(
        new Error("DB error")
      );

      const req = mockReq();
      const res = mockRes();

      await staffController.getPendingAppointments(
        req,
        res as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ----------------------------------------------------------------------------------
  // confirmAppointment Tests
  // ----------------------------------------------------------------------------------

  describe("confirmAppointment", () => {
    const appointmentId = "60c728b7e2a9695624765432"; // Valid ObjectId format
    const staffUserId = new Types.ObjectId("60c728b7e2a9695624760000");
    const notes = "Patient verified, ready for check-in.";

    it("should confirm appointment and return 200", async () => {
      const confirmedApp = { _id: appointmentId, status: "Confirmed" };
      mockedService.confirmAppointment.mockResolvedValue(confirmedApp as any);

      const req = mockReq(
        { appointmentId },
        { notes },
        { userId: staffUserId, role: "staff" }
      );
      const res = mockRes();

      await staffController.confirmAppointment(req, res as Response, mockNext);

      expect(mockedService.confirmAppointment).toHaveBeenCalledWith(
        appointmentId,
        staffUserId,
        notes
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Appointment confirmed successfully.",
        appointment: confirmedApp,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if no staffId in token (user undefined)", async () => {
      const req = mockReq({ appointmentId }, {}, undefined);
      const res = mockRes();

      await staffController.confirmAppointment(req, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Staff ID not found in token.",
      });
      expect(mockedService.confirmAppointment).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid appointmentId format", async () => {
      const req = mockReq({ appointmentId: "invalid" }, {});
      const res = mockRes();

      await staffController.confirmAppointment(req, res as Response, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid appointment ID.",
      });
      expect(mockedService.confirmAppointment).not.toHaveBeenCalled();
    });

    it("should call next on service error", async () => {
      mockedService.confirmAppointment.mockRejectedValue(
        new Error("Appointment not found.")
      );

      const req = mockReq({ appointmentId }, {});
      const res = mockRes();

      await staffController.confirmAppointment(req, res as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ----------------------------------------------------------------------------------
  // rescheduleAppointment Tests
  // ----------------------------------------------------------------------------------

  describe("rescheduleAppointment", () => {
    const appointmentId = "60c728b7e2a9695624765432";
    const staffUserId = new Types.ObjectId("60c728b7e2a9695624760000");
    const newDoctorId = "60c728b7e2a9695624761111";
    const newDateStr = "2023-12-01T00:00:00.000Z";
    const newDate = new Date(newDateStr);
    const newTimeSlot = { start: "14:00", end: "15:00" };

    it("should reschedule and return 200 when all data is provided", async () => {
      const rescheduledApp = {
        _id: appointmentId,
        status: "Pending",
        appointmentDate: newDate,
      };
      mockedService.rescheduleAppointment.mockResolvedValue(
        rescheduledApp as any
      );

      const req = mockReq(
        { appointmentId },
        { newDoctorId, newAppointmentDate: newDateStr, newTimeSlot },
        { userId: staffUserId, role: "staff" }
      );
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(mockedService.rescheduleAppointment).toHaveBeenCalledWith(
        appointmentId,
        staffUserId,
        new Types.ObjectId(newDoctorId),
        newDate,
        newTimeSlot
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Appointment rescheduled successfully.",
        appointment: rescheduledApp,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should reschedule and return 200 when only new date is provided", async () => {
      const rescheduledApp = {
        _id: appointmentId,
        status: "Pending",
        appointmentDate: newDate,
      };
      mockedService.rescheduleAppointment.mockResolvedValue(
        rescheduledApp as any
      );

      const req = mockReq(
        { appointmentId },
        { newAppointmentDate: newDateStr },
        { userId: staffUserId, role: "staff" }
      );
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(mockedService.rescheduleAppointment).toHaveBeenCalledWith(
        appointmentId,
        staffUserId,
        undefined, // newDoctorId
        newDate, // newAppointmentDate
        undefined // newTimeSlot
      );
    });

    it("should return 401 if no staffId (user undefined)", async () => {
      const req = mockReq({ appointmentId }, {}, undefined);
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(mockedService.rescheduleAppointment).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid appointmentId format", async () => {
      const req = mockReq({ appointmentId: "invalid" }, {});
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid appointment ID.",
      });
    });

    it("should return 400 for invalid newDoctorId format", async () => {
      const req = mockReq({ appointmentId }, { newDoctorId: "invalid" });
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid new doctor ID.",
      });
    });

    it("should call next on service error", async () => {
      mockedService.rescheduleAppointment.mockRejectedValue(
        new Error("Doctor unavailable")
      );

      const req = mockReq({ appointmentId }, {});
      const res = mockRes();

      await staffController.rescheduleAppointment(
        req,
        res as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
