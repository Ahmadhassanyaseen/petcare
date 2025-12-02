"use client";

import React, { useState, useEffect } from "react";
import ChatLayout from "@/app/components/chat/Layout";
import VoiceChat from "@/app/components/chat/VoiceChat";
import { useRouter } from "next/navigation";
import ChatMenu from "@/app/components/chat/ChatMenu";
import { useSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sessionId, setSessionId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      initializeChatSession();
    }
  }, [status, router]);

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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B57DFF]"></div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <ChatLayout onNewChat={handleNewChatSession} userId={session?.user?.id}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] bg-clip-text text-transparent mb-4">
                  Voice Chat Assistant
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Speak naturally and I'll help you with your pet care
                  questions.
                </p>
              </div>
            </div>
            <ChatMenu />
          </div>

          <div className="mb-8 max-w-md mx-auto">
            <VoiceChat
              sessionId={sessionId}
              userId={session?.user?.id}
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
