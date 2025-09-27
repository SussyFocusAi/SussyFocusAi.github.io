// components/analytics/WeeklyProgress.tsx
import React from "react";
import { BarChart3 } from "lucide-react";

interface DayData {
  day: string;
  tasks: number;
  focusTime: number;
}

export default function WeeklyProgress({ weeklyData }: { weeklyData: DayData[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-purple-600" />
        Weekly Progress
      </h3>
      <div className="space-y-4">
        {weeklyData.map((day) => (
          <div key={day.day} className="flex items-center gap-4">
            <span className="w-12 text-sm font-medium text-gray-600">{day.day}</span>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tasks: {day.tasks}</span>
                <span>Focus: {day.focusTime}m</span>
              </div>
              <div className="flex gap-2">
                <ProgressBar
                  width={(day.tasks / 7) * 100}
                  gradient="from-purple-500 to-blue-500"
                />
                <ProgressBar
                  width={(day.focusTime / 200) * 100}
                  gradient="from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ width, gradient }: { width: number; gradient: string }) {
  return (
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div
        className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
