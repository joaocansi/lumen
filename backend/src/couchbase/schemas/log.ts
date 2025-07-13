import { model, Schema } from "ottoman";

const LogSchema = new Schema({
    level: { type: String, required: true },
    message: { type: String, required: true },
    meta: { type: Object, required: false },
    timestamp: { type: Date, default: () => new Date() },
});

export const LogModel = model("Log", LogSchema); 