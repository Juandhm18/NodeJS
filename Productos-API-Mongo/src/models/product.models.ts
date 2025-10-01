import { Schema, model, Document } from "mongoose";
import { ICategory } from "./category.models";

export interface IProduct extends Document{
    name: string;
    price: number;
    category: ICategory["_id"]
    description?: string;
    inStock: boolean;
}

const ProductCreation = new Schema<IProduct>(
    {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        description: { type: String },
        inStock: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default model<IProduct>("Category", ProductCreation);