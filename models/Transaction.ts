import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  plan: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  status: "pending" | "completed" | "failed";
  cardLast4?: string;
  cardBrand?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: { type: String, required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "usd" },
    stripePaymentIntentId: { type: String, required: true },
    stripeChargeId: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
      default: "pending"
    },
    cardLast4: { type: String },
    cardBrand: { type: String },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
