"use client"

import React, { useState, useRef, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

// Extend Window interface to include Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Define proper types for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechSynthesisErrorEvent extends Event {
  error: string;
}

const ChatPage = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcribedText, setTranscribedText] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState('')
  const [isSupported, setIsSupported] = useState(true)

  const recognitionRef = useRef<any>(null)
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const isRecordingRef = useRef<boolean>(false)
  const accumulatedTranscriptRef = useRef<string>('')
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Check if browser supports Speech Recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false)
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    // Configure speech recognition settings
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 1

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started')
    }

    recognitionRef.current.onaudiostart = () => {
      console.log('Audio capture started')
    }

    recognitionRef.current.onaudioend = () => {
      console.log('Audio capture ended')
    }

    recognitionRef.current.onspeechstart = () => {
      console.log('Speech detected')
    }

    recognitionRef.current.onspeechend = () => {
      console.log('Speech ended')
    }

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      console.log('Speech result received')
      
      let finalTranscript = ''
      let interimTranscript = ''

      // Process all results
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      // Update accumulated transcript with final results
      if (finalTranscript) {
        accumulatedTranscriptRef.current += finalTranscript + ' '
      }

      // Display current accumulated transcript plus interim
      const displayText = (accumulatedTranscriptRef.current + interimTranscript).trim()
      setTranscribedText(displayText)
    }

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      
      // Handle different error types
      if (event.error === 'aborted') {
        // This is expected when we manually stop
        return
      }
      
      if (event.error === 'no-speech' && isRecordingRef.current) {
        // Restart after no speech detected
        attemptRestart()
        return
      }
      
      // For other errors, show error message
      setError(`Speech recognition error: ${event.error}`)
    }

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended')
      
      // Only restart if we're still supposed to be recording
      if (isRecordingRef.current) {
        attemptRestart()
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis
    }

    return () => {
      cleanup()
    }
  }, [])

  const attemptRestart = () => {
    if (!isRecordingRef.current || !recognitionRef.current) return

    // Clear any existing timeout
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }

    // Attempt restart with a small delay
    restartTimeoutRef.current = setTimeout(() => {
      if (isRecordingRef.current && recognitionRef.current) {
        try {
          console.log('Restarting recognition...')
          recognitionRef.current.start()
        } catch (err) {
          console.error('Failed to restart recognition:', err)
          // If restart fails, try again after a longer delay
          restartTimeoutRef.current = setTimeout(attemptRestart, 1000)
        }
      }
    }, 100)
  }

  const cleanup = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
    
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel()
    }
  }

  const startRecording = () => {
    if (!recognitionRef.current) return

    console.log('Starting recording...')
    
    // Reset state
    setTranscribedText('')
    setAiResponse('')
    setError('')
    accumulatedTranscriptRef.current = ''
    isRecordingRef.current = true
    setIsRecording(true)

    try {
      recognitionRef.current.start()
    } catch (err: any) {
      console.error('Failed to start recording:', err)
      setError('Failed to start recording. Please try again.')
      isRecordingRef.current = false
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    console.log('Stopping recording...')
    
    // Update recording state first
    isRecordingRef.current = false
    setIsRecording(false)

    // Clear any pending restart
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
      restartTimeoutRef.current = null
    }

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recording:', err)
      }
    }

    // Process the accumulated transcript
    setTimeout(() => {
      const finalText = accumulatedTranscriptRef.current.trim()
      if (finalText) {
        console.log('Processing final text:', finalText)
        setTranscribedText(finalText)
        handleSubmit(finalText)
      } else {
        setError('No speech was detected. Please try again.')
      }
    }, 300) // Small delay to ensure recognition has fully stopped
  }

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return

    setIsProcessing(true)
    setError('')

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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", // Replace with your actual API key
          "HTTP-Referer": "http://localhost:3000", // Replace with your site URL
          "X-Title": "PetCare Chat", // Replace with your site name
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "x-ai/grok-4-fast:free",
          "messages": [
            {
              "role": "user",
              "content": text
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage = data.choices[0]?.message?.content || 'No response from AI'

      setAiResponse(aiMessage)
      speakText(aiMessage)
    } catch (err: any) {
      setError(`Failed to get AI response: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = (text: string) => {
    // Only run on client side
    if (typeof window === 'undefined' || !speechSynthRef.current) {
      setError('Text-to-speech is not supported in this browser.')
      return
    }

    // Cancel any ongoing speech
    speechSynthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      console.log('Speech synthesis started')
    }

    utterance.onend = () => {
      console.log('Speech synthesis ended')
    }

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      setError(`Speech synthesis error: ${event.error}`)
    }

    speechSynthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && speechSynthRef.current) {
      speechSynthRef.current.cancel()
    }
  }

  if (!isSupported) {
    return (
      <div className="font-sans text-gray-800 min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Not Supported</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="font-sans text-gray-800 min-h-screen bg-white">
      <Header />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        {/* Main Recording Interface */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Voice Chat Assistant
          </h1>
          <p className="text-slate-600 mb-8 max-w-md">
            Click the microphone to start recording your message. Click again to stop and process with AI.
          </p>
        </div>

        {/* Recording Button */}
        <div className="relative mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`
              relative w-32 h-32 rounded-full border-4 transition-all duration-300 flex items-center justify-center
              ${isRecording
                ? 'border-red-500 bg-red-50 animate-pulse'
                : 'border-orange-400 bg-orange-50 hover:bg-orange-100'
              }
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
          >
            {/* Microphone Icon */}
            <svg
              className={`w-16 h-16 transition-colors duration-300 ${
                isRecording ? 'text-red-500' : 'text-orange-500'
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
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-4 border-red-200 animate-ping animation-delay-300"></div>
              </>
            )}
          </button>

          {/* Status Text */}
          <div className="mt-4 text-sm">
            {isProcessing ? (
              <span className="text-blue-600 flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isRecording ? (
              <span className="text-red-600">🎤 Recording... Click to stop and process</span>
            ) : (
              <span className="text-slate-600">Click to start recording</span>
            )}
          </div>
        </div>

        {/* Live Transcription Display */}
        {isRecording && transcribedText && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md w-full">
            <h3 className="font-medium text-yellow-700 mb-2">Live transcription:</h3>
            <p className="text-yellow-600 text-sm">{transcribedText}</p>
          </div>
        )}

        {/* Final Transcribed Text Display */}
        {!isRecording && transcribedText && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border max-w-md w-full">
            <h3 className="font-medium text-slate-700 mb-2">You said:</h3>
            <p className="text-slate-600">{transcribedText}</p>
          </div>
        )}

        {/* AI Response Display */}
        {aiResponse && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border max-w-md w-full">
            <h3 className="font-medium text-blue-700 mb-2">AI Response:</h3>
            <p className="text-blue-600 mb-3">{aiResponse}</p>
            <div className="flex gap-2">
              <button
                onClick={() => speakText(aiResponse)}
                disabled={isProcessing}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                🔊 Repeat
              </button>
              <button
                onClick={stopSpeaking}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 max-w-md w-full">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-slate-500 max-w-md">
          <p className="mb-2">
            <strong>How to use:</strong>
          </p>
          <ol className="text-left space-y-1">
            <li>1. Click the microphone button to start recording</li>
            <li>2. Speak your message (you'll see live transcription)</li>
            <li>3. Click the button again to stop and process</li>
            <li>4. Wait for AI to respond</li>
            <li>5. The response will be read aloud automatically</li>
          </ol>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ChatPage