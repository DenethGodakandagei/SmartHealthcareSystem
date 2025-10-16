import React from 'react'
import { CalendarIcon, UsersIcon, ActivityIcon, ClipboardIcon } from 'lucide-react'
export default function DashboardOverview() {
  const upcomingAppointments = [
    { id: 1, date: '10/24/2023', time: '09:00 AM - 09:30 AM', patient: 'Jane Smith', status: 'Confirmed' },
    { id: 2, date: '10/24/2023', time: '10:15 AM - 10:45 AM', patient: 'Michael Johnson', status: 'Pending' },
    { id: 3, date: '10/24/2023', time: '02:00 PM - 02:30 PM', patient: 'Emily Davis', status: 'Confirmed' },
    { id: 4, date: '10/25/2023', time: '11:30 AM - 12:00 PM', patient: 'Robert Wilson', status: 'Confirmed' },
  ]
  const stats = [
    { title: 'Appointments', value: '24', icon: <CalendarIcon size={18} />, color: 'bg-blue-500' },
    { title: 'Patients', value: '156', icon: <UsersIcon size={18} />, color: 'bg-green-500' },
    { title: 'Consultations', value: '18', icon: <ActivityIcon size={18} />, color: 'bg-purple-500' },
    { title: 'Reports', value: '32', icon: <ClipboardIcon size={18} />, color: 'bg-amber-500' },
  ]
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Appointments Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md text-sm">
            Manage
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{appointment.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <p className="font-medium">New Appointment</p>
              <p className="text-xs text-gray-500 mt-1">Schedule a new patient visit</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <p className="font-medium">Create Report</p>
              <p className="text-xs text-gray-500 mt-1">Generate a new medical report</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <p className="font-medium">Patient Records</p>
              <p className="text-xs text-gray-500 mt-1">Access patient information</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <p className="font-medium">Lab Results</p>
              <p className="text-xs text-gray-500 mt-1">Review recent test results</p>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm">Medical report for <span className="font-medium">Emily Davis</span> was generated</p>
                <p className="text-xs text-gray-500">Today, 10:45 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="text-sm">Appointment with <span className="font-medium">Michael Johnson</span> was confirmed</p>
                <p className="text-xs text-gray-500">Today, 9:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
              <div>
                <p className="text-sm">Lab results for <span className="font-medium">Robert Wilson</span> are available</p>
                <p className="text-xs text-gray-500">Yesterday, 4:15 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
              <div>
                <p className="text-sm">Prescription for <span className="font-medium">Jane Smith</span> was updated</p>
                <p className="text-xs text-gray-500">Yesterday, 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}