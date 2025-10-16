// __tests__/HealthcareReportService.test.ts
import { HealthcareReportService } from "../services/HealthcareReport.service";
import HealthcareReport from "../models/HealthcareReport.model";
import { IHealthcareReport } from "../interfaces/HealthcareReport";

jest.mock("../models/HealthcareReport.model"); // Mock the Mongoose model

describe("HealthcareReportService", () => {
  let service: HealthcareReportService;
  const mockReport: IHealthcareReport = {
    patientInfo: {
      patientName: "John Doe",
      patientId: "P12345",
      age: "45",
      gender: "Male",
      dateOfBirth: "1980-07-15",
      contactNumber: "+94712345678",
      address: "123 Main Street",
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
  };

  beforeEach(() => {
    service = new HealthcareReportService();
    jest.clearAllMocks();
  });

  it("should create a report", async () => {
    // Mock the save method
    (HealthcareReport as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockReport),
    }));

    const result = await service.createReport(mockReport);

    expect(result).toEqual(mockReport);
    expect(HealthcareReport).toHaveBeenCalledWith(mockReport);
  });

  it("should get all reports", async () => {
    (HealthcareReport.find as any).mockReturnValue({
      sort: jest.fn().mockReturnValue([mockReport]),
    });

    const result = await service.getAllReports();
    expect(result).toEqual([mockReport]);
    expect(HealthcareReport.find).toHaveBeenCalled();
  });

  it("should get a report by ID", async () => {
    (HealthcareReport.findById as any).mockResolvedValue(mockReport);

    const result = await service.getReportById("someId");
    expect(result).toEqual(mockReport);
    expect(HealthcareReport.findById).toHaveBeenCalledWith("someId");
  });

  it("should update a report", async () => {
    const updatedReport = { ...mockReport, reportDate: "2025-10-17" };
    (HealthcareReport.findByIdAndUpdate as any).mockResolvedValue(updatedReport);

    const result = await service.updateReport("someId", { reportDate: "2025-10-17" });
    expect(result).toEqual(updatedReport);
    expect(HealthcareReport.findByIdAndUpdate).toHaveBeenCalledWith(
      "someId",
      { reportDate: "2025-10-17" },
      { new: true }
    );
  });

  it("should delete a report", async () => {
    (HealthcareReport.findByIdAndDelete as any).mockResolvedValue(mockReport);

    const result = await service.deleteReport("someId");
    expect(result).toEqual(mockReport);
    expect(HealthcareReport.findByIdAndDelete).toHaveBeenCalledWith("someId");
  });

  it("should return null if report not found when getting by ID", async () => {
    (HealthcareReport.findById as any).mockResolvedValue(null);

    const result = await service.getReportById("invalidId");
    expect(result).toBeNull();
  });
});
