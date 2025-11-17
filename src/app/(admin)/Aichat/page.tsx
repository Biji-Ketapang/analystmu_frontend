import type { Metadata } from "next";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { PaperPlaneIcon } from "@/icons";
import { FaRobot, FaUser } from "react-icons/fa";

export const metadata: Metadata = {
  title: "AnalysMU | AI Chat",
  description: "AI Chatbot for Social Media Analysis",
};

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

const dummyMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your AI assistant for social media analysis. How can I help you today?",
    sender: "ai",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    text: "Can you analyze the sentiment of recent posts?",
    sender: "user",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    text: "Sure! Based on the latest data, the overall sentiment is positive with 65% positive mentions, 25% neutral, and 10% negative.",
    sender: "ai",
    timestamp: "10:02 AM",
  },
  {
    id: 4,
    text: "What are the trending hashtags?",
    sender: "user",
    timestamp: "10:03 AM",
  },
  {
    id: 5,
    text: "The top trending hashtags are #SocialMedia, #DataAnalysis, #AI, and #Marketing.",
    sender: "ai",
    timestamp: "10:04 AM",
  },
];

export default function AIChat() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ComponentCard
          title="AI Chatbot"
          desc="Interact with our AI assistant for social media insights (Mockup)"
        >
          {/* Chat Messages Area */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {dummyMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center justify-center w-8 h-8 bg-brand-500 text-white rounded-full">
                    <FaRobot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                </div>
                {message.sender === "user" && (
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-500 text-white rounded-full">
                    <FaUser className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1">
              <Input
                placeholder="Type your message here..."
                className="w-full"
              />
            </div>
            <Button size="md" startIcon={<PaperPlaneIcon className="w-4 h-4" />}>
              Send
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
