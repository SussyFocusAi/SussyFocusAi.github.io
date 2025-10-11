
// components/analytics/ComparisonCard.tsx
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Comparison {
  title: string;
  current: number;
  previous: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export default function ComparisonCard({ comparisons }: { comparisons: Comparison[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4">Period Comparison</h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {comparisons.map((comp) => {
          const change = comp.current - comp.previous;
          const percentChange = comp.previous ? ((change / comp.previous) * 100).toFixed(1) : '0';
          const isPositive = change > 0;
          const isNeutral = change === 0;
          
          return (
            <div key={comp.title} className={`p-4 rounded-xl border-2 bg-gradient-to-br ${comp.color}`}>
              <div className="flex items-center gap-2 mb-3">
                {comp.icon}
                <h4 className="font-semibold text-white">{comp.title}</h4>
              </div>
              
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{comp.current}</span>
                <span className="text-sm text-white/80 mb-1">{comp.unit}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {isNeutral ? (
                  <Minus className="w-4 h-4 text-white/80" />
                ) : isPositive ? (
                  <TrendingUp className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-white" />
                )}
                <span className="text-sm text-white">
                  {isNeutral ? 'No change' : `${isPositive ? '+' : ''}${percentChange}%`} from last period
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}