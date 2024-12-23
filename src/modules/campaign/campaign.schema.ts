import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

const CampaignSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

export const CampaignModel = mongoose.model<ICampaign>("Campaign", CampaignSchema);
