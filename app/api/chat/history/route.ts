import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const chat = await Chat.findOne({ sessionId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(1); // Get the latest chat for this session

    if (!chat) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({
      messages: chat.messages,
      chatId: chat._id,
      sessionId: chat.sessionId
    });

  } catch (err) {
    console.error("/api/chat/history error", err);
    return NextResponse.json(
      { error: "Failed to retrieve chat history" },
      { status: 500 }
    );
  }
}
