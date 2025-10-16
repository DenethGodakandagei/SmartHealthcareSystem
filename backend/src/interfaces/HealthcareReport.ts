export interface Medication {
  medicationName: string
  dosage: string
  frequency: string
  duration: string
}

export interface LabResult {
  testName: string
  result: string
  normalRange: string
  interpretation: string
}

export interface HealthcareReport {
  patientName: string
  patientId: string
  age?: number
  gender?: 'Male' | 'Female' | 'Other'
  dateOfBirth?: Date
  contactNumber?: string
  address?: string

  // Vital Signs
  bloodPressure?: string
  heartRate?: string
  respiratoryRate?: string
  temperature?: string
  oxygenSaturation?: string
  height?: string
  weight?: string

  // Diagnosis
  primaryDiagnosis?: string
  secondaryDiagnosis?: string
  icdCode?: string
  clinicalNotes?: string

  // Medications & Lab Results
  medications?: Medication[]
  labResults?: LabResult[]

  // Meta
  reportDate?: Date
  createdBy?: string
}
