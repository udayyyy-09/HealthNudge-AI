"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Send message to backend AI
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ai/chat`,
        { question: input }
      );
      const botMessage = { sender: "bot", text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      const errorMsg = { sender: "bot", text: "Sorry, I couldn't connect to the AI." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when new messages are added or when loading state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle scroll position when user manually scrolls
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      
      // If user manually scrolls away from bottom, don't auto-scroll
      if (!isAtBottom) {
        container.dataset.autoScroll = "false";
      } else {
        container.dataset.autoScroll = "true";
      }
    }
  };

  // Reset auto-scroll when chat is opened
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.dataset.autoScroll = "true";
      scrollToBottom();
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-blue-400 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white border border-gray-200 rounded-xl shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold">Health AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            id="chat-container"
            className="flex-1 overflow-y-auto p-3 bg-gray-50"
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                Ask me anything about health and wellness!
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`my-2 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-2xl max-w-[75%] break-words text-sm
                      ${m.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-800"}`}
                  >
                    {m.text}
                  </span>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start my-2">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-2xl text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask a health question..."
                className="text-gray-800 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}