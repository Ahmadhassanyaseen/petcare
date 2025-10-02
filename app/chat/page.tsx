"use client";

import React, { useState, useEffect } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import VoiceChat from "../components/chat/VoiceChat";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  messages: Message[];
  chatId?: string;
  sessionId: string;
}

const page = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    initializeChatSession();
  }, []);

  const generateNewSessionId = () => {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  };

  const initializeChatSession = async () => {
    if (typeof window === "undefined") return;

    try {
      // Always generate a new unique session ID for each chat session
      const currentSessionId = generateNewSessionId();
      setSessionId(currentSessionId);
    } catch (err) {
      console.error("Failed to initialize chat session:", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleNewChatSession = () => {
    // Generate a new session ID when user wants to start a fresh chat
    const newSessionId = generateNewSessionId();
    setSessionId(newSessionId);
    setChatHistory([]); // Clear chat history for new session
  };

  return (
    <ChatLayout onNewChat={handleNewChatSession}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Voice Chat Assistant
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Click the microphone to start recording your message. Speak
                  naturally and I'll help you with your pet care questions.
                </p>
              </div>
            </div>
            <div className="absolute top-6 right-6 z-50">
              <Link
                href="/"
                className="group flex items-center space-x-3 bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-wide">
                  Back to Home
                </span>
              </Link>
            </div>
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <VoiceChat
              sessionId={sessionId}
              onMessage={(message) => {
                setChatHistory((prev) => [...prev, message]);
              }}
              onError={(error) => {
                setError(error);
              }}
            />
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export default page;
