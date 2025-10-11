// components/analytics/ProductivityHeatmap.tsx
import React from "react";
import { Calendar } from "lucide-react";

interface HeatmapData {
  date: string;
  value: number;
}

export default function ProductivityHeatmap({ data }: { data: HeatmapData[] }) {
  const getColorIntensity = (value: number) => {
    if (value === 0) return "bg-gray-100";
    if (value < 3) return "bg-purple-200";
    if (value < 6) return "bg-purple-400";
    if (value < 9) return "bg-purple-600";
    return "bg-purple-800";
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-purple-600" />
        Activity Heatmap
      </h3>
      <p className="text-sm text-gray-600 mb-4">Your productivity patterns over time</p>
      
      <div className="grid grid-cols-7 gap-2">
        {data.map((day, idx) => (
          <div
            key={idx}
            className={`aspect-square rounded-lg ${getColorIntensity(day.value)} hover:scale-110 transition-all cursor-pointer group relative`}
            title={`${day.date}: ${day.value} tasks`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {day.date}: {day.value} tasks
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
        <span>Less productive</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <div className="w-4 h-4 rounded bg-purple-200"></div>
          <div className="w-4 h-4 rounded bg-purple-400"></div>
          <div className="w-4 h-4 rounded bg-purple-600"></div>
          <div className="w-4 h-4 rounded bg-purple-800"></div>
        </div>
        <span>More productive</span>
      </div>
    </div>
  );
}

