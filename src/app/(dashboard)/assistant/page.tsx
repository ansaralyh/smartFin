"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import { Send } from "lucide-react";
import { useState } from "react";

const suggestions = [
  "How much did I spend this month?",
  "What is my highest expense category?",
  "What are my predicted expenses?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Ask me anything about your finances." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await api.assistant.chat(text);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not reach the assistant.";
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader />

      <div className="mb-6 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={loading}
            className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:bg-white disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
        <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-5 py-3 text-base leading-relaxed ${
                  msg.role === "user"
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-stone-400">SmartFin AI is thinking...</p>
          )}
        </div>
        <div className="flex gap-3 border-t border-stone-100 p-4 md:p-6">
          <Input
            placeholder="Type a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={() => sendMessage(input)} aria-label="Send" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
