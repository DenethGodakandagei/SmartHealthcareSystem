import { HealthcareReportController } from "../controllers/HealthcareReport.controller.js";
import { HealthcareReportService } from "../services/HealthcareReport.service.js";

// Mock the Service class
jest.mock("../services/HealthcareReport.service");

describe("HealthcareReportController", () => {
  let controller: HealthcareReportController;
  let mockService: jest.Mocked<HealthcareReportService>;
  let mockReq: any;
  let mockRes: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  const mockReport: any = {
    _id: "6710a4f34f8e0a2c9e17b312",
    patientInfo: {
      patientName: "John Doe",
      patientId: "P12345",
      age: "45",
      gender: "Male",
      dateOfBirth: "1980-07-15",
      contactNumber: "+94712345678",
      address: "123 Main Street, Colombo, Sri Lanka",
    },
    vitalSigns: {
      bloodPressure: "120/80",
      heartRate: "72",
      respiratoryRate: "16",
      temperature: "36.6",
      oxygenSaturation: "98",
      height: "175",
      weight: "70",
    },
    medications: [],
    doctorInfo: {
      name: "Dr. Jane Smith",
      specialization: "General Physician",
      licenseNumber: "DOC-123456",
      signature: "DrJaneSignature.png",
    },
    reportDate: "2025-10-16",
    createdAt: "2025-10-16T12:34:56.789Z",
  };

  beforeEach(() => {
    mockService =
      new HealthcareReportService() as jest.Mocked<HealthcareReportService>;
    mockService.createReport = jest.fn();
    mockService.getAllReports = jest.fn();
    mockService.getReportById = jest.fn();
    mockService.updateReport = jest.fn();
    mockService.deleteReport = jest.fn();

    controller = new HealthcareReportController(mockService);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = { status: statusMock, json: jsonMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a report successfully", async () => {
    mockReq = { body: mockReport };
    mockService.createReport.mockResolvedValueOnce(mockReport);

    await controller.createReport(mockReq, mockRes);

    expect(mockService.createReport).toHaveBeenCalledWith(mockReport);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(mockReport);
  });

  it("should handle error when creating a report", async () => {
    mockReq = { body: mockReport };
    mockService.createReport.mockRejectedValueOnce(new Error("DB error"));

    await controller.createReport(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Failed to create report",
      details: expect.any(Error),
    });
  });

  it("should get all reports", async () => {
    mockService.getAllReports.mockResolvedValueOnce([mockReport]);

    await controller.getAllReports({} as any, mockRes);

    expect(mockService.getAllReports).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith([mockReport]);
  });

  it("should get report by ID", async () => {
    mockReq = { params: { id: mockReport._id } };
    mockService.getReportById.mockResolvedValueOnce(mockReport);

    await controller.getReportById(mockReq, mockRes);

    expect(mockService.getReportById).toHaveBeenCalledWith(mockReport._id);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockReport);
  });

  it("should return 404 if report not found", async () => {
    mockReq = { params: { id: "invalidId" } };
    mockService.getReportById.mockResolvedValueOnce(null);

    await controller.getReportById(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Report not found" });
  });

  it("should update a report successfully", async () => {
    mockReq = {
      params: { id: mockReport._id },
      body: { reportDate: "2025-10-17" },
    };
    const updatedReport = { ...mockReport, reportDate: "2025-10-17" };
    mockService.updateReport.mockResolvedValueOnce(updatedReport);

    await controller.updateReport(mockReq, mockRes);

    expect(mockService.updateReport).toHaveBeenCalledWith(mockReport._id, {
      reportDate: "2025-10-17",
    });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(updatedReport);
  });

  it("should return 404 if updating non-existent report", async () => {
    mockReq = { params: { id: "invalidId" }, body: {} };
    mockService.updateReport.mockResolvedValueOnce(null);

    await controller.updateReport(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Report not found" });
  });

  it("should delete a report successfully", async () => {
    mockReq = { params: { id: mockReport._id } };
    mockService.deleteReport.mockResolvedValueOnce(mockReport);

    await controller.deleteReport(mockReq, mockRes);

    expect(mockService.deleteReport).toHaveBeenCalledWith(mockReport._id);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Report deleted successfully",
    });
  });

  it("should return 404 if deleting non-existent report", async () => {
    mockReq = { params: { id: "invalidId" } };
    mockService.deleteReport.mockResolvedValueOnce(null);

    await controller.deleteReport(mockReq, mockRes);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Report not found" });
  });
});
