// src/components/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, Plus, Target, Zap } from 'lucide-react';
import Button from '../Button';

export default function DashboardPage() {
  const [tasks] = useState([
    { id: 1, title: "Complete React Project", progress: 75, dueDate: "2025-01-15", priority: "high" },
    { id: 2, title: "Study for Finals", progress: 45, dueDate: "2025-01-20", priority: "high" },
    { id: 3, title: "Write Blog Post", progress: 20, dueDate: "2025-01-18", priority: "medium" },
    { id: 4, title: "Plan Weekend Trip", progress: 90, dueDate: "2025-01-12", priority: "low" }
  ]);

  const [stats] = useState({
    completedToday: 3,
    totalTasks: 12,
    focusTime: 185, // minutes
    streak: 7
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Welcome back! <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ready to focus?</span>
          </h1>
          <p className="text-lg text-gray-600">Here's your productivity overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completedToday}</span>
            </div>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-500" />
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalTasks}</span>
            </div>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.focusTime}m</span>
            </div>
            <p className="text-sm text-gray-600">Focus Time</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.streak}</span>
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left">
              <Plus className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Add New Task</h3>
              <p className="text-sm opacity-90">Create a new task and let AI break it down</p>
            </button>

            <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left">
              <Zap className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Start Focus Session</h3>
              <p className="text-sm opacity-90">Begin a 25-minute focused work session</p>
            </button>

            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left">
              <Calendar className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">View Schedule</h3>
              <p className="text-sm opacity-90">See your optimized daily schedule</p>
            </button>
          </div>
        </div>

        {/* Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Tasks</h2>
            <Button>View All Tasks</Button>
          </div>

          <div className="grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due {task.dueDate}
                      </span>
                      <span>{task.progress}% complete</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    
                    <Button size="sm">Continue</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}