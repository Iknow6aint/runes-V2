import mongoose, { Schema, model, Types } from "mongoose";

interface UserTaskDocument extends Document {
  user: mongoose.Types.ObjectId;
  taskId: [mongoose.Types.ObjectId]; // Task's ID (reference to Task model)
  isCompleted: "pending" | "completed";
}

const userTaskSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  taskId: { type: Types.ObjectId, ref: "Task", required: true },
  isCompleted: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

export const UserTaskModel = model<UserTaskDocument>(
  "UserTask",
  userTaskSchema
);
