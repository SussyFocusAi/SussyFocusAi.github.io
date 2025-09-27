// components/analytics/Achievements.tsx
import React from "react";
import { Award } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export default function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="w-8 h-8 text-yellow-600" />
        Achievements
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((a) => (
          <div
            key={a.title}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              a.unlocked
                ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:scale-105"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{a.icon}</span>
              <h4
                className={`font-semibold ${
                  a.unlocked ? "text-yellow-800" : "text-gray-600"
                }`}
              >
                {a.title}
              </h4>
            </div>
            <p
              className={`text-sm ${
                a.unlocked ? "text-yellow-700" : "text-gray-500"
              }`}
            >
              {a.description}
            </p>
            {a.unlocked && (
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                Unlocked!
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
