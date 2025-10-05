import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICard extends Document {
  userId: string;
  stripeCardId?: string;
  cardNumber: string;
  cardBrand: string;
  cardholderName?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema<ICard> = new Schema(
  {
    userId: { type: String, required: true },
    stripeCardId: { type: String },
    cardNumber: { type: String, required: true },
    cardBrand: { type: String, required: true },
    cardholderName: { type: String },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true, min: new Date().getFullYear() },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure only one default card per user
CardSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.model('Card').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const Card: Model<ICard> =
  mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;
