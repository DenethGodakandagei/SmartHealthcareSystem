import { Request, Response } from "express";
import RecordService from "../services/record.service";
import {
  getAllRecords,
  getRecordsByPatient,
  addRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/record.controller";
import { Types } from "mongoose";

// Mock the RecordService
jest.mock("../services/record.service");

describe("Record Controller", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAllRecords", () => {
    it("should return all records", async () => {
      const mockRecords = [{ _id: "1", treatment: { diagnosis: "Test" } }];
      (RecordService.getAllRecords as jest.Mock).mockResolvedValueOnce(mockRecords);

      await getAllRecords({} as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecords);
    });

    it("should handle errors", async () => {
      (RecordService.getAllRecords as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await getAllRecords({} as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching records",
        error: "DB error",
      });
    });
  });

  describe("getRecordsByPatient", () => {
    it("should return records for a patient", async () => {
      const patientId = new Types.ObjectId().toString();
      const mockRecords = [{ _id: "1", treatment: { diagnosis: "Test" } }];
      (RecordService.getRecordsByPatient as jest.Mock).mockResolvedValueOnce(mockRecords);

      await getRecordsByPatient({ params: { patientId } } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockRecords);
    });

    it("should handle errors", async () => {
      const patientId = new Types.ObjectId().toString();
      (RecordService.getRecordsByPatient as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await getRecordsByPatient({ params: { patientId } } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error fetching records",
        error: "DB error",
      });
    });
  });

  describe("addRecord", () => {
    it("should add a new record", async () => {
      const mockRecord = { _id: "1", treatment: { diagnosis: "Test" } };
      (RecordService.addRecord as jest.Mock).mockResolvedValueOnce(mockRecord);

      const reqBody = { patientId: "1", doctorId: "2", appointmentId: "3", treatment: { diagnosis: "Test", notes: "", procedures: "" }, prescription: { name: "Med", dosage: "1", frequency: "1x", duration: "1d" } };
      await addRecord({ body: reqBody } as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Record added successfully",
        record: mockRecord,
      });
    });

    it("should handle errors", async () => {
      (RecordService.addRecord as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await addRecord({ body: {} } as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error adding record",
        error: "DB error",
      });
    });
  });

  describe("updateRecord", () => {
    it("should update a record", async () => {
      const mockRecord = { _id: "1", treatment: { diagnosis: "Updated" } };
      (RecordService.updateRecord as jest.Mock).mockResolvedValueOnce(mockRecord);

      await updateRecord({ params: { id: "1" }, body: { treatment: { diagnosis: "Updated", notes: "", procedures: "" } } } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Record updated successfully",
        record: mockRecord,
      });
    });

    it("should return 404 if record not found", async () => {
      (RecordService.updateRecord as jest.Mock).mockResolvedValueOnce(null);

      await updateRecord({ params: { id: "1" }, body: {} } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Record not found" });
    });

    it("should handle errors", async () => {
      (RecordService.updateRecord as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await updateRecord({ params: { id: "1" }, body: {} } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error updating record",
        error: "DB error",
      });
    });
  });

  describe("deleteRecord", () => {
    it("should delete a record", async () => {
      const mockResult = { message: "Record deleted successfully" };
      (RecordService.deleteRecord as jest.Mock).mockResolvedValueOnce(mockResult);

      await deleteRecord({ params: { id: "1" } } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle errors", async () => {
      (RecordService.deleteRecord as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

      await deleteRecord({ params: { id: "1" } } as unknown as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error deleting record",
        error: "DB error",
      });
    });
  });
});
