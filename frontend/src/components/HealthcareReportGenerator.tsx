"use client";

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PlusIcon, TrashIcon, PrinterIcon, DownloadIcon } from "lucide-react";

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


  // PDF Download
  const handlePdfDownload = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`Medical_Report_${patientInfo.patientName}_${reportDate}.pdf`);
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    const payload = {
      patientInfo,
      vitalSigns,
      medications,
      doctorInfo,
      reportDate,
    };

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save report");
      alert("Report saved successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong!");
    }
  };

  // Medication Handlers
  const addMedication = () =>
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
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
                setPatientInfo({ ...patientInfo, contactNumber: e.target.value })
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
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
              {["name", "dosage", "frequency", "duration"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={(med as any)[field]}
                  onChange={(e) => updateMedication(index, field as any, e.target.value)}
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

          {/* Report Date & Doctor Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Specialization"
              value={doctorInfo.specialization}
              onChange={(e) =>
                setDoctorInfo({ ...doctorInfo, specialization: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="License Number"
              value={doctorInfo.licenseNumber}
              onChange={(e) =>
                setDoctorInfo({ ...doctorInfo, licenseNumber: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>

          {/* Submit / PDF Buttons */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Submit
            </button>
          
            <button
              onClick={handlePdfDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
            >
              <DownloadIcon className="w-4 h-4 mr-1" />
              Save PDF
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Report Preview
          </h2>
          <div
            className="overflow-y-auto max-h-[800px] p-6 border border-gray-300 rounded-lg bg-gray-50"
            ref={reportRef}
          >
            {/* Header */}
            <div className="text-center mb-6 border-b-2 border-blue-700 pb-2">
              <h1 className="text-3xl font-bold text-blue-800">Medical Report</h1>
              <p className="text-gray-600 mt-1">Generated on: {reportDate}</p>
            </div>

            {/* Patient Information */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 border-b pb-1 mb-2">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p><span className="font-semibold">Name:</span> {patientInfo.patientName || '-'}</p>
                <p><span className="font-semibold">Patient ID:</span> {patientInfo.patientId || '-'}</p>
                <p><span className="font-semibold">Age:</span> {patientInfo.age || '-'}</p>
                <p><span className="font-semibold">Gender:</span> {patientInfo.gender || '-'}</p>
                <p><span className="font-semibold">DOB:</span> {patientInfo.dateOfBirth || '-'}</p>
                <p><span className="font-semibold">Contact:</span> {patientInfo.contactNumber || '-'}</p>
                <p className="col-span-2"><span className="font-semibold">Address:</span> {patientInfo.address || '-'}</p>
              </div>
            </div>

            {/* Vital Signs */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 border-b pb-1 mb-2">
                Vital Signs
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-700">
                {Object.entries(vitalSigns).map(([key, val]) => (
                  <p key={key}>
                    <span className="font-semibold">{key.replace(/([A-Z])/g, ' $1')}:</span> {val || '-'}
                  </p>
                ))}
                {vitalSigns.height && vitalSigns.weight && (
                  <p>
                    <span className="font-semibold">BMI:</span>{" "}
                    {(
                      parseFloat(vitalSigns.weight) /
                      (parseFloat(vitalSigns.height) / 100) ** 2
                    ).toFixed(1)}
                  </p>
                )}
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
                            <td className="border p-2">{m.dosage || '-'}</td>
                            <td className="border p-2">{m.frequency || '-'}</td>
                            <td className="border p-2">{m.duration || '-'}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Doctor Info */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Doctor Information</h3>
              <p><span className="font-semibold">Name:</span> {doctorInfo.name || '-'}</p>
              <p><span className="font-semibold">Specialization:</span> {doctorInfo.specialization || '-'}</p>
              <p><span className="font-semibold">License:</span> {doctorInfo.licenseNumber || '-'}</p>
              <div className="mt-4 flex justify-between items-center">
                <div></div>
                <div className="text-center">
                  <div className="h-16 border-b border-gray-400 w-40 mb-1"></div>
                  <p className="text-sm text-gray-600">Doctor's Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
