
// components/analytics/FocusScore.tsx
import React from "react";
import { Brain, TrendingUp, TrendingDown } from "lucide-react";

export default function FocusScore({ score, change }: { score: number; change: number }) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" />
            <h3 className="text-xl font-bold">Focus Score</h3>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isPositive ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">{isPositive ? '+' : ''}{change}%</span>
          </div>
        </div>
        
        <div className="flex items-end gap-4">
          <div className="text-6xl font-bold">{score}</div>
          <div className="text-2xl opacity-80 mb-2">/100</div>
        </div>
        
        <p className="text-sm opacity-90 mt-4">
          {score >= 80 ? "🔥 Excellent focus! Keep it up!" : 
           score >= 60 ? "💪 Good progress! You're on track." :
           score >= 40 ? "📈 Making progress. Stay consistent!" :
           "🎯 Time to refocus. You've got this!"}
        </p>
      </div>
    </div>
  );
}