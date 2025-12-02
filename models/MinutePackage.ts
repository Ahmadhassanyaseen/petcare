import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IMinutePackage extends Document {
  minutes: number;
  price: number; // cents
  description: string;
  isPopular: boolean;
  isActive: boolean;
}

const MinutePackageSchema = new Schema<IMinutePackage>(
  {
    minutes: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MinutePackage = models?.MinutePackage || model<IMinutePackage>("MinutePackage", MinutePackageSchema);
export default MinutePackage;
