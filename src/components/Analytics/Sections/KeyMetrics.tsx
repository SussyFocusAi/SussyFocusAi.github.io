// components/analytics/KeyMetrics.tsx
import React from "react";
import { TrendingUp, Clock, Target, Zap, Activity, Award } from "lucide-react";

interface Stats {
  productivity: number;
  focusTime: number;
  tasksCompleted: number;
  streak: number;
  avgSessionTime: number;
  procrastinationReduction: number;
}

export default function KeyMetrics({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      {/* Productivity */}
      <MetricCard
        icon={<TrendingUp className="w-8 h-8 mb-3 opacity-80" />}
        label="Productivity Score"
        value={`${stats.productivity}%`}
        gradient="from-purple-500 to-pink-500"
      />
      {/* Focus Time */}
      <MetricCard
        icon={<Clock className="w-8 h-8 mb-3 opacity-80" />}
        label="Focus Time"
        value={`${Math.floor(stats.focusTime / 60)}h ${stats.focusTime % 60}m`}
        gradient="from-blue-500 to-cyan-500"
      />
      {/* Tasks Done */}
      <MetricCard
        icon={<Target className="w-8 h-8 mb-3 opacity-80" />}
        label="Tasks Done"
        value={stats.tasksCompleted}
        gradient="from-green-500 to-emerald-500"
      />
      {/* Streak */}
      <MetricCard
        icon={<Zap className="w-8 h-8 mb-3 opacity-80" />}
        label="Current Streak"
        value={stats.streak}
        gradient="from-orange-500 to-red-500"
      />
      {/* Avg Session */}
      <MetricCard
        icon={<Activity className="w-8 h-8 mb-3 opacity-80" />}
        label="Avg Session"
        value={`${stats.avgSessionTime}m`}
        gradient="from-indigo-500 to-purple-500"
      />
      {/* Procrastination Reduction */}
      <MetricCard
        icon={<Award className="w-8 h-8 mb-3 opacity-80" />}
        label="Less Procrastination"
        value={`${stats.procrastinationReduction}%`}
        gradient="from-pink-500 to-rose-500"
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-6 hover:scale-105 transition-transform`}
    >
      {icon}
      <p className="text-sm opacity-90 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
