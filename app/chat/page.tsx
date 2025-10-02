"use client"

import React, { useState, useEffect } from 'react'
import ChatLayout from '../components/layout/ChatLayout'
import VoiceChat from '../components/chat/VoiceChat'

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  messages: Message[];
  chatId?: string;
  sessionId: string;
}

const page = () => {
  const [sessionId, setSessionId] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    initializeChatSession()
  }, [])

  const initializeChatSession = async () => {
    if (typeof window === 'undefined') return

    try {
      let currentSessionId = sessionStorage.getItem('chatSessionId')
      if (!currentSessionId) {
        currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        sessionStorage.setItem('chatSessionId', currentSessionId)
      }
      setSessionId(currentSessionId)
    } catch (err) {
      console.error('Failed to initialize chat session:', err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <ChatLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center mb-8 max-w-2xl w-full">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Voice Chat Assistant
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Click the microphone to start recording your message. Speak naturally and I'll help you with your pet care questions.
            </p>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <VoiceChat
              sessionId={sessionId}
              onMessage={(message) => {
                setChatHistory(prev => [...prev, message])
              }}
              onError={(error) => {
                setError(error)
              }}
            />
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}

export default page