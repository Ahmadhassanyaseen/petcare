import mongoose from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId | string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt?: Date;
}
