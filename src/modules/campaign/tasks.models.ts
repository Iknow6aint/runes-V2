import mongoose, { Schema, model, Types } from "mongoose";

export interface TaskDocument extends mongoose.Document {
    taskId: string; // Unique identifier
    description: string;
    externalLink: string;
    points: number;
    isActive: boolean;
    delete: boolean;
    admin: Types.ObjectId
    airdropCampaign?: string; // Optional relationship with AirdropCampaign
}

const taskSchema = new Schema<TaskDocument>({
    taskId: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    externalLink: { type: String, },
    points: { type: Number, required: true },
    isActive: { type: Boolean, required: true, default: true },
    delete: { type: Boolean, required: true, default: false },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    airdropCampaign: { type: String, default: null }, // Optional relationship with AirdropCampaign
});

export const TaskModel = model<TaskDocument>("Task", taskSchema);
