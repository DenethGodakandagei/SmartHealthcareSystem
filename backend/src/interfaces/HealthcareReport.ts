// interfaces/IHealthcareReport.ts
export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ILabResult {
  test: string;
  result: string;
  normalRange: string;
  interpretation: string;
}

export interface IDoctorInfo {
  name: string;
  specialization: string;
  licenseNumber: string;
  signature?: string;
}

export interface IPatientInfo {
  patientName: string;
  patientId: string;
  age?: string;
  gender?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  address?: string;
}

export interface IVitalSigns {
  bloodPressure?: string;
  heartRate?: string;
  respiratoryRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  height?: string;
  weight?: string;
}

export interface IDiagnosis {
  primaryDiagnosis?: string;
  secondaryDiagnosis?: string;
  icdCode?: string;
  notes?: string;
}

export interface IHealthcareReport {
  patientInfo: IPatientInfo;
  vitalSigns: IVitalSigns;
  diagnosis?: IDiagnosis;
  medications: IMedication[];
  labResults: ILabResult[];
  reportDate: string;
  doctorInfo: IDoctorInfo;
}
