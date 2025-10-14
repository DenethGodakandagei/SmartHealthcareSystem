import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  title: string;
  parameters: Record<string, any>;
  generatedBy: mongoose.Types.ObjectId;
  data: any;
  scheduled?: boolean;
  scheduleCron?: string;
}

const reportSchema = new Schema<IReport>(
  {
    title: { type: String, required: true },
    parameters: { type: Schema.Types.Mixed },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    data: { type: Schema.Types.Mixed },
    scheduled: { type: Boolean, default: false },
    scheduleCron: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", reportSchema);
