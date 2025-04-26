
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptionButtons from "./OptionButtons";
import { useToast } from "@/hooks/use-toast";
import { fetchPerplexity } from "@/utils/perplexity";

const SUGGESTED_QUESTIONS = [
  "What are tax-saving investment options?",
  "How do I plan for retirement?",
  "Latest news in Indian finance",
  "What is the difference between old and new tax regime?",
  "Best ways to optimize my portfolio?",
];

type ChatMessage = {
  from: "user" | "bot";
  text: string;
};

const FinanceChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "bot", text: "Hi! Ask me anything about personal finance, taxes, or investments. You can also select a question below." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleUserInput = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;
    setMessages((prev) => [...prev, { from: "user", text: trimmedQuestion }]);
    setIsLoading(true);
    setInput("");

    const perplexityKey = localStorage.getItem("perplexity_api_key");
    let botReply = "";

    try {
      if (perplexityKey) {
        botReply = await fetchPerplexity(trimmedQuestion, perplexityKey);
      } else {
        botReply = getSiteBotReply(trimmedQuestion);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Sorry, there was a problem getting your answer.",
        variant: "destructive",
      });
      botReply = "Sorry, something went wrong. Please try again later.";
    }
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    setIsLoading(false);
  };

  function getSiteBotReply(q: string) {
    const qLower = q.toLowerCase();
    if (qLower.includes("retirement")) {
      return "Planning for retirement involves estimating your future expenses, investing in tax-efficient vehicles like PPF, EPF, NPS, and reviewing your plan regularly.";
    } else if (qLower.includes("tax regime")) {
      return "India's new tax regime offers lower rates with fewer deductions, while the old regime allows more deductions like 80C, 80D, HRA, etc.";
    } else if (qLower.includes("tax-saving")) {
      return "Popular tax-saving options include EPF, PPF, ELSS mutual funds, NPS, insurance premiums, and home loan principal repayment.";
    } else if (qLower.includes("portfolio")) {
      return "A diversified portfolio includes equity, debt, and real assets such as real estate and gold. Aim for a balance based on your risk appetite.";
    } else if (qLower.includes("investment")) {
      return "Investment options include mutual funds, stocks, fixed deposits, bonds, real estate, and SIPs. Assess your risk before investing.";
    } else if (qLower.includes("latest news")) {
      return "Connect your Perplexity API key to get the latest finance news from the internet!";
    }
    return "Sorry, I can answer only general finance queries without internet access. Please try connecting the Perplexity API for real-time information.";
  }

  return (
    <div>
      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 left-4 z-50">
        <button
          onClick={() => setOpen((o) => !o)}
          className="bg-primary rounded-full p-3 shadow-xl flex items-center justify-center hover:scale-110 transition-all"
          aria-label={open ? "Close financial chatbot" : "Open financial chatbot"}
        >
          <Bot className="text-white h-7 w-7" />
        </button>
      </div>
      {/* Chatbot Window */}
      {open && (
        <div className="fixed bottom-24 left-4 z-[100] w-80 max-w-[94vw] glass-dark border border-white/20 rounded-2xl shadow-2xl flex flex-col transition-all animate-gentle-float backdrop-blur-lg">
          <div className="flex items-center gap-2 p-3 border-b border-border bg-primary/10 rounded-t-2xl">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm text-primary">FinanceBot</span>
            <button onClick={() => setOpen(false)} className="ml-auto p-1 rounded hover:bg-red-100">
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          <div className="flex-1 min-h-64 max-h-96 overflow-y-auto px-3 py-2 space-y-2 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`rounded-lg px-3 py-2 ${
                    m.from === "bot"
                      ? "bg-muted text-foreground shadow-md"
                      : "bg-primary text-white"
                  }`}
                  style={{ maxWidth: "85%" }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isLoading && (
            <div className="px-4 py-2 text-muted-foreground text-xs">FinanceBot is typing...</div>
          )}
          {/* Options */}
          <div className="px-3 pb-2">
            <OptionButtons
              options={SUGGESTED_QUESTIONS}
              onSelect={handleUserInput}
              disabled={isLoading}
            />
          </div>
          {/* Input */}
          <form
            className="flex border-t border-border px-3 py-2 gap-2 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              handleUserInput(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded bg-white/90 text-black dark:bg-black/40 dark:text-white py-2 px-3 border focus:ring-2 focus:ring-primary outline-none"
              placeholder="Type your question…"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleUserInput(input);
                }
              }}
            />
            <Button
              type="submit"
              variant="default"
              className="rounded px-3 py-2"
              disabled={isLoading || !input.trim()}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-[0.71rem] text-muted-foreground mb-2 px-3">
            For live answers, connect your Perplexity API key in localStorage (<code>perplexity_api_key</code>).
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceChatbot;
