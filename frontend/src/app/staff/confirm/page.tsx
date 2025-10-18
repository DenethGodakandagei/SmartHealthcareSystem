"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmAppointment } from "../api/confirmAppointment";

export default function ConfirmPage() {
  const params = useSearchParams();
  const router = useRouter();
  const appointmentId = params.get("appointmentId") || "";
  const [selectedNote, setSelectedNote] = useState("");

  // Define options with label + color
  const quickOptions = [
    // { label: "Pending", color: "yellow" },
    { label: "Confirmed", color: "green" },
    // { label: "Completed", color: "blue" },
    // { label: "Cancelled", color: "red" },
  ];

  async function handleConfirm() {
    if (!selectedNote) {
      alert("Please select a confirmation note.");
      return;
    }

    try {
      await confirmAppointment(appointmentId, selectedNote);
      alert(`Appointment marked as "${selectedNote}"`);
      router.push("/staff");
    } catch (error) {
      console.error(error);
      alert("Error confirming appointment.");
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">
        Update Appointment Status
      </h1>

      <div className="space-y-3 mb-4">
        {quickOptions.map((option) => {
          const isSelected = selectedNote === option.label;

          const colorMap: Record<string, string> = {
            yellow: "border-yellow-500 bg-yellow-50 hover:bg-yellow-100",
            green: "border-green-600 bg-green-50 hover:bg-green-100",
            blue: "border-blue-600 bg-blue-50 hover:bg-blue-100",
            red: "border-red-600 bg-red-50 hover:bg-red-100",
          };

          const accentMap: Record<string, string> = {
            yellow: "accent-yellow-500",
            green: "accent-green-600",
            blue: "accent-blue-600",
            red: "accent-red-600",
          };

          return (
            <label
              key={option.label}
              className={`flex items-center p-3 border rounded-md cursor-pointer transition ${
                isSelected ? colorMap[option.color] : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="confirmationNote"
                value={option.label}
                checked={isSelected}
                onChange={() => setSelectedNote(option.label)}
                className={`mr-3 w-5 h-5 cursor-pointer ${
                  accentMap[option.color]
                }`}
              />
              <span className="font-medium text-gray-800">{option.label}</span>
            </label>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md w-full cursor-pointer"
      >
        Save Status
      </button>
    </div>
  );
}
