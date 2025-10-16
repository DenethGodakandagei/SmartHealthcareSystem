"use client"

import React, { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import html2canvas from "html2canvas";

import { jsPDF } from 'jspdf'
import {
  PlusIcon,
  TrashIcon,
  PrinterIcon,
  DownloadIcon,
  Link,
} from 'lucide-react'

export const HealthcareReportGenerator = () => {
  const [patientInfo, setPatientInfo] = useState({
    patientName: '',
    patientId: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    address: '',
  })
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    height: '',
    weight: '',
  })
  const [diagnosis, setDiagnosis] = useState({
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    icdCode: '',
    notes: '',
  })
  const [medications, setMedications] = useState([
    {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    },
  ])
  const [labResults, setLabResults] = useState([
    {
      test: '',
      result: '',
      normalRange: '',
      interpretation: '',
    },
  ])
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    specialization: '',
    licenseNumber: '',
    signature: '',
  })
  
 const reportRef = useRef<HTMLDivElement>(null)

const handlePrint = useReactToPrint({
  // @ts-ignore — if TS still complains
  content: () => reportRef.current,
  documentTitle: `Medical_Report_${patientInfo.patientName}_${reportDate}`,
})


  // PDF Download

const handlePdfDownload = async () => {
  if (reportRef.current) {
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Medical_Report_${patientInfo.patientName}_${reportDate}.pdf`);
  }
};

   // Medications handlers
  const addMedication = () =>
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }])
  const removeMedication = (index: number) =>
    setMedications(medications.filter((_, i) => i !== index))
  const updateMedication = (
    index: number,
    field: "name" | "dosage" | "frequency" | "duration",
    value: string
  ) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

// Lab Results handlers
  const addLabResult = () =>
    setLabResults([...labResults, { test: "", result: "", normalRange: "", interpretation: "" }])
  const removeLabResult = (index: number) =>
    setLabResults(labResults.filter((_, i) => i !== index))
  const updateLabResult = (
    index: number,
    field: "test" | "result" | "normalRange" | "interpretation",
    value: string
  ) => {
    const updated = [...labResults]
    updated[index][field] = value
    setLabResults(updated)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">
        Healthcare Report Generator
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Report Information
          </h2>
          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-600 mb-3">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.patientName}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      patientName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.patientId}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      patientId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.age}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      age: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.gender}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.dateOfBirth}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      dateOfBirth: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={patientInfo.contactNumber}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      contactNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                  value={patientInfo.address}
                  onChange={(e) =>
                    setPatientInfo({
                      ...patientInfo,
                      address: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>
          </div>
          {/* Vital Signs */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-600 mb-3">
              Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="120/80"
                  value={vitalSigns.bloodPressure}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      bloodPressure: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.heartRate}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      heartRate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.respiratoryRate}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      respiratoryRate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.temperature}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      temperature: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.oxygenSaturation}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      oxygenSaturation: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.height}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      height: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={vitalSigns.weight}
                  onChange={(e) =>
                    setVitalSigns({
                      ...vitalSigns,
                      weight: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Lab Results */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-blue-600">Lab Results</h3>
              <button
                type="button"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                onClick={addLabResult}
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Lab Result
              </button>
            </div>
            {labResults.map((lab, index) => (
              <div
                key={index}
                className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Lab Result #{index + 1}
                  </h4>
                  {labResults.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeLabResult(index)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Test Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={lab.test}
                      onChange={(e) =>
                        updateLabResult(index, 'test', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Result
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={lab.result}
                      onChange={(e) =>
                        updateLabResult(index, 'result', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Normal Range
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={lab.normalRange}
                      onChange={(e) =>
                        updateLabResult(index, 'normalRange', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Interpretation
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={lab.interpretation}
                      onChange={(e) =>
                        updateLabResult(index, 'interpretation', e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="Normal">Normal</option>
                      <option value="Abnormal - Low">Abnormal - Low</option>
                      <option value="Abnormal - High">Abnormal - High</option>
                      <option value="Inconclusive">Inconclusive</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Report Date and Doctor Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-600 mb-3">
              Report Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor's Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={doctorInfo.name}
                  onChange={(e) =>
                    setDoctorInfo({
                      ...doctorInfo,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={doctorInfo.specialization}
                  onChange={(e) =>
                    setDoctorInfo({
                      ...doctorInfo,
                      specialization: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={doctorInfo.licenseNumber}
                  onChange={(e) =>
                    setDoctorInfo({
                      ...doctorInfo,
                      licenseNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* Preview Section */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Report Preview
              </h2>
                
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  <PrinterIcon className="w-4 h-4 mr-1" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={handlePdfDownload}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  Save PDF
                </button>
                
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 max-h-[800px] overflow-y-auto">
              <div ref={reportRef} className="p-4 bg-white">


                
                {/* Report Header */}
                <div className="text-center mb-6 pb-4 border-b-2 border-blue-700">
                  <h1 className="text-2xl font-bold text-blue-800">
                    Medical Report
                  </h1>
                  <p className="text-gray-500">Generated on: {reportDate}</p>
                </div>
                {/* Patient Information */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2 pb-1 border-b">
                    Patient Information
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Name:</p>
                      <p className="font-medium">
                        {patientInfo.patientName || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Patient ID:</p>
                      <p className="font-medium">
                        {patientInfo.patientId || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Age:</p>
                      <p className="font-medium">
                        {patientInfo.age || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender:</p>
                      <p className="font-medium">
                        {patientInfo.gender || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth:</p>
                      <p className="font-medium">
                        {patientInfo.dateOfBirth || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact:</p>
                      <p className="font-medium">
                        {patientInfo.contactNumber || 'Not specified'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Address:</p>
                      <p className="font-medium">
                        {patientInfo.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Vital Signs */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2 pb-1 border-b">
                    Vital Signs
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure:</p>
                      <p className="font-medium">
                        {vitalSigns.bloodPressure || 'Not recorded'} mmHg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Heart Rate:</p>
                      <p className="font-medium">
                        {vitalSigns.heartRate || 'Not recorded'} bpm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Respiratory Rate:</p>
                      <p className="font-medium">
                        {vitalSigns.respiratoryRate || 'Not recorded'}{' '}
                        breaths/min
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Temperature:</p>
                      <p className="font-medium">
                        {vitalSigns.temperature || 'Not recorded'} °C
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Oxygen Saturation:
                      </p>
                      <p className="font-medium">
                        {vitalSigns.oxygenSaturation || 'Not recorded'} %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">BMI:</p>
                      <p className="font-medium">
                        {vitalSigns.height && vitalSigns.weight
                          ? (
                              parseFloat(vitalSigns.weight) /
                              (parseFloat(vitalSigns.height) / 100) ** 2
                            ).toFixed(1)
                          : 'Not calculated'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Height:</p>
                      <p className="font-medium">
                        {vitalSigns.height || 'Not recorded'} cm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight:</p>
                      <p className="font-medium">
                        {vitalSigns.weight || 'Not recorded'} kg
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Medications */}
                {medications.some((med) => med.name) && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2 pb-1 border-b">
                      Medications
                    </h2>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2">Medication</th>
                          <th className="text-left p-2">Dosage</th>
                          <th className="text-left p-2">Frequency</th>
                          <th className="text-left p-2">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map(
                          (med, index) =>
                            med.name && (
                              <tr key={index} className="border-t">
                                <td className="p-2">{med.name}</td>
                                <td className="p-2">{med.dosage || '-'}</td>
                                <td className="p-2">{med.frequency || '-'}</td>
                                <td className="p-2">{med.duration || '-'}</td>
                              </tr>
                            ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
             {/* Lab Results */}
                {labResults.some(l => l.test) && (
                    <div className="border border-gray-300 rounded-md p-4">
                    <h2 className="text-lg font-semibold text-blue-600 mb-3">Laboratory Results</h2>
                    {labResults.map((lab, idx) =>
                        lab.test ? (
                        <div key={idx} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                            <label className="block text-xs font-medium text-gray-700">Test</label>
                            <p className="mt-1 text-gray-900">{lab.test}</p>
                            </div>
                            <div>
                            <label className="block text-xs font-medium text-gray-700">Result</label>
                            <p className="mt-1 text-gray-900">{lab.result || '-'}</p>
                            </div>
                            <div>
                            <label className="block text-xs font-medium text-gray-700">Normal Range</label>
                            <p className="mt-1 text-gray-900">{lab.normalRange || '-'}</p>
                            </div>
                            <div>
                            <label className="block text-xs font-medium text-gray-700">Interpretation</label>
                            <p className={`mt-1 font-medium ${
                                lab.interpretation === 'Normal' ? 'text-green-600' :
                                lab.interpretation === 'Abnormal - Low' ? 'text-yellow-600' :
                                lab.interpretation === 'Abnormal - High' ? 'text-red-600' :
                                'text-gray-600'
                            }`}>
                                {lab.interpretation || '-'}
                            </p>
                            </div>
                        </div>
                        ) : null
                    )}
                    </div>
                )}
                {/* Doctor Information and Signature */}
                <div className="mt-10 pt-6 border-t">
                  <div className="flex justify-between">
                    <div>
                      {doctorInfo.name && (
                        <div className="mb-1">
                          <p className="font-semibold">{doctorInfo.name}</p>
                          {doctorInfo.specialization && (
                            <p className="text-sm text-gray-600">
                              {doctorInfo.specialization}
                            </p>
                          )}
                          {doctorInfo.licenseNumber && (
                            <p className="text-sm text-gray-600">
                              License: {doctorInfo.licenseNumber}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="h-16 border-b border-gray-400 w-40 mb-1">
                        {/* Space for signature */}
                      </div>
                      <p className="text-sm text-gray-600">
                        Doctor's Signature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
