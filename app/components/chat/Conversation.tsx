'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useEffect, useState } from 'react';
import { Mic, MicOff, X, MessageCircle, VolumeX, Volume2 } from 'lucide-react';

export function Conversation() {
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const { status, isSpeaking } = conversation;

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_4901k6njbw0bfpwvfkb9vd073zz6", // Replace with your agent ID
        connectionType: 'webrtc', // either "webrtc" or "websocket"
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

   useEffect(() => {
      const requestMicPermission = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setHasPermission(true);
        } catch (error) {
          const errorMsg = "Microphone access denied";
          setErrorMessage(errorMsg);
          // onError?.(errorMsg);
          console.error("Error accessing microphone:", error);
        }
      };
  
      requestMicPermission();
    }, []);
    const toggleMute = async () => {
      try {
        await conversation.setVolume({ volume: isMuted ? 1 : 0 });
        setIsMuted(!isMuted);
      } catch (error) {
        const errorMsg = "Failed to change volume";
        setErrorMessage(errorMsg);
        // onError?.(errorMsg);
        console.error("Error changing volume:", error);
      }
    };
 
  return (
    <>
      <div className="w-full max-w-md mx-auto bg-white/0 rounded-lg  p-6">
      <div className="flex items-center justify-between mb-4">
        {/* <h3 className="text-lg font-semibold">Voice Chat</h3> */}
        <div className="flex gap-2 hidden">
          <button
            onClick={toggleMute}
            disabled={status !== "connected"}
            className={`p-2 rounded-full transition-colors ${
              status === "connected"
                ? isMuted
                  ? "bg-orange-100 hover:bg-orange-200"
                  : "bg-blue-100 hover:bg-blue-200"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
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
      <div className="mb-4 text-center hidden">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            status === "connected"
              ? "bg-green-100 text-green-800"
              : status === "connecting"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              status === "connected" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          Status: {status}
        </div>
      </div>

     



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
          onClick={
            status === "connected"
              ? stopConversation
              : startConversation
          }
          //   disabled={isProcessing}
          className={`
                    relative w-36 h-36 md:w-40 md:h-40 rounded-full border-4 transition-all duration-300 flex items-center justify-center mx-auto
                    ${
                      status === "connected"
                        ? "border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-lg shadow-red-200/50 animate-pulse"
                        : "border-blue-400 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 shadow-lg hover:shadow-xl hover:scale-105"
                    }
                    ${status === "connected" ? "opacity-50" : "cursor-pointer"}
                  `}
        >
          {/* Microphone Icon */}
          <svg
            className={`w-18 h-18 md:w-20 md:h-20 transition-colors duration-300 ${
              status === "connected" ? "text-red-500" : "text-blue-500"
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
        <p className="text-center text-xl font-semibold mt-5">Click the Mic to start the conversation</p>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        {!hasPermission && (
          <p className="text-orange-600">
            ⚠️ Microphone access is required for voice chat
          </p>
        )}
        {status === "connected" && (
          <p>Speak clearly and the agent will respond with voice</p>
        )}
      </div>

      
    </div>
    </>
  );
}
