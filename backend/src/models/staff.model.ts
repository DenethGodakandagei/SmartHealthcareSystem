import { Schema, model, Document, Types } from "mongoose";
import { IStaff } from "../interfaces/staff.interface";

// IStaff already extends IUser, and IUser extends Document.
// So, IStaff itself is already a Document type.
// We can directly use IStaff as the type for the schema.

const StaffSchema = new Schema<IStaff>(
  {
    // Fields from IUser (explicitly defined here for the Staff collection)
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    // The role from IStaff overrides the role from IUser
    role: {
      type: String,
      enum: ["Admin", "Receptionist", "Nurse", "Other"], // Specific roles for Staff
      required: true,
    },
    // Staff-specific fields
    department: { type: String },
  },
  {
    timestamps: true,
  }
);

const StaffModel = model<IStaff>("Staff", StaffSchema);

export default StaffModel;
