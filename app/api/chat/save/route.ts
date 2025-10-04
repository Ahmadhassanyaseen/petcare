import { NextResponse } from "next/server";
import Chat from "@/models/Chat";
import { connectToDatabase } from "@/lib/mongoose";
// import { IMessage } from "@/types";

export async function POST(request: Request) {
  try {
    const { sessionId, userId, message, role } = await request.json();

    if (!sessionId || !userId || !message || !role) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, userId, message, role" },
        { status: 400 }
      );
    }

    if (!['user', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: "Role must be either 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find existing chat or create new one
    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({
        sessionId,
        userId,
        messages: []
      });
    } else if (!chat.userId) {
      // Update existing chat without userId to include the current user's ID
      chat.userId = userId;
    }

    // Add new message
    chat.messages.push({
      role,
      content: message,
      timestamp: new Date()
    } as any);

    await chat.save();

    return NextResponse.json({
      success: true,
      message: "Message saved successfully",
      chatId: chat._id
    });

  } catch (err) {
    console.error("/api/chat/save error", err);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
