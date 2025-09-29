import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: string;
  status: string;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    userId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    plan: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
