// src/tests/record.service.test.ts

import RecordService from "../services/record.service";
import Record from "../models/record.model";
import { Types } from "mongoose";

// Mock the Mongoose model and its methods
jest.mock("../models/record.model", () => {
    // Mock for a chainable query object
    const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        then: jest.fn(),
    };

    // Mock for a Record instance
    const mockInstance = {
        save: jest.fn(),
    };

    // Mock for the Record model class with its static methods
    const RecordModelMock = jest.fn(() => mockInstance);
    Object.assign(RecordModelMock, {
        find: jest.fn(() => mockQuery),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    });

    return {
        __esModule: true,
        default: RecordModelMock,
    };
});

// Mock mongoose.Types.ObjectId.isValid for all tests
jest.mock("mongoose", () => {
    const actualMongoose = jest.requireActual("mongoose");
    const mockObjectId = jest.fn((id: string) => ({ toString: () => id }));
    Object.assign(mockObjectId, {
        isValid: jest.fn((id) => id.includes('mock')),
    });
    return {
        ...actualMongoose,
        Types: {
            ...actualMongoose.Types,
            ObjectId: mockObjectId,
        },
    };
});

const mockedRecord = jest.mocked(Record);

describe("RecordService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("getAllRecords returns all records", async () => {
        const mockData = [{ _id: "1", treatment: { diagnosis: "Test" } }];
        (mockedRecord.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            then: jest.fn().mockResolvedValue(mockData),
        });

        const result = await RecordService.getAllRecords();
        expect(result).toEqual(mockData);
        expect(mockedRecord.find).toHaveBeenCalled();
    });

    it("getRecordsByPatient returns records for a patient", async () => {
        // Mock isValid for this specific test case.
        (Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

        const patientId = "mockPatientId123";
        const mockData = [{ _id: "1", patientId }];
        (mockedRecord.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            then: jest.fn().mockResolvedValue(mockData),
        });

        const result = await RecordService.getRecordsByPatient(patientId);
        expect(result).toEqual(mockData);
        expect(mockedRecord.find).toHaveBeenCalledWith({ patientId: new Types.ObjectId(patientId) });
    });

    it("addRecord creates a new record", async () => {
        // Mock isValid for this specific test case.
        (Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

        const newRecordData = {
            patientId: "mockPatientId123",
            doctorId: "mockDoctorId456",
            appointmentId: "mockAppointmentId789",
            treatment: {
                diagnosis: "Flu",
                notes: "Patient is recovering well",
                procedures: "General check-up",
            },
            prescription: {
                name: "Ibuprofen",
                dosage: "200mg",
                frequency: "1x daily",
                duration: "5 days",
            },
        };
        const mockRecord = { _id: "newRecordId", ...newRecordData };

        const mockInstance = {
            save: jest.fn().mockResolvedValue(mockRecord),
        };
        (mockedRecord as unknown as jest.Mock).mockReturnValue(mockInstance);

        const result = await RecordService.addRecord(newRecordData);
        expect(result).toEqual(mockRecord);
        expect(mockedRecord).toHaveBeenCalledWith(expect.objectContaining({
            patientId: expect.any(Types.ObjectId),
            doctorId: expect.any(Types.ObjectId),
            appointmentId: expect.any(Types.ObjectId),
        }));
    });

    it("updateRecord updates record if exists", async () => {
        // Mock isValid for this specific test case.
        (Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

        const recordId = "mockRecordId123";
        const updateData = {
            treatment: {
                diagnosis: "Updated Diagnosis",
                notes: "Updated notes",
                procedures: "Updated procedures",
            },
        };
        const updatedRecord = { _id: recordId, ...updateData };

        (mockedRecord.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedRecord);

        const result = await RecordService.updateRecord(recordId, updateData as any);
        expect(result).toEqual(updatedRecord);
        expect(mockedRecord.findByIdAndUpdate).toHaveBeenCalledWith(recordId, expect.anything(), { new: true });
    });

    it("deleteRecord deletes a record", async () => {
        // Mock isValid for this specific test case.
        (Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

        const recordId = "mockRecordId123";
        const deletedRecord = { _id: recordId };
        (mockedRecord.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedRecord);

        const result = await RecordService.deleteRecord(recordId);
        expect(result).toEqual({ message: "Record deleted successfully" });
        expect(mockedRecord.findByIdAndDelete).toHaveBeenCalledWith(recordId);
    });
});