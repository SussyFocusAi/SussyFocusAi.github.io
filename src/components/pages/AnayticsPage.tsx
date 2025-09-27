"use client";
import React, { useState } from "react";

// Import section components
import HeaderSection from "../Analytics/Sections/HeaderSection";
import TimeRangeSection from "../Analytics/Sections/RangeSelector";
import MetricsSection from "../Analytics/Sections/KeyMetrics";
import WeeklyProgressSection from "../Analytics/Sections/WeeklyProgress";
import InsightsSection from "../Analytics/Sections/Insights";
import AchievementsSection from "../Analytics/Sections/Achievements";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const stats = {
    productivity: 85,
    focusTime: 245,
    tasksCompleted: 23,
    streak: 12,
    avgSessionTime: 35,
    procrastinationReduction: 67,
  };

  const weeklyData = [
    { day: "Mon", tasks: 5, focusTime: 120 },
    { day: "Tue", tasks: 3, focusTime: 90 },
    { day: "Wed", tasks: 7, focusTime: 180 },
    { day: "Thu", tasks: 4, focusTime: 150 },
    { day: "Fri", tasks: 6, focusTime: 200 },
    { day: "Sat", tasks: 2, focusTime: 60 },
    { day: "Sun", tasks: 1, focusTime: 30 },
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
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 font-sans">
      <div className="container mx-auto max-w-7xl space-y-12">
        <HeaderSection />
        <TimeRangeSection timeRange={timeRange} setTimeRange={setTimeRange} />
        <MetricsSection stats={stats} />
        <div className="grid lg:grid-cols-2 gap-8">
          <WeeklyProgressSection weeklyData={weeklyData} />
          <InsightsSection />
        </div>
        <AchievementsSection achievements={achievements} />
      </div>
    </main>
  );
}
