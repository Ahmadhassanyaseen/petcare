import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPlan extends Document {
  name: string;
  price: number; // cents
  interval: "month" | "year";
  description: string;
  features: string[];
  minutes: number;
  isPopular: boolean;
  isActive: boolean;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    interval: { type: String, enum: ["month", "year"], default: "month" },
    description: { type: String },
    features: [{ type: String }],
    minutes: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plan = models?.Plan || model<IPlan>("Plan", PlanSchema);
export default Plan;
