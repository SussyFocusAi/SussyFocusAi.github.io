// src/components/ChatPage.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Bot, User, Lightbulb, Target, Calendar, Zap, Mic, Image, X, Loader2, CheckCircle2, Circle, Clock, History, Edit3, Trash2, Sparkles, Menu, TrendingUp, Brain, Rocket, Award } from 'lucide-react';
import { Message, Task, SessionHistory } from '../../types/index';
import { callGeminiAPI } from '../../services/gemini-api'; 
import Link from 'next/link';
import { Settings, UserCircle } from 'lucide-react';

// Assuming the types and callGeminiAPI imports are correct for your environment

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Mock data (keep this for component function)
const initialMessages: Message[] = [
    {
        id: 1,
        text: "👋 Welcome to your **Personal Productivity AI**. I'm here to help you set goals, break down tasks, and stay motivated. What's the biggest challenge you're facing today?",
        sender: 'ai',
        timestamp: new Date()
    }
];

const mockHistory: SessionHistory[] = [
    { id: 101, title: 'Project Proposal Draft', date: '2 days ago' },
    { id: 102, title: 'Weekly Fitness Plan', date: 'Yesterday' },
    { id: 103, title: 'Time Blocking Strategy', date: 'Today' },
];

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentGoal, setCurrentGoal] = useState('Finish the initial design and code review.');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [history] = useState(mockHistory);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, tasks, scrollToBottom]);

    const parseAIResponse = useCallback((response: string) => {
        const taskPatterns = [
            /(?:^|\n)[-•]\s*(.+?)(?=\n|$)/gm,
            /(?:^|\n)\d+\.\s*(.+?)(?=\n|$)/gm
        ];

        const foundTasks: string[] = [];
        taskPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(response)) !== null) {
                const taskText = match[1].trim();
                if (taskText.length > 5 && taskText.length < 100 && !foundTasks.includes(taskText)) {
                    foundTasks.push(taskText);
                }
            }
        });

        if (foundTasks.length > 0 && foundTasks.length <= 10) {
            const newTasks = foundTasks.map(text => ({
                id: Date.now() + Math.random(),
                text: text.replace(/[*_`]/g, '').trim(),
                completed: false
            }));
            setTasks(prev => {
                const existingTexts = new Set(prev.map(t => t.text));
                const filteredNewTasks = newTasks.filter(t => !existingTexts.has(t.text));
                return [...prev, ...filteredNewTasks];
            });
        }

        const goalMatch = response.match(/(?:goal|focus|working on|aim):?\s*(.+?)(?:\.|!|\n|$)/i);
        if (goalMatch && goalMatch[1].length < 100) {
            setCurrentGoal(goalMatch[1].trim());
        }
    }, []);

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

        const msgText = inputValue;
        const imageToSend = uploadedImage;
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);

        setInputValue('');
        setUploadedImage(null);
        setIsTyping(true);

        try {
            // Note: callGeminiAPI must be defined and functional in your actual project
            const response = await callGeminiAPI({
                userMessage: msgText,
                imageData: imageToSend,
                messages: currentMessages,
                tasks,
                currentGoal
            });

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: response,
                sender: 'ai',
                timestamp: new Date()
            };

            parseAIResponse(response);
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "🚨 **Error:** Failed to connect to the AI. Check your API key and connection.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
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
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addQuickTask = (text: string) => {
        setTasks(prev => [...prev, { id: Date.now(), text, completed: false }]);
    };

    const deleteTask = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const quickActions = useMemo(() => ([
        { icon: Target, text: "Break down project", gradient: "from-violet-500 to-purple-600" },
        { icon: Calendar, text: "Plan my week", gradient: "from-blue-500 to-indigo-600" },
        { icon: Zap, text: "Time management help", gradient: "from-emerald-500 to-teal-600" },
        { icon: Lightbulb, text: "Overcome procrastination", gradient: "from-amber-500 to-orange-600" }
    ]), []);

    const apiKeySet = !!API_KEY;

    return (
        <div className="h-screen w-screen overflow-hidden bg-white flex">
            
            {/* --- LEFT SIDEBAR (Navigation/History) --- */}
            <aside className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 fixed lg:relative z-40 w-64 lg:w-56 xl:w-64 h-full 
                bg-gradient-to-b from-slate-900 to-slate-800 flex-shrink-0 
                flex flex-col transition-transform duration-300 ease-in-out 
            `}>
                
                {/* Sidebar Header */}
                <div className="p-4 border-b border-slate-700 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative w-9 h-9 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Bot className="w-4 h-4 text-white" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Focus AI</h1>
                            <p className="text-xs text-slate-400">Gemini Powered</p>
                        </div>
                    </div>

                    <button className="w-full px-3 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-500/30 mb-3">
                        + New Chat
                    </button>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-slate-800 rounded-lg p-2.5 shadow-inner shadow-slate-700/50">
                            <p className="text-[10px] text-slate-400 mb-0.5">This Week</p>
                            <p className="text-base font-bold text-white">24</p>
                            <p className="text-[10px] text-emerald-400">Tasks Done</p>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-2.5 shadow-inner shadow-slate-700/50">
                            <p className="text-[10px] text-slate-400 mb-0.5">Streak</p>
                            <p className="text-base font-bold text-white">🔥 7</p>
                            <p className="text-[10px] text-amber-400">Days</p>
                        </div>
                    </div>
                    {/* User Productivity Stats */}
                    <div className="p-2.5 bg-slate-800 rounded-xl shadow-inner space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Focus Level</span>
                            <span className="text-emerald-400 font-semibold">High</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Last Session</span>
                            <span className="text-slate-300">2 hrs ago</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>AI Interactions</span>
                            <span className="text-violet-400 font-semibold">128</span>
                        </div>
                    </div>

                </div>

                {/* Today's Focus */}
                <div className="px-4 py-2.5 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Today's Focus</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium line-clamp-2">{currentGoal || "Set a goal to begin!"}</p>
                </div>
                <div className="px-4 py-2">
                <Link href="/dashboard">
                <button className="w-full px-3 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </button>
               </Link>
               </div>


                {/* Chat History */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <h3 className="text-[10px] text-slate-400 font-semibold uppercase mb-2 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" />
                        Recent Sessions
                    </h3>
                    <div className="space-y-1.5">
                        {history.map(session => (
                            <div
                                key={session.id}
                                className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-all group"
                            >
                                <p className="text-xs text-slate-200 font-medium truncate group-hover:text-white">{session.title}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{session.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Items Summary (Bottom Left) */}
                <div className="px-4 py-3 border-t border-slate-700 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-fuchsia-400" />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Action Items</span>
                        </div>
                        <span className="px-2 py-0.5 bg-fuchsia-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-fuchsia-500/30">
                            {tasks.filter(t => t.completed).length}/{tasks.length}
                        </span>
                    </div>
                </div>
                {/* Profile / Settings Section (Bottom Corner) */}
                <div className="p-3 border-t border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <UserCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-white">My Profile</p>
                            <p className="text-[10px] text-slate-400">View & Edit</p>
                        </div>
                    </div>
                    <Link href="/settings">
                        <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition">
                            <Settings className="w-3.5 h-3.5" />
                        </button>
                    </Link>
                </div>

            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* --- MAIN CHAT AREA --- */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-b from-white to-gray-50">
                
                {/* Top Bar (for mobile/tablet) */}
                <div className="flex-shrink-0 px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Focus AI Assistant</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-emerald-700">Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto">
                    {messages.length === 1 && (
                        <div className="h-full flex flex-col items-center justify-center px-4">
                            <div className="max-w-3xl w-full text-center mb-12">
                                {/* Welcome Content */}
                                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                    <Bot className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-800 mb-4">How can I help you today?</h1>
                                <p className="text-lg text-gray-600 mb-8">I'm here to boost your productivity and help you achieve your goals.</p>

                                {/* Quick Actions Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                                    {quickActions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleQuickAction(action.text)}
                                            className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-violet-50 hover:to-purple-50 border-2 border-gray-200 hover:border-violet-300 text-left transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                                                <action.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 group-hover:text-violet-900">{action.text}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Example Prompts */}
                                <div className="space-y-3 max-w-2xl mx-auto">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-4">Try asking me:</p>
                                    <button
                                        onClick={() => handleQuickAction("Help me create a morning routine that sets me up for success")}
                                        className="w-full p-4 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-violet-300 rounded-xl transition-all group shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Brain className="w-5 h-5 text-violet-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Help me create a morning routine that sets me up for success</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleQuickAction("I have a big presentation next week. How should I prepare?")}
                                        className="w-full p-4 text-left bg-white hover:bg-gray-50 border border-gray-200 hover:border-violet-300 rounded-xl transition-all group shadow-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Rocket className="w-5 h-5 text-purple-500" />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900">I have a big presentation next week. How should I prepare?</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    {messages.length > 1 && (
                        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.sender === 'ai' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Upload"
                                                className="rounded-xl mb-3 max-h-64 object-cover shadow-lg border border-gray-200"
                                            />
                                        )}
                                        <div className={`inline-block px-5 py-3 rounded-2xl transition-all ${
                                            message.sender === 'user'
                                                ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-xl rounded-br-md'
                                                : 'bg-gray-100 text-gray-800 rounded-tl-md shadow-md border border-gray-200'
                                            }`}>
                                            <p className="text-[15px] leading-relaxed whitespace-pre-line"
                                                dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }}
                                            />
                                            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-violet-200' : 'text-gray-500'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {message.sender === 'user' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-4 justify-start">
                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 px-5 py-3 rounded-2xl">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
                    <div className="max-w-3xl mx-auto px-4 py-4">
                        {uploadedImage && (
                            <div className="flex items-center justify-between p-3 mb-3 bg-violet-50 border border-violet-200 rounded-xl shadow-md">
                                <div className="flex items-center gap-3">
                                    <img src={uploadedImage} alt="Preview" className="h-10 w-10 object-cover rounded-lg" />
                                    <span className="text-sm text-violet-900 font-medium">Image attached</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setUploadedImage(null)}
                                    className="p-1 text-violet-600 hover:text-violet-800 hover:bg-violet-100 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="relative">
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

                            <div className="flex items-end gap-2 p-2 bg-gray-100 rounded-3xl shadow-lg border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-violet-600 hover:bg-white rounded-xl transition-all flex-shrink-0"
                                    title="Upload Image"
                                >
                                    <Image className="w-5 h-5" />
                                </button>

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Message Focus AI..."
                                    className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-[15px]"
                                    disabled={isTyping}
                                />

                                <button
                                    type="button"
                                    onClick={() => setIsRecording(!isRecording)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all flex-shrink-0 ${
                                        isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-600 hover:text-violet-600 hover:bg-white'
                                    }`}
                                    title="Voice Input (Mock)"
                                >
                                    <Mic className="w-5 h-5" />
                                </button>

                                <button
                                    type="submit"
                                    disabled={(!inputValue.trim() && !uploadedImage) || isTyping}
                                    className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-xl shadow-purple-500/40"
                                    title="Send Message"
                                >
                                    {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-gray-500 text-center mt-2">
                            Focus AI can make mistakes. Check important info.
                        </p>
                    </div>
                </div>

                {/* API Key Warning */}
                {!apiKeySet && (
                    <div className="flex-shrink-0 px-4 py-3 bg-red-50 border-t border-red-200">
                        <p className="text-sm text-red-800 text-center font-semibold">
                            🚨 API KEY MISSING: Set <code className="px-2 py-1 bg-red-100 rounded font-mono text-xs">NEXT_PUBLIC_GEMINI_API_KEY</code> in <code className="px-2 py-1 bg-red-100 rounded font-mono text-xs">.env.local</code>
                        </p>
                    </div>
                )}
            </div>

            {/* --- RIGHT SIDEBAR (Tasks) --- */}
            <aside className="hidden xl:flex w-64 2xl:w-72 bg-white border-l border-gray-200 flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <Target className="w-4 h-4 text-fuchsia-500" />
                            Action Items
                        </h2>
                        <span className="px-2 py-0.5 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white rounded-lg text-xs font-bold shadow-md shadow-fuchsia-500/30">
                            {tasks.filter(t => t.completed).length}/{tasks.length}
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {tasks.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                <Sparkles className="w-6 h-6 text-violet-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mb-1">No tasks yet!</p>
                            <p className="text-xs text-gray-500">Chat with AI to generate tasks</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div
                                key={task.id}
                                className={`group flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                                    task.completed
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                        : 'bg-white border-gray-200 hover:border-violet-300 hover:shadow-md'
                                }`}
                            >
                                <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 mt-0.5">
                                    {task.completed ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Circle className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                    )}
                                </button>
                                <span className={`text-xs flex-1 leading-relaxed ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 font-medium'}`}>
                                    {task.text}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Add a quick task..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    addQuickTask(e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                }
                            }}
                            className="flex-1 text-xs py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none shadow-sm"
                        />
                        <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <Edit3 className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}