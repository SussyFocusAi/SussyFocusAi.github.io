// src/pages/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Send, Bot, User, Lightbulb, Target, Calendar, Zap, Mic, Image, X, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call Python FastAPI backend
  const callBackendAPI = async (userMessage: string, imageData?: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          image: imageData,
          history: messages.slice(-5).map(m => ({
            user: m.sender === 'user' ? m.text : '',
            ai: m.sender === 'ai' ? m.text : ''
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Backend API error');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API Error:', error);
      return simulateAIResponse(userMessage);
    }
  };

  const simulateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('procrastinating') || lowerMessage.includes('procrastination')) {
      return "I understand procrastination can be frustrating. Let's break this down: what specific task are you avoiding? I can help you create smaller, manageable steps that feel less overwhelming.";
    } else if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
      return "Deadlines can create pressure! Let me help you create a realistic timeline. When is your deadline, and what does your task involve? I'll help you work backwards to create a manageable schedule.";
    } else if (lowerMessage.includes('focused') || lowerMessage.includes('distracted')) {
      return "Staying focused is a skill we can build together. Try the 25-minute Focus Sprint: work for 25 minutes, then take a 5-minute break. I can send you reminders to keep you on track!";
    } else if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
      return "Motivation comes and goes, but systems create consistency. Let's identify your 'why' for this task and create small wins that build momentum. What outcome are you hoping to achieve?";
    } else if (lowerMessage.includes('break down') || lowerMessage.includes('project')) {
      return "Perfect! Let's break down your project step by step. First, tell me: What's the main goal of your project? Then we can identify the key milestones and create actionable tasks for each one.";
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('plan')) {
      return "Great idea! Let's create a realistic schedule. How much time do you typically have available each day? And what are your most productive hours? I'll help you optimize your schedule around your natural energy patterns.";
    } else if (lowerMessage.includes('focus session') || lowerMessage.includes('focus')) {
      return "Let's start a focus session! I recommend the Pomodoro Technique: 25 minutes of focused work, followed by a 5-minute break. What specific task would you like to focus on right now?";
    } else {
      return "That's a great point! Let me help you tackle this systematically. Can you tell me more about what specific challenges you're facing? I'm here to provide personalized strategies that work for your situation.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      image: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const response = await callBackendAPI(inputValue, uploadedImage || undefined);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);

    setInputValue('');
    setUploadedImage(null);
  };

  const handleQuickAction = (actionText: string) => {
    setInputValue(actionText);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
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
        <meta name="description" content="Chat with your AI productivity coach" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Chat Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-6 sm:p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 animate-pulse"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <Bot className="w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      AI Productivity Coach
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base">Always here to help you focus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[450px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                  )}

                  <div className="max-w-xs sm:max-w-md lg:max-w-lg">
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded" 
                        className="rounded-xl mb-2 max-h-48 object-cover shadow-lg"
                      />
                    )}
                    <div
                      className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Bot className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.text)}
                    className={`group p-3 sm:p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-xs sm:text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <action.icon className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {uploadedImage && (
              <div className="px-4 sm:px-6 py-3 bg-purple-50 border-t border-purple-100">
                <div className="relative inline-block">
                  <img src={uploadedImage} alt="Upload preview" className="h-20 rounded-lg shadow-md" />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-white">
              <div className="flex gap-2 sm:gap-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                    title="Upload image"
                  >
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    type="button"
                    onClick={handleVoiceRecord}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                      isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                    title="Voice input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Tell me what you're working on..."
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white text-sm sm:text-base transition-all duration-200"
                  disabled={isTyping}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                  className="px-5 sm:px-7 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
                >
                  <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>💡 Tip: Upload images, use voice input, or select quick actions for better assistance</p>
          </div>
        </div>
      </div>
    </>
  );
}