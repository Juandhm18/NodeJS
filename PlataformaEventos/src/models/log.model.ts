import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  action: string;
  UserID: number;
  source: string;
  date?: Date;
}

const logSchema = new Schema<ILog>({
  action: {
    type: String,
    required: true,
  },
  UserID: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Definición explícita del nombre de colección
export const Log = mongoose.model<ILog>("Log", logSchema);
