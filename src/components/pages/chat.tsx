// src/pages/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Send, Bot, User, Lightbulb, Target, Calendar, Zap } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI productivity coach. I'm here to help you stop procrastinating and stay focused. What are you working on today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);

    // Simple response logic based on keywords
    let response = "";
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('procrastinating') || lowerMessage.includes('procrastination')) {
      response = "I understand procrastination can be frustrating. Let's break this down: what specific task are you avoiding? I can help you create smaller, manageable steps that feel less overwhelming.";
    } else if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
      response = "Deadlines can create pressure! Let me help you create a realistic timeline. When is your deadline, and what does your task involve? I'll help you work backwards to create a manageable schedule.";
    } else if (lowerMessage.includes('focused') || lowerMessage.includes('distracted')) {
      response = "Staying focused is a skill we can build together. Try the 25-minute Focus Sprint: work for 25 minutes, then take a 5-minute break. I can send you reminders to keep you on track!";
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
      response = "Motivation comes and goes, but systems create consistency. Let's identify your 'why' for this task and create small wins that build momentum. What outcome are you hoping to achieve?";
    } else if (lowerMessage.includes('break down') || lowerMessage.includes('project')) {
      response = "Perfect! Let's break down your project step by step. First, tell me: What's the main goal of your project? Then we can identify the key milestones and create actionable tasks for each one.";
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      response = "Great idea! Let's create a realistic schedule. How much time do you typically have available each day? And what are your most productive hours? I'll help you optimize your schedule around your natural energy patterns.";
    } else if (lowerMessage.includes('focus session') || lowerMessage.includes('focus')) {
      response = "Let's start a focus session! I recommend the Pomodoro Technique: 25 minutes of focused work, followed by a 5-minute break. What specific task would you like to focus on right now?";
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('boost')) {
      response = "You've got this! 🌟 Remember: every small step forward is progress. The fact that you're here asking for help shows you're committed to change. What's one small thing you can accomplish in the next 10 minutes?";
    } else {
      response = "That's a great point! Let me help you tackle this systematically. Can you tell me more about what specific challenges you're facing? I'm here to provide personalized strategies that work for your situation.";
    }

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(inputValue);
    setInputValue('');
  };

  const handleQuickAction = (actionText: string) => {
    setInputValue(actionText);
    // Auto-focus the input after setting the text
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const quickActions = [
    { icon: Target, text: "Break down my project", color: "from-purple-500 to-pink-500" },
    { icon: Calendar, text: "Create a schedule", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Start focus session", color: "from-green-500 to-emerald-500" },
    { icon: Lightbulb, text: "Get motivation boost", color: "from-orange-500 to-yellow-500" }
  ];

  return (
    <>
      <Head>
        <title>AI Coach - FocusAI</title>
        <meta name="description" content="Chat with your AI productivity coach to stop procrastinating and stay focused" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold">Your AI Productivity Coach</h1>
                  <p className="text-white/80 text-sm sm:text-base">Ready to help you stop procrastinating</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-80 sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 sm:px-6 pb-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${action.color} text-white text-xs font-medium hover:scale-105 transition-transform shadow-lg`}
                  >
                    <action.icon className="w-3 sm:w-4 h-3 sm:h-4 mx-auto mb-1" />
                    <span className="text-xs">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-t border-gray-200/50">
              <div className="flex gap-2 sm:gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tell me what you're working on or what's blocking you..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-3 sm:w-4 h-3 sm:h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}