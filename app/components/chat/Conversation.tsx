'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react';
import { Mic, MicOff, X, MessageCircle } from 'lucide-react';

export function Conversation() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: "agent_5501k6jv0p6he6mr594h88sedh2n", // Replace with your agent ID
        connectionType: 'webrtc', // either "webrtc" or "websocket"
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    if (!isPanelOpen) {
      // Start conversation when opening panel
      setTimeout(() => startConversation(), 300);
    } else {
      // Stop conversation when closing panel
      stopConversation();
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    stopConversation();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={togglePanel}
          className={`
            relative w-16 h-16 rounded-full shadow-xl transition-all duration-300 ease-in-out transform
            ${isPanelOpen
              ? 'bg-gray-600 scale-90'
              : 'bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 hover:scale-110 active:scale-95'
            }
            hover:shadow-blue-300/50 focus:outline-none focus:ring-4 focus:ring-blue-300/50
          `}
        >
          {/* Icon */}
          <div className="relative flex items-center justify-center w-full h-full">
            {isPanelOpen ? (
              <X className="w-6 h-6 text-white transition-transform duration-300" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white transition-transform duration-300" />
            )}
          </div>

          {/* Status indicator */}
          {conversation.status === 'connected' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
          )}
        </button>
      </div>

      {/* Chat Panel */}
      <div className={`
        fixed bottom-24 right-6 z-40 transition-all duration-500 ease-in-out transform
        ${isPanelOpen
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }
      `}>
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-3 h-3 rounded-full transition-colors duration-300
                  ${conversation.status === 'connected' ? 'bg-green-300' : 'bg-yellow-300'}
                `}></div>
                <div>
                  <h3 className="font-semibold text-sm">Voice Assistant</h3>
                  <p className="text-xs text-blue-100">
                    Status: {conversation.status}
                  </p>
                </div>
              </div>
              <button
                onClick={closePanel}
                className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              {/* Animated Microphone */}
              <div className="relative">
                <div className={`
                  w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-500 border-4
                  ${conversation.status === 'connected'
                    ? 'bg-blue-100 border-blue-300 shadow-lg shadow-blue-200/50'
                    : conversation.status === 'connecting'
                    ? 'bg-yellow-100 border-yellow-300 animate-pulse'
                    : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                  }
                `}>
                  {/* Pulsing rings when connected */}
                  {conversation.status === 'connected' && (
                    <>
                      <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-50"></div>
                      <div className="absolute inset-2 rounded-full border-2 border-blue-200 animate-ping opacity-30 animation-delay-300"></div>
                      <div className="absolute inset-4 rounded-full border-2 border-blue-100 animate-ping opacity-20 animation-delay-600"></div>
                    </>
                  )}

                  {/* Microphone Icon */}
                  <div className="relative z-10">
                    {conversation.status === 'connected' ? (
                      <Mic className="w-12 h-12 text-blue-600 animate-pulse" />
                    ) : conversation.status === 'connecting' ? (
                      <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <MicOff className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Recording indicator */}
                {conversation.status === 'connected' && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center space-y-2">
                <h4 className="font-medium text-gray-800 text-lg">
                  {conversation.status === 'connected' ? '🎤 Listening...' : 'Voice Chat'}
                </h4>
                <p className="text-sm text-gray-500">
                  {conversation.status === 'connected'
                    ? 'Speak now to interact with the assistant'
                    : conversation.status === 'connecting'
                    ? 'Connecting to voice assistant...'
                    : 'Click the button below to start'
                  }
                </p>
              </div>

              {/* Control buttons */}
              <div className="flex space-x-3">
                {conversation.status !== 'connected' ? (
                  <button
                    onClick={startConversation}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Chat</span>
                  </button>
                ) : (
                  <button
                    onClick={stopConversation}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <MicOff className="w-5 h-5" />
                    <span>End Chat</span>
                  </button>
                )}
              </div>

              {/* Speaking indicator */}
              {conversation.isSpeaking && (
                <div className="flex items-center space-x-3 text-sm text-blue-600 animate-pulse bg-blue-50 px-4 py-2 rounded-full">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse"></div>
                    <div className="w-1 h-5 bg-blue-500 rounded animate-pulse animation-delay-150"></div>
                    <div className="w-1 h-4 bg-blue-500 rounded animate-pulse animation-delay-300"></div>
                    <div className="w-1 h-3 bg-blue-500 rounded animate-pulse animation-delay-450"></div>
                  </div>
                  <span className="font-medium">Assistant is speaking...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={closePanel}
        />
      )}
    </>
  );
}
