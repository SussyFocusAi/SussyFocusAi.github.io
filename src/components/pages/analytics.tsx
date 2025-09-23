// src/components/pages/AnalyticsPage.tsx
import React, { useState } from 'react';
import { TrendingUp, Target, Clock, Zap, Calendar, Award, BarChart3, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = {
    productivity: 85,
    focusTime: 245, // minutes
    tasksCompleted: 23,
    streak: 12,
    avgSessionTime: 35, // minutes
    procrastinationReduction: 67 // percentage
  };

  const weeklyData = [
    { day: 'Mon', tasks: 5, focusTime: 120 },
    { day: 'Tue', tasks: 3, focusTime: 90 },
    { day: 'Wed', tasks: 7, focusTime: 180 },
    { day: 'Thu', tasks: 4, focusTime: 150 },
    { day: 'Fri', tasks: 6, focusTime: 200 },
    { day: 'Sat', tasks: 2, focusTime: 60 },
    { day: 'Sun', tasks: 1, focusTime: 30 },
  ];

  const achievements = [
    { title: "Focus Master", description: "Completed 10 focus sessions", icon: "🎯", unlocked: true },
    { title: "Streak Champion", description: "7-day productivity streak", icon: "🔥", unlocked: true },
    { title: "Task Crusher", description: "Completed 50 tasks", icon: "💪", unlocked: true },
    { title: "Early Bird", description: "Start work before 8 AM", icon: "🌅", unlocked: false },
    { title: "Night Owl", description: "Work past 10 PM", icon: "🦉", unlocked: false },
    { title: "Deadline Hero", description: "Never miss a deadline", icon: "⚡", unlocked: false },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Analytics</span> Dashboard
          </h1>
          <p className="text-lg text-gray-600">Track your productivity journey and celebrate your progress</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Productivity Score</p>
            <p className="text-3xl font-bold">{stats.productivity}%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <Clock className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Focus Time</p>
            <p className="text-3xl font-bold">{Math.floor(stats.focusTime / 60)}h {stats.focusTime % 60}m</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <Target className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Tasks Done</p>
            <p className="text-3xl font-bold">{stats.tasksCompleted}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <Zap className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Current Streak</p>
            <p className="text-3xl font-bold">{stats.streak}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <Activity className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Avg Session</p>
            <p className="text-3xl font-bold">{stats.avgSessionTime}m</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-6 hover:scale-105 transition-transform">
            <Award className="w-8 h-8 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">Less Procrastination</p>
            <p className="text-3xl font-bold">{stats.procrastinationReduction}%</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Weekly Progress
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium text-gray-600">{day.day}</span>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Tasks: {day.tasks}</span>
                      <span>Focus: {day.focusTime}m</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.tasks / 7) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.focusTime / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Insights */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Insights & Tips
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800 mb-1">Great Progress! 🎉</h4>
                <p className="text-sm text-green-700">You've increased your focus time by 25% this week compared to last week.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-1">Peak Hours 📈</h4>
                <p className="text-sm text-blue-700">Your most productive time is between 10 AM - 12 PM. Schedule important tasks during this window.</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 mb-1">Improvement Area 💪</h4>
                <p className="text-sm text-orange-700">Try breaking larger tasks into smaller chunks to maintain momentum throughout the day.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-8 h-8 text-yellow-600" />
            Achievements
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:scale-105' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'}`}>
                    {achievement.title}
                  </h4>
                </div>
                <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                    Unlocked!
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}