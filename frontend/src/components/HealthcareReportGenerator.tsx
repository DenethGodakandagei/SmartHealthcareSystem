"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PlusIcon, TrashIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const HealthcareReportGenerator = () => {
  const [patientInfo, setPatientInfo] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    address: "",
  });

  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    temperature: "",
    oxygenSaturation: "",
    height: "",
    weight: "",
  });

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [doctorInfo, setDoctorInfo] = useState({
    name: "",
    specialization: "",
    licenseNumber: "",
    signature: "",
  });

  const reportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

const handlePdfDownload = () => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 15; // Start below top margin

    const pageWidth = pdf.internal.pageSize.getWidth();

    // ---------------- HEADER ----------------
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Medical Report", pageWidth / 2, y, { align: "center" });
    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated on: ${reportDate}`, pageWidth / 2, y, { align: "center" });
    y += 12;

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(10, y, pageWidth - 10, y); // Horizontal line
    y += 6;

    // ---------------- PATIENT INFO ----------------
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Patient Information", 10, y);
    y += 6;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    Object.entries(patientInfo).forEach(([key, val]) => {
      pdf.text(`${key.replace(/([A-Z])/g, " $1")}: ${val || "-"}`, 10, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 15; }
    });
    y += 4;

    pdf.line(10, y, pageWidth - 10, y);
    y += 6;

    // ---------------- VITAL SIGNS ----------------
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Vital Signs", 10, y);
    y += 6;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    Object.entries(vitalSigns).forEach(([key, val]) => {
      pdf.text(`${key.replace(/([A-Z])/g, " $1")}: ${val || "-"}`, 10, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 15; }
    });
    y += 4;

    pdf.line(10, y, pageWidth - 10, y);
    y += 6;

    // ---------------- MEDICATIONS TABLE ----------------
    if (medications.some((m) => m.name)) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Medications", 10, y);
      y += 8;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");

      const medHeaders = ["Name", "Dosage", "Frequency", "Duration"];
      medHeaders.forEach((h, i) => pdf.text(h, 10 + i * 45, y));
      y += 6;
      pdf.setFont("helvetica", "normal");

      medications.forEach((m, index) => {
        if (m.name) {
          // Alternate row shading
          if (index % 2 === 0) {
            pdf.setFillColor(240, 240, 240);
            pdf.rect(10, y - 4, pageWidth - 20, 6, "F");
          }

          pdf.text(m.name, 10, y);
          pdf.text(m.dosage || "-", 55, y);
          pdf.text(m.frequency || "-", 100, y);
          pdf.text(m.duration || "-", 145, y);
          y += 6;
          if (y > 280) { pdf.addPage(); y = 15; }
        }
      });
      y += 4;
      pdf.line(10, y, pageWidth - 10, y);
      y += 6;
    }

    // ---------------- DOCTOR INFO ----------------
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Doctor Information", 10, y);
    y += 6;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    Object.entries(doctorInfo).forEach(([key, val]) => {
      pdf.text(`${key.replace(/([A-Z])/g, " $1")}: ${val || "-"}`, 10, y);
      y += 6;
      if (y > 280) { pdf.addPage(); y = 15; }
    });
    y += 15;

    // Signature line
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(10, y, 90, y);
    pdf.text("Doctor's Signature", 10, y + 5);

    // Save PDF
    pdf.save(`Medical_Report_${patientInfo.patientName}_${reportDate}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Check console for details.");
  }
};


  // Submit handler
  const handleSubmit = async () => {
    const payload = {
      patientInfo,
      vitalSigns,
      medications,
      doctorInfo,
      reportDate,
    };

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save report");
      alert("Report saved successfully!");
    } catch (error: any) {
      console.error("Error saving report:", error);
      alert(error.message || "Something went wrong!");
    }
  };

  // Medication Handlers
  const addMedication = () =>
    setMedications([
      ...medications,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  const removeMedication = (index: number) =>
    setMedications(medications.filter((_, i) => i !== index));
  const updateMedication = (
    index: number,
    field: "name" | "dosage" | "frequency" | "duration",
    value: string
  ) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Healthcare Report Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Patient Info */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={patientInfo.patientName}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, patientName: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Patient ID"
              value={patientInfo.patientId}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, patientId: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={patientInfo.age}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, age: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={patientInfo.gender}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, gender: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              value={patientInfo.dateOfBirth}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, dateOfBirth: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={patientInfo.contactNumber}
              onChange={(e) =>
                setPatientInfo({
                  ...patientInfo,
                  contactNumber: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Address"
              rows={2}
              value={patientInfo.address}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, address: e.target.value })
              }
              className="border p-2 rounded md:col-span-2"
            />
          </div>

          {/* Vital Signs */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Vital Signs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(vitalSigns).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                value={(vitalSigns as any)[key]}
                onChange={(e) =>
                  setVitalSigns({ ...vitalSigns, [key]: e.target.value })
                }
                className="border p-2 rounded"
              />
            ))}
          </div>

          {/* Medications */}
          <h2 className="text-xl font-semibold text-gray-800 flex justify-between items-center">
            Medications
            <button
              type="button"
              onClick={addMedication}
              className="text-blue-600 flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Add
            </button>
          </h2>
          {medications.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2"
            >
              {["name", "dosage", "frequency", "duration"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={(med as any)[field]}
                  onChange={(e) =>
                    updateMedication(index, field as any, e.target.value)
                  }
                  className="border p-2 rounded"
                />
              ))}
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-500"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Doctor Name"
              value={doctorInfo.name}
              onChange={(e) =>
                setDoctorInfo({ ...doctorInfo, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Specialization"
              value={doctorInfo.specialization}
              onChange={(e) =>
                setDoctorInfo({
                  ...doctorInfo,
                  specialization: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="License Number"
              value={doctorInfo.licenseNumber}
              onChange={(e) =>
                setDoctorInfo({
                  ...doctorInfo,
                  licenseNumber: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit Report
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Report Preview
          </h2>

          <div
              ref={reportRef}
              className="overflow-y-auto max-h-[800px] p-6 border border-gray-300 rounded-lg bg-white"
            >

            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-blue-700 pb-2">
              <h1 className="text-3xl font-bold text-blue-800">
                Medical Report
              </h1>
              <p className="text-gray-600 mt-1">Generated on: {reportDate}</p>
            </div>

            {/* Patient Info */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 border-b pb-1 mb-2">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(patientInfo).map(([key, val]) => (
                  <p key={key}>
                    <span className="font-semibold">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    {val || "-"}
                  </p>
                ))}
              </div>
            </div>

            {/* Vital Signs */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 border-b pb-1 mb-2">
                Vital Signs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
                {Object.entries(vitalSigns).map(([key, val]) => (
                  <p key={key}>
                    <span className="font-semibold">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    {val || "-"}
                  </p>
                ))}
              </div>
            </div>

            {/* Medications */}
            {medications.some((m) => m.name) && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-blue-700 border-b pb-1 mb-2">
                  Medications
                </h3>
                <table className="w-full border border-gray-300 text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Medication</th>
                      <th className="border p-2">Dosage</th>
                      <th className="border p-2">Frequency</th>
                      <th className="border p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map(
                      (m, idx) =>
                        m.name && (
                          <tr key={idx} className="border-t">
                            <td className="border p-2">{m.name}</td>
                            <td className="border p-2">{m.dosage || "-"}</td>
                            <td className="border p-2">{m.frequency || "-"}</td>
                            <td className="border p-2">{m.duration || "-"}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Doctor Info */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                Doctor Information
              </h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {doctorInfo.name || "-"}
              </p>
              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                {doctorInfo.specialization || "-"}
              </p>
              <p>
                <span className="font-semibold">License:</span>{" "}
                {doctorInfo.licenseNumber || "-"}
              </p>
              <div className="mt-4 flex justify-end">
                <div className="text-center">
                  <div className="h-16 border-b border-gray-400 w-40 mb-1"></div>
                  <p className="text-sm text-gray-600">Doctor's Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Below Preview */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handlePdfDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
            >
              <DownloadIcon className="w-4 h-4 mr-1" /> Save PDF
            </button>

            <button
              onClick={() => router.push("/medical/reportpage")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <EyeIcon className="w-4 h-4 mr-1" /> View All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
