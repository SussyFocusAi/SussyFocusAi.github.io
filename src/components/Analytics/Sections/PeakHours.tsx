
// components/analytics/PeakHours.tsx
import React from "react";
import { Clock } from "lucide-react";

interface HourData {
  hour: number;
  productivity: number;
}

export default function PeakHours({ hourlyData }: { hourlyData: HourData[] }) {
  const maxProductivity = Math.max(...hourlyData.map(h => h.productivity));
  
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-orange-600" />
        Peak Productivity Hours
      </h3>
      
      <div className="flex items-end justify-between gap-2 h-48">
        {hourlyData.map((hour) => {
          const height = (hour.productivity / maxProductivity) * 100;
          const isPeak = hour.productivity === maxProductivity;
          
          return (
            <div key={hour.hour} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full group">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isPeak ? 'bg-gradient-to-t from-orange-500 to-yellow-400' : 'bg-gradient-to-t from-blue-400 to-blue-300'
                  } hover:opacity-80 cursor-pointer`}
                  style={{ height: `${height}%` }}
                >
                  {isPeak && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      Peak!
                    </div>
                  )}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {hour.productivity}% productive
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">
                {hour.hour === 0 ? '12am' : hour.hour < 12 ? `${hour.hour}am` : hour.hour === 12 ? '12pm' : `${hour.hour - 12}pm`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
