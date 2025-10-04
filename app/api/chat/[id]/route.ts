import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Chat from "@/models/Chat";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Chat ID parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const chat = await Chat.findById(id);

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      messages: chat.messages,
      chatId: chat._id,
      sessionId: chat.sessionId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    });

  } catch (err) {
    console.error("/api/chat/[id] error", err);
    return NextResponse.json(
      { error: "Failed to retrieve chat" },
      { status: 500 }
    );
  }
}
