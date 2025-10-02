"use client";

import React, { useState, useRef } from "react";
import { Conversation } from "@elevenlabs/client";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const convoRef = useRef<any>(null);

  const AGENT_ID =
    process.env.NEXT_PUBLIC_AGENT_ID || "agent_1601k687s56gfvwrx96k2ekwtdbg";

  const startCall = async () => {
    if (isCalling) return;

    try {
      const conversation = await Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
        onMessage: (msg: any) => {
          console.log("Agent:", msg); // only logs, voice will play automatically
        },
        onError: (err: any) => {
          console.error("Conversation error:", err);
        },
        onDisconnect: () => {
          console.log("Call ended");
          setIsCalling(false);
          convoRef.current = null;
        },
        onConnect: () => {
          console.log("Call started");
        },
      });

      convoRef.current = conversation;
      setIsCalling(true);
    } catch (err) {
      console.error("Failed to start call:", err);
    }
  };

  const stopCall = async () => {
    if (convoRef.current) {
      try {
        await convoRef.current.endSession(); // correct way to stop
      } catch (err) {
        console.error("Error ending call:", err);
      }
      convoRef.current = null;
    }
    setIsCalling(false);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !convoRef.current) return;
    try {
      await convoRef.current.sendUserMessage(inputValue.trim());
      setInputValue("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-5 right-5 p-4 bg-blue-600 text-white rounded-full shadow-lg"
      >
        Chat
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 h-64 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3>Voice Agent</h3>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
            {!isCalling ? (
              <button
                onClick={startCall}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                🎤 Start Call
              </button>
            ) : (
              <button
                onClick={stopCall}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                ⏹ End Call
              </button>
            )}

            <div className="flex w-full">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
