// apps/api/src/models/Project.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProject extends Document {
  organizationId: Types.ObjectId;
  name: string;
  createdAt: Date;
}

const projectSchema = new Schema<IProject>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
export default Project;
