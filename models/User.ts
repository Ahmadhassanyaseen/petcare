import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string; // hashed
  name?: string;
  total_time?: number; // Total minutes available for chat
  profileImage?: string; // URL to user's profile image stored in Cloudinary
  stripeCustomerId?: string; // Stripe customer ID for subscription management
  renew?: boolean; // True if subscription will renew
  subscription_date?: Date; // Subscription plan
  subscription_amount?: number; // Subscription plan
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String },
    total_time: { type: Number, default: 0 },
    profileImage: { type: String },
    stripeCustomerId: { type: String }, // Stripe customer ID for subscription management
    renew: { type: Boolean, default: true },
    subscription_date: { type: Date },
    subscription_amount: { type: Number},
  },
  { timestamps: true }
);

// Pre-save middleware to normalize email to lowercase
UserSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
