// apps/api/src/models/Task.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { TaskStatus } from "../types";

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  status: {
    type: String,
    enum: [TaskStatus.A_FAIRE, TaskStatus.EN_COURS, TaskStatus.TERMINE],
    default: TaskStatus.A_FAIRE,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
export default Task;
