"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Role, useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import MinutesSection from '@/app/transactions/MinutesSection';

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
  const [totalTime, setTotalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [parsedUserData, setParsedUserData] = useState<any>(null);


  useEffect(() => {
    // Runs only in browser
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setParsedUserData(JSON.parse(userData));
        setTotalTime(JSON.parse(userData).data.total_time);
      } catch (e) {
        console.error("Failed to parse user_data from localStorage", e);
      }
    }
  }, []);

  // Function to handle call end and update total time
  const handleCallEnd = async () => {
    if (!callStartTime || !parsedUserData) return;

    const callEndTime = new Date();
    const callDurationMs = callEndTime.getTime() - callStartTime.getTime();
    const callDurationMinutes = Math.ceil(callDurationMs / (1000 * 60)); // Round up to nearest minute

    if (callDurationMinutes <= 0) return;

    try {
      // Update user's total_time in the database
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total_time: Math.max(0, totalTime - callDurationMinutes),
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Update localStorage with new total_time
        const updatedUserData = {
          ...parsedUserData,
          data: {
            ...parsedUserData.data,
            total_time: result.user.total_time,
          },
        };

        localStorage.setItem("user_data", JSON.stringify(updatedUserData));
        setTotalTime(result.user.total_time);
        setParsedUserData(updatedUserData);

        console.log(`Call duration: ${callDurationMinutes} minutes. Remaining time: ${result.user.total_time} minutes.`);
      } else {
        console.error('Failed to update user total_time');
      }
    } catch (error) {
      console.error('Error updating call duration:', error);
    }

    setCallStartTime(null); // Reset call start time
  };

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs voice agent");
      setErrorMessage("");
      setCallStartTime(new Date()); // Track when the call starts
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs voice agent");
      handleCallEnd(); // Calculate and update call duration
    },
    onMessage: (message: string | { message: string; source: Role }) => {
      console.log("Received message from voice agent:", message);
      const assistantMessage: Message = {
        role: 'assistant',
        content: typeof message === 'string' ? message : message.message,
        timestamp: new Date()
      };
      setAgentResponse(typeof message === 'string' ? message : message.message);
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

  const [showMinutesModal, setShowMinutesModal] = useState(false);

  const handleStartConversation = async () => {
    try {

      if(totalTime <= 0){
        console.log("Total time is less than or equal to 0");
        setShowMinutesModal(true);
        return;
      }
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
        <div className="mb-4 p-3 bg-blue-50 rounded-lg hidden">
          <p className="text-sm text-blue-800">
            <span className="font-medium">You said:</span> {currentTranscript}
          </p>
        </div>
      )}

      {/* Agent Response Display */}
      {agentResponse && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg hidden">
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
        {/* {status === "connected" ? (
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
        )} */}
           <button
                 onClick={ status === "connected" ? handleEndConversation : handleStartConversation}
                //   disabled={isProcessing}
                  className={`
                    relative w-36 h-36 md:w-40 md:h-40 rounded-full border-4 transition-all duration-300 flex items-center justify-center mx-auto
                    ${status === "connected"
                      ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg shadow-red-200/50 animate-pulse'
                      : 'border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 shadow-lg hover:shadow-xl hover:scale-105'
                    }
                    ${status === "connected" ? 'opacity-50' : 'cursor-pointer'}
                  `}
                >
                  {/* Microphone Icon */}
                  <svg
                    className={`w-18 h-18 md:w-20 md:h-20 transition-colors duration-300 ${
                        status === "connected" ? 'text-red-500' : 'text-blue-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>

                  {/* Recording Animation Rings */}
                  {status === "connected" && (
                    <>
                      <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full border-4 border-red-200 animate-ping animation-delay-300"></div>
                      <div className="absolute inset-4 rounded-full border-4 border-red-100 animate-ping animation-delay-600"></div>
                    </>
                  )}
                </button>
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
      
      {/* Minutes Modal */}
      {showMinutesModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowMinutesModal(false)}
              className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <MinutesSection userId={parsedUserData?.id} currentMinutes={parsedUserData?.data?.total_time} />
          </div>
        </div>
      )}
      
    </div>
  );
}
