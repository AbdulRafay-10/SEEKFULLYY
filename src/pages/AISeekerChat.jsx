import React, { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Logo from "../assets/icons/Group 48095547.png";
import { Link } from "react-router-dom";

const messages = [
  { sender: "user", text: "Hello!" },
  { sender: "ai", text: "Hello! How’s it going? What can I help you with today?" },
  { sender: "user", text: "Why Cubism was revolutionary?" },
  {
    sender: "ai",
    text:
      "Cubism challenged traditional notions of perspective and representation in art. Instead of imitating nature, it emphasized how we perceive and interpret the world. Its impact is still felt in contemporary art and design.",
  },
];

const AISeekerChat = () => {
  const [input, setInput] = useState("");

  return (
    <div className="shadow-xl rounded-3xl h-full bg-white flex flex-col font-sans">
      {/* Top Bar */}
      <Link to="/ai"><div className="flex items-center p-6 border-gray-200">
        <ArrowLeft className="w-5 h-5 text-gray-700 mr-3" />
        <h1 className="text-2xl">Seeker AI</h1>
      </div></Link>

      {/* Chat Messages */}
      <div className="flex-1  overflow-y-auto space-y-6 mt-4 p-16">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" ? (
              <div className="flex items-start gap-3 max-w-xl">
                {/* Fixed-size AI logo */}
                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-full flex items-center justify-center shrink-0">
                  <img src={Logo} alt="AI" className="w-12 h-12 object-contain" />
                </div>
                {/* AI Message */}
                <div className=" px-4 py-3 rounded-xl text-md text-gray-800">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--primary-color)] text-white px-4 py-3 rounded-xl text-md max-w-xs">
                {msg.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className=" border-gray-200 p-4 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message SeekerAI"
          className="flex-1 px-4  py-4 rounded-lg border border-gray-300 text-sm focus:outline-none"
        />
        <button className="ml-3 p-2 rounded-full bg-[var(--primary-color)] text-white">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AISeekerChat;
