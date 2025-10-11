
// components/analytics/TimeDistribution.tsx
import React from "react";
import { PieChart } from "lucide-react";

interface TimeCategory {
  name: string;
  minutes: number;
  color: string;
}

export default function TimeDistribution({ categories }: { categories: TimeCategory[] }) {
  const total = categories.reduce((sum, cat) => sum + cat.minutes, 0);
  
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <PieChart className="w-6 h-6 text-blue-600" />
        Time Distribution
      </h3>
      
      <div className="space-y-4">
        {categories.map((cat) => {
          const percentage = ((cat.minutes / total) * 100).toFixed(1);
          return (
            <div key={cat.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                <span className="text-sm text-gray-500">
                  {Math.floor(cat.minutes / 60)}h {cat.minutes % 60}m ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${cat.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
