import mongoose from "mongoose";
import { required } from "zod/v4/core/util.cjs";

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    UserID: {
        type: String
    },
    recurso: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
});

export const Log = mongoose.model("log", logSchema);