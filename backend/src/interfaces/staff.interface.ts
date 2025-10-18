import { Types } from "mongoose";
import { IUser } from "./user.interface"; // Assuming staff is a type of user

export interface IStaff extends IUser {
  // Specific fields for staff members, if any, beyond what's in IUser
  // For example, department, role, etc.
  department?: string;
  staffRole: "Admin" | "Receptionist" | "Nurse" | "Other";
}
