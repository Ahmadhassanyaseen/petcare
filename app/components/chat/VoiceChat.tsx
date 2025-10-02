"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceChatProps {
  sessionId: string;
  onMessage?: (message: { role: 'user' | 'assistant'; content: string; timestamp: Date }) => void;
  onError?: (error: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function VoiceChat({ sessionId, onMessage, onError }: VoiceChatProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs voice agent");
      setErrorMessage("");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs voice agent");
    },
    onMessage: (message) => {
      console.log("Received message from voice agent:", message);
      const assistantMessage: Message = {
        role: 'assistant',
        content: message.message || message,
        timestamp: new Date()
      };
      setAgentResponse(message.message || message);
      onMessage?.(assistantMessage);

      // Save assistant message to database
      saveMessageToDB(assistantMessage);
    },
    onError: (error: string | Error) => {
      const errorMsg = typeof error === "string" ? error : error.message;
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("ElevenLabs error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  // Request microphone permission on mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        const errorMsg = "Microphone access denied";
        setErrorMessage(errorMsg);
        onError?.(errorMsg);
        console.error("Error accessing microphone:", error);
      }
    };

    requestMicPermission();
  }, [onError]);

  // Save message to database
  const saveMessageToDB = async (message: Message) => {
    try {
      const response = await fetch('/api/chat/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: message.content,
          role: message.role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
      onError?.('Failed to save message to database');
    }
  };

  const handleStartConversation = async () => {
    try {
      // Get agent ID from environment variable
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

      if (!agentId) {
        const errorMsg = "ElevenLabs agent ID not configured";
        setErrorMessage(errorMsg);
        onError?.(errorMsg);
        return;
      }

      await conversation.startSession({
        agentId: agentId,
        userId: sessionId, // Use session ID as user identifier
        connectionType: "websocket",
      });

      setIsListening(true);
      console.log("Started voice conversation with agent:", agentId);
    } catch (error) {
      const errorMsg = "Failed to start voice conversation";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("Error starting voice conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
      setIsListening(false);
      setCurrentTranscript("");

      // If user was speaking, save their final message
      if (currentTranscript.trim()) {
        const userMessage: Message = {
          role: 'user',
          content: currentTranscript.trim(),
          timestamp: new Date()
        };
        onMessage?.(userMessage);
        await saveMessageToDB(userMessage);
      }
    } catch (error) {
      const errorMsg = "Failed to end voice conversation";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("Error ending voice conversation:", error);
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      const errorMsg = "Failed to change volume";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      console.error("Error changing volume:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Voice Chat</h3>
        <div className="flex gap-2">
          <button
            onClick={toggleMute}
            disabled={status !== "connected"}
            className={`p-2 rounded-full transition-colors ${
              status === "connected"
                ? (isMuted ? 'bg-orange-100 hover:bg-orange-200' : 'bg-blue-100 hover:bg-blue-200')
                : 'bg-gray-100 cursor-not-allowed'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-orange-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="mb-4 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          status === 'connected'
            ? 'bg-green-100 text-green-800'
            : status === 'connecting'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          Status: {status}
        </div>
      </div>

      {/* Current Transcript Display */}
      {currentTranscript && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">You said:</span> {currentTranscript}
          </p>
        </div>
      )}

      {/* Agent Response Display */}
      {agentResponse && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Agent:</span> {agentResponse}
          </p>
        </div>
      )}

      {/* Error Display */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center">
        {status === "connected" ? (
          <button
            onClick={handleEndConversation}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <MicOff className="h-4 w-4" />
            End Voice Chat
          </button>
        ) : (
          <button
            onClick={handleStartConversation}
            disabled={!hasPermission}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              hasPermission
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Mic className="h-4 w-4" />
            Start Voice Chat
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        {!hasPermission && (
          <p className="text-orange-600">⚠️ Microphone access is required for voice chat</p>
        )}
        {status === "connected" && (
          <p>Speak clearly and the agent will respond with voice</p>
        )}
      </div>
    </div>
  );
}
