import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  sessionId: string; // For identifying chat sessions
  userId?: string; // ID of the user who owns this chat (optional for backward compatibility)
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const ChatSchema = new Schema<IChat>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: String,
      index: true
    },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

// Index for efficient queries
ChatSchema.index({ sessionId: 1, createdAt: -1 });
ChatSchema.index({ userId: 1, createdAt: -1 });

export default (models.Chat as mongoose.Model<IChat>) || model<IChat>("Chat", ChatSchema);
