// components/analytics/Insights.tsx
import React from "react";
import { TrendingUp } from "lucide-react";

export default function Insights() {
  const tips = [
    {
      color: "green",
      title: "Great Progress! 🎉",
      text: "You've increased your focus time by 25% this week compared to last week.",
    },
    {
      color: "blue",
      title: "Peak Hours 📈",
      text: "Your most productive time is between 10 AM - 12 PM. Schedule important tasks during this window.",
    },
    {
      color: "orange",
      title: "Improvement Area 💪",
      text: "Try breaking larger tasks into smaller chunks to maintain momentum throughout the day.",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-green-600" />
        Insights & Tips
      </h3>
      <div className="space-y-4">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className={`p-4 bg-${tip.color}-50 rounded-lg border-l-4 border-${tip.color}-500`}
          >
            <h4 className={`font-semibold text-${tip.color}-800 mb-1`}>{tip.title}</h4>
            <p className={`text-sm text-${tip.color}-700`}>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
