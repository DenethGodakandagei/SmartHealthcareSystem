"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrashIcon, EyeIcon, PencilIcon, X } from "lucide-react";

type Medication = { name: string; dosage?: string; frequency?: string; duration?: string };
type PatientInfo = { patientName: string; patientId: string; age?: string; gender?: string; dateOfBirth?: string; contactNumber?: string; address?: string };
type DoctorInfo = { name: string; specialization?: string; licenseNumber?: string; signature?: string };
type VitalSigns = { bloodPressure?: string; heartRate?: string; respiratoryRate?: string; temperature?: string; oxygenSaturation?: string; height?: string; weight?: string };

interface Report {
  _id: string;
  patientInfo: PatientInfo;
  vitalSigns?: VitalSigns;
  medications?: Medication[];
  doctorInfo?: DoctorInfo;
  reportDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View modal
  const [viewing, setViewing] = useState<Report | null>(null);

  // Edit modal
  const [editing, setEditing] = useState<Report | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/reports`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch reports");
      }
      const data = await res.json();
      setReports(data);
    } catch (err: any) {
      console.error("fetchReports error:", err);
      setError(err.message || "Unable to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Delete a report
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to delete");
      }
      setReports((p) => p.filter((r) => r._id !== id));
      alert("Report deleted");
    } catch (err: any) {
      console.error("delete error:", err);
      alert(err.message || "Delete failed");
    }
  };

  // Open edit modal (clone object so editing is local)
  const openEdit = (report: Report) => {
    setEditing(JSON.parse(JSON.stringify(report)));
  };

  // Save edited report (PUT)
  const saveEdit = async () => {
    if (!editing) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports/${editing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to update");
      }
      const updated = await res.json();
      // replace in state
      setReports((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setEditing(null);
      alert("Report updated");
    } catch (err: any) {
      console.error("update error:", err);
      alert(err.message || "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  // Helper to update nested editing fields
  const updateEditingField = (path: string, value: any) => {
    if (!editing) return;
    const copy = { ...editing } as any;
    const keys = path.split(".");
    let cur = copy;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!cur[k]) cur[k] = {};
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
    setEditing(copy);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-6">All Healthcare Reports</h1>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        <Link href="/medical" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Create New Report</Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading reports...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">{error}</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No reports found.</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left">Patient Name</th>
                <th className="px-4 py-3 text-left">Patient ID</th>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">Report Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{r.patientInfo?.patientName || "-"}</td>
                  <td className="px-4 py-3">{r.patientInfo?.patientId || "-"}</td>
                  <td className="px-4 py-3">{r.doctorInfo?.name || "-"}</td>
                  <td className="px-4 py-3">{r.reportDate || (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-")}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setViewing(r)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      View
                    </button>

                    <button
                      onClick={() => openEdit(r)}
                      className="flex items-center text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="flex items-center text-red-600 hover:text-red-800"
                      title="Delete"
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

      {/* --- View Modal --- */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-auto max-h-[90vh] p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Report — {viewing.patientInfo?.patientName}</h2>
              <button onClick={() => setViewing(null)} className="text-gray-600 hover:text-gray-800"><X /></button>
            </div>

            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Patient</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Name:</span> {viewing.patientInfo.patientName}</div>
                <div><span className="font-medium">ID:</span> {viewing.patientInfo.patientId}</div>
                <div><span className="font-medium">Age:</span> {viewing.patientInfo.age || "-"}</div>
                <div><span className="font-medium">Gender:</span> {viewing.patientInfo.gender || "-"}</div>
                <div className="col-span-2"><span className="font-medium">Address:</span> {viewing.patientInfo.address || "-"}</div>
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Vital Signs</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                {Object.entries(viewing.vitalSigns || {}).length === 0 ? <div className="col-span-4 text-sm text-gray-500">No vital signs</div> :
                  Object.entries(viewing.vitalSigns || {}).map(([k, v]) => <div key={k}><span className="font-medium">{k}:</span> {v || "-"}</div>)
                }
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Medications</h3>
              {viewing.medications && viewing.medications.length > 0 ? (
                <ul className="list-disc pl-5 text-sm">
                  {viewing.medications.map((m, i) => (<li key={i}>{m.name} — {m.dosage || "-"} {m.frequency ? `(${m.frequency})` : ""}</li>))}
                </ul>
              ) : <div className="text-sm text-gray-500">No medications</div>}
            </section>

            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Doctor</h3>
              <div className="text-sm">
                <div><span className="font-medium">Name:</span> {viewing.doctorInfo?.name || "-"}</div>
                <div><span className="font-medium">Specialization:</span> {viewing.doctorInfo?.specialization || "-"}</div>
                <div><span className="font-medium">License:</span> {viewing.doctorInfo?.licenseNumber || "-"}</div>
              </div>
            </section>

            <div className="flex justify-end gap-2">
              <button onClick={() => { setViewing(null); }} className="px-3 py-1 bg-gray-100 rounded">Close</button>
              <Link href={`/reports/edit/${viewing._id}`} className="px-3 py-1 bg-blue-600 text-white rounded">Open full editor</Link>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal (inline edit) --- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full shadow-lg overflow-auto max-h-[90vh] p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Edit Report — {editing.patientInfo.patientName}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-600 hover:text-gray-800"><X /></button>
            </div>

            {/* Patient fields */}
            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Patient</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input className="border p-2 rounded" value={editing.patientInfo.patientName} onChange={(e) => updateEditingField("patientInfo.patientName", e.target.value)} />
                <input className="border p-2 rounded" value={editing.patientInfo.patientId} onChange={(e) => updateEditingField("patientInfo.patientId", e.target.value)} />
                <input className="border p-2 rounded" value={editing.patientInfo.age || ""} onChange={(e) => updateEditingField("patientInfo.age", e.target.value)} />
                <input className="border p-2 rounded" value={editing.patientInfo.gender || ""} onChange={(e) => updateEditingField("patientInfo.gender", e.target.value)} />
                <input className="border p-2 rounded md:col-span-2" value={editing.patientInfo.address || ""} onChange={(e) => updateEditingField("patientInfo.address", e.target.value)} />
              </div>
            </section>

            {/* Doctor */}
            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input className="border p-2 rounded" value={editing.doctorInfo?.name || ""} onChange={(e) => updateEditingField("doctorInfo.name", e.target.value)} />
                <input className="border p-2 rounded" value={editing.doctorInfo?.specialization || ""} onChange={(e) => updateEditingField("doctorInfo.specialization", e.target.value)} />
                <input className="border p-2 rounded" value={editing.doctorInfo?.licenseNumber || ""} onChange={(e) => updateEditingField("doctorInfo.licenseNumber", e.target.value)} />
              </div>
            </section>

            {/* Report date */}
            <section className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Date</label>
              <input type="date" className="border p-2 rounded" value={editing.reportDate || ""} onChange={(e) => updateEditingField("reportDate", e.target.value)} />
            </section>

            {/* Example: medications (simple text list editor) */}
            <section className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Medications</h3>
              <div className="space-y-2">
                {(editing.medications || []).map((m, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2">
                    <input className="border p-2 rounded col-span-1" value={m.name} onChange={(e) => {
                      const meds = [...(editing.medications || [])];
                      meds[idx] = { ...meds[idx], name: e.target.value };
                      updateEditingField("medications", meds);
                    }} />
                    <input className="border p-2 rounded" value={m.dosage || ""} onChange={(e) => {
                      const meds = [...(editing.medications || [])];
                      meds[idx] = { ...meds[idx], dosage: e.target.value };
                      updateEditingField("medications", meds);
                    }} />
                    <input className="border p-2 rounded" value={m.frequency || ""} onChange={(e) => {
                      const meds = [...(editing.medications || [])];
                      meds[idx] = { ...meds[idx], frequency: e.target.value };
                      updateEditingField("medications", meds);
                    }} />
                    <input className="border p-2 rounded" value={m.duration || ""} onChange={(e) => {
                      const meds = [...(editing.medications || [])];
                      meds[idx] = { ...meds[idx], duration: e.target.value };
                      updateEditingField("medications", meds);
                    }} />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => {
                    const meds = [...(editing.medications || []), { name: "", dosage: "", frequency: "", duration: "" }];
                    updateEditingField("medications", meds);
                  }}>Add</button>
                  <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => {
                    const meds = (editing.medications || []).slice(0, -1);
                    updateEditingField("medications", meds);
                  }}>Remove Last</button>
                </div>
              </div>
            </section>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
              <button disabled={editSaving} onClick={saveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">
                {editSaving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
