import {Schema, model, Document } from "mongoose"

export interface ICategory extends Document {
  name: string;
  description?: string;
}

const CategoryCreation = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true }
  },
  { timestamps: true } // crea createdAt y updatedAt
);

export default model<ICategory>("Category", CategoryCreation);
