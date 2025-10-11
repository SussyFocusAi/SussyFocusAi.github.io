"use client";
import React, { useState } from "react";
import { Clock, Target, Zap, Brain } from "lucide-react";

// Import existing section components
import HeaderSection from "../Analytics/Sections/HeaderSection";
import TimeRangeSection from "../Analytics/Sections/RangeSelector";
import MetricsSection from "../Analytics/Sections/KeyMetrics";
import WeeklyProgressSection from "../Analytics/Sections/WeeklyProgress";
import InsightsSection from "../Analytics/Sections/Insights";
import AchievementsSection from "../Analytics/Sections/Achievements";

// Import NEW components
import ProductivityHeatmap from "../Analytics/Sections/ProductivityHeatmap";
import TimeDistribution from "../Analytics/Sections/TimeDistribution";
import FocusScore from "../Analytics/Sections/FocusScore";
import PeakHours from "../Analytics/Sections/PeakHours";
import GoalsProgress from "../Analytics/Sections/GoalProgress";
import ComparisonCard from "../Analytics/Sections/ComparisonCard";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  // Existing stats
  const stats = {
    productivity: 85,
    focusTime: 245,
    tasksCompleted: 23,
    streak: 12,
    avgSessionTime: 35,
    procrastinationReduction: 67,
  };

  // Existing weekly data
  const weeklyData = [
    { day: "Mon", tasks: 5, focusTime: 120 },
    { day: "Tue", tasks: 3, focusTime: 90 },
    { day: "Wed", tasks: 7, focusTime: 180 },
    { day: "Thu", tasks: 4, focusTime: 150 },
    { day: "Fri", tasks: 6, focusTime: 200 },
    { day: "Sat", tasks: 2, focusTime: 60 },
    { day: "Sun", tasks: 1, focusTime: 30 },
  ];

  // Existing achievements
  const achievements = [
    { title: "Focus Master", description: "Completed 10 focus sessions", icon: "🎯", unlocked: true },
    { title: "Streak Champion", description: "7-day productivity streak", icon: "🔥", unlocked: true },
    { title: "Task Crusher", description: "Completed 50 tasks", icon: "💪", unlocked: true },
    { title: "Early Bird", description: "Start work before 8 AM", icon: "🌅", unlocked: false },
    { title: "Night Owl", description: "Work past 10 PM", icon: "🦉", unlocked: false },
    { title: "Deadline Hero", description: "Never miss a deadline", icon: "⚡", unlocked: false },
  ];

  // NEW DATA - Heatmap (last 49 days)
  const heatmapData = Array.from({ length: 49 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (48 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.floor(Math.random() * 12), // Random for demo, replace with real data
    };
  });

  // NEW DATA - Time Distribution
  const timeCategories = [
    { name: "Deep Work", minutes: 420, color: "bg-gradient-to-r from-purple-500 to-blue-500" },
    { name: "Meetings", minutes: 180, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { name: "Learning", minutes: 150, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { name: "Planning", minutes: 90, color: "bg-gradient-to-r from-orange-500 to-yellow-500" },
    { name: "Breaks", minutes: 120, color: "bg-gradient-to-r from-pink-500 to-rose-500" },
  ];

  // NEW DATA - Peak Hours (24 hours)
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    productivity: hour >= 8 && hour <= 18 
      ? 50 + Math.random() * 50  // Work hours: 50-100%
      : Math.random() * 40,       // Off hours: 0-40%
  }));

  // NEW DATA - Goals
  const goals = [
    { 
      id: "1", 
      title: "Complete 50 tasks this month", 
      current: 42, 
      target: 50, 
      unit: "tasks", 
      deadline: "Dec 31" 
    },
    { 
      id: "2", 
      title: "Focus for 30 hours", 
      current: 23, 
      target: 30, 
      unit: "hours", 
      deadline: "Dec 31" 
    },
    { 
      id: "3", 
      title: "Maintain 14-day streak", 
      current: 12, 
      target: 14, 
      unit: "days", 
      deadline: "Dec 20" 
    },
  ];

  // NEW DATA - Comparison (current vs previous period)
  const comparisons = [
    {
      title: "Tasks Completed",
      current: 42,
      previous: 35,
      unit: "tasks",
      icon: <Target className="w-5 h-5 text-white" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Focus Time",
      current: 345,
      previous: 280,
      unit: "minutes",
      icon: <Clock className="w-5 h-5 text-white" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Productivity Score",
      current: 87,
      previous: 79,
      unit: "points",
      icon: <Zap className="w-5 h-5 text-white" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Focus Score",
      current: 92,
      previous: 88,
      unit: "score",
      icon: <Brain className="w-5 h-5 text-white" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 font-sans bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header with Time Range */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <HeaderSection />
          <TimeRangeSection timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        {/* Key Metrics */}
        <MetricsSection stats={stats} />

        {/* NEW: Focus Score - Big Highlight Card */}
        <FocusScore score={92} change={4.2} />

        {/* Weekly Progress + Time Distribution Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <WeeklyProgressSection weeklyData={weeklyData} />
          <TimeDistribution categories={timeCategories} />
        </div>

        {/* NEW: Peak Hours - Full Width */}
        <PeakHours hourlyData={hourlyData} />

        {/* NEW: Productivity Heatmap - Full Width */}
        <ProductivityHeatmap data={heatmapData} />

        {/* NEW: Goals Progress */}
        <GoalsProgress goals={goals} />

        {/* NEW: Period Comparison */}
        <ComparisonCard comparisons={comparisons} />

        {/* Achievements + Insights Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AchievementsSection achievements={achievements} />
          <InsightsSection />
        </div>
      </div>
    </main>
  );
}