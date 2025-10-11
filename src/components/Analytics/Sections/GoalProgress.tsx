
// components/analytics/GoalsProgress.tsx
import React from "react";
import { Target, CheckCircle2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

export default function GoalsProgress({ goals }: { goals: Goal[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Target className="w-6 h-6 text-green-600" />
        Goals Progress
      </h3>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const isComplete = progress >= 100;
          
          return (
            <div key={goal.id} className={`p-4 rounded-xl border-2 transition-all ${
              isComplete ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    {isComplete && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {goal.current} / {goal.target} {goal.unit}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{goal.deadline}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-600">{progress.toFixed(0)}% complete</span>
                {!isComplete && (
                  <span className="text-xs font-medium text-purple-600">
                    {goal.target - goal.current} {goal.unit} to go
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
