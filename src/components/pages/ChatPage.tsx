import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Lightbulb, Target, Calendar, Zap, Mic, Image, X, Sparkles, Loader2, CheckCircle2, Circle } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI productivity coach. What would you like to work on today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health', { method: 'GET' });
      setConnectionStatus(response.ok ? 'online' : 'offline');
    } catch {
      setConnectionStatus('offline');
    }
  };

  const callBackendAPI = async (userMessage: string, imageData?: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          image: imageData,
          history: messages.slice(-5).map(m => ({
            user: m.sender === 'user' ? m.text : '',
            ai: m.sender === 'ai' ? m.text : ''
          })),
          context: { tasks, currentGoal }
        }),
      });

      if (!response.ok) throw new Error('Backend error');
      
      const data = await response.json();
      setConnectionStatus('online');
      
      if (data.tasks) setTasks(data.tasks);
      if (data.goal) setCurrentGoal(data.goal);
      
      return data.response;
    } catch (error) {
      setConnectionStatus('offline');
      return "I'm having trouble connecting to the backend. Please make sure the server is running at http://localhost:8000";
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
    const msgText = inputValue;
    setInputValue('');
    setUploadedImage(null);
    setIsTyping(true);

    const response = await callBackendAPI(msgText, uploadedImage || undefined);

    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 400);
  };

  const handleQuickAction = (actionText: string) => {
    setInputValue(actionText);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addQuickTask = (text: string) => {
    setTasks([...tasks, { id: Date.now(), text, completed: false }]);
  };

  const quickActions = [
    { icon: Target, text: "Break down project", gradient: "from-purple-500 to-pink-500" },
    { icon: Calendar, text: "Plan my day", gradient: "from-blue-500 to-cyan-500" },
    { icon: Zap, text: "Focus session", gradient: "from-green-500 to-emerald-500" },
    { icon: Lightbulb, text: "Get motivated", gradient: "from-orange-500 to-yellow-500" }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col">
      {/* Clean Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                connectionStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Productivity Coach</h1>
              <p className="text-sm text-gray-500">Your focus companion</p>
            </div>
          </div>
          
          {currentGoal && (
            <div className="hidden lg:block px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-purple-600 font-medium">Goal: {currentGoal}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-8 py-6">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* Chat Section */}
            <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div className="max-w-[70%]">
                      {message.image && (
                        <img src={message.image} alt="Upload" className="rounded-lg mb-2 max-h-48 object-cover" />
                      )}
                      <div className={`px-4 py-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                        <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <div className="w-9 h-9 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 px-5 py-3 rounded-lg">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.text)}
                      className={`p-3 rounded-lg bg-gradient-to-r ${action.gradient} text-white hover:opacity-90 transition-opacity`}
                    >
                      <action.icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs font-medium block">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {uploadedImage && (
                <div className="flex-shrink-0 px-6 py-2 bg-purple-50 border-t border-purple-200">
                  <div className="relative inline-block">
                    <img src={uploadedImage} alt="Preview" className="h-16 rounded-lg" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e))}
                    placeholder="What are you working on?"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="font-medium">Send</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col gap-4">
              
              {/* Tasks */}
              <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Tasks
                  </h2>
                  <span className="px-2.5 py-1 bg-purple-100 rounded-full text-xs text-purple-700 font-bold">
                    {tasks.filter(t => t.completed).length}/{tasks.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Circle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm flex-1 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.text}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => addQuickTask('Check emails')}
                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-xs text-blue-700 font-medium transition-colors"
                    >
                      Emails
                    </button>
                    <button
                      onClick={() => addQuickTask('Workout')}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-xs text-green-700 font-medium transition-colors"
                    >
                      Exercise
                    </button>
                    <button
                      onClick={() => addQuickTask('Read')}
                      className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-xs text-purple-700 font-medium transition-colors"
                    >
                      Reading
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Stats
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Completed</span>
                    <span className="text-xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-700">Sessions</span>
                    <span className="text-xl font-bold text-purple-600">0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-700">Streak</span>
                    <span className="text-xl font-bold text-orange-600">1 🔥</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Connection Warning */}
      {connectionStatus === 'offline' && (
        <div className="flex-shrink-0 px-8 py-3 bg-amber-50 border-t border-amber-200">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-amber-800 text-center">
              ⚠️ Backend offline. Run: <code className="bg-amber-200 px-2 py-0.5 rounded font-mono text-xs">python backend/main.py</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}