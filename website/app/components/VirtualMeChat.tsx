"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const starterQuestions = [
  "What is Piotr's professional background?",
  "What kind of projects is Piotr building?",
  "What are Piotr's main technical skills?",
  "How can Piotr help a company?"
];

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content
  };
}

export default function VirtualMeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "Hi, I am Virtual Piotr. I only answer from Piotr's curated public profile data."
    )
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading]
  );

  async function askQuestion(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || isLoading) {
      return;
    }

    setError("");
    setMessages((prev) => [...prev, createMessage("user", question)]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      const data = (await response.json()) as { answer?: string };
      const answer =
        typeof data.answer === "string" && data.answer.trim().length > 0
          ? data.answer
          : "I can only answer from Piotr's public profile data.";

      setMessages((prev) => [...prev, createMessage("assistant", answer)]);
    } catch {
      setError("Chat is temporarily unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  return (
    <div className="virtual-chat">
      <div className="virtual-chat-intro">
        <p>
          Ask questions about Piotr&apos;s background, skills, projects, and
          career journey.
        </p>
        <p className="virtual-chat-scope">
          Scope: public profile information only.
        </p>
      </div>

      <div className="virtual-chat-starters" aria-label="Suggested questions">
        {starterQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => {
              void askQuestion(question);
            }}
            disabled={isLoading}
          >
            {question}
          </button>
        ))}
      </div>

      <div className="virtual-chat-log" role="log" aria-live="polite">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`virtual-chat-message ${message.role}`}
          >
            <p className="virtual-chat-role">
              {message.role === "assistant" ? "Virtual Piotr" : "You"}
            </p>
            <p>{message.content}</p>
          </article>
        ))}

        {isLoading ? (
          <article className="virtual-chat-message assistant loading">
            <p className="virtual-chat-role">Virtual Piotr</p>
            <p>Thinking...</p>
          </article>
        ) : null}
      </div>

      <form className="virtual-chat-form" onSubmit={handleSubmit}>
        <label htmlFor="virtual-me-input" className="sr-only">
          Ask Virtual Piotr
        </label>
        <input
          id="virtual-me-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question about Piotr's public profile..."
          maxLength={280}
          disabled={isLoading}
        />
        <button type="submit" disabled={!canSubmit}>
          Send
        </button>
      </form>

      {error ? (
        <p className="virtual-chat-error" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
