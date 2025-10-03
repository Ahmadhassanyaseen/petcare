"use client";

import React, { useState, useEffect } from "react";
import ChatLayout from "../components/layout/ChatLayout";
import VoiceChat from "../components/chat/VoiceChat";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    initializeChatSession();
  }, []);

  const generateNewSessionId = () => {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  };

  const logout = ()=>{
    localStorage.removeItem("user_data");
    router.push("/");
  }
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
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="group flex items-center space-x-3 bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
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
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold tracking-wide">
                    Menu
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-60">
                    <Link
                      href="/"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Home
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        // Handle logout logic here
                        logout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
