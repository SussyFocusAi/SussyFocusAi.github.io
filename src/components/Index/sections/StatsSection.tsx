// src/components/sections/StatsSection.tsx
import React from 'react';

interface StatsData {
  number: string;
  label: string;
  color: string;
}

interface StatsSectionProps {
  currentStat: number;
}

export default function StatsSection({ currentStat }: StatsSectionProps) {
  const stats: StatsData[] = [
    { number: "67+", label: "Active Users", color: "from-purple-500 to-pink-500" },
    { number: "67%", label: "Less Procrastination", color: "from-blue-500 to-cyan-500" },
    { number: "6.7x", label: "More Productive", color: "from-green-500 to-emerald-500" },
    { number: "67min", label: "Time Saved Daily", color: "from-orange-500 to-red-500" }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-y border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`space-y-2 transform transition-all duration-500 hover:scale-110 ${
                currentStat === index ? 'animate-pulse' : ''
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}