import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Chat from '@/models/Chat'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // If userId is provided, filter chats by user
    const query = userId ? { userId } : {}

    // Get all chat documents and transform them into session format
    const chats = await Chat.find(query).sort({ updatedAt: -1 })

    const sessions = chats.map(chat => ({
      id: chat._id,
      sessionId: chat.sessionId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages?.length || 0,
      lastMessage: chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1].content : '',
      title: chat.messages?.length > 0
        ? (chat.messages[chat.messages.length - 1].content.length > 50
          ? chat.messages[chat.messages.length - 1].content.substring(0, 47) + '...'
          : chat.messages[chat.messages.length - 1].content)
        : 'New Chat Session'
    }))

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching chat sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    )
  }
}
