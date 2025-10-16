"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrashIcon, EyeIcon, PencilIcon } from 'lucide-react'


interface Report {
  id: string
  patientName: string
  patientId: string
  reportDate: string
  doctorName: string
  summary: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])

  // Load saved reports from localStorage (or API in real app)
  useEffect(() => {
    const stored = localStorage.getItem('healthReports')
    if (stored) {
      setReports(JSON.parse(stored))
    }
  }, [])

  // Delete report
  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    const updated = reports.filter(r => r.id !== id)
    setReports(updated)
    localStorage.setItem('healthReports', JSON.stringify(updated))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">
        All Reports
      </h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500">No reports available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="px-4 py-2">Patient Name</th>
                <th className="px-4 py-2">Patient ID</th>
                <th className="px-4 py-2">Report Date</th>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="px-4 py-2">{report.patientName}</td>
                  <td className="px-4 py-2">{report.patientId}</td>
                  <td className="px-4 py-2">{report.reportDate}</td>
                  <td className="px-4 py-2">{report.doctorName}</td>
                  <td className="px-4 py-2 space-x-2 flex">
                    {/* View Button */}
                    <Link
                      href={`/reports/${report.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </Link>

                    {/* Edit Button */}
                    <Link
                      href={`/reports/edit/${report.id}`}
                      className="text-yellow-600 hover:text-yellow-800 flex items-center"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/medical"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Create New Report
        </Link>
      </div>
    </div>
  )
}
