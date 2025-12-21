// frontend/src/components/ChatBot/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Reset conversation
  const resetChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="chatbot-container">
      {/* Chat Button */}
      <button
        className="chatbot-toggle-btn"
        onClick={toggleChat}
        aria-label="Toggle chat"
        title="Ask a question"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <h3>Training Assistant</h3>
            <div className="chatbot-actions">
              <button
                className="chatbot-reset-btn"
                onClick={resetChat}
                title="Clear conversation"
              >
                🔄
              </button>
              <button
                className="chatbot-close-btn"
                onClick={toggleChat}
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                <p>Hi! I'm your training assistant.</p>
                <p>Ask me questions about cybersecurity, email security, or any training topics.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-message chatbot-message-${msg.sender}`}
                >
                  <div className="chatbot-message-content">{msg.content}</div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="chatbot-message chatbot-message-ai">
                <div className="chatbot-message-content">
                  <span className="chatbot-typing">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="chatbot-message chatbot-message-error">
                <div className="chatbot-message-content">
                  Error: {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chatbot-form">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="chatbot-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="chatbot-send-btn"
              title="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
