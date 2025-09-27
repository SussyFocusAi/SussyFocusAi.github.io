import React from "react";

interface Props {
  timeRange: "7d" | "30d" | "90d";
  setTimeRange: React.Dispatch<React.SetStateAction<"7d" | "30d" | "90d">>;
}
export default function RangeSelector({ timeRange, setTimeRange }: Props) {
  return (
    <div className="flex gap-2">
      {["7d", "30d", "90d"].map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range as any)}
          className={`px-4 py-2 rounded-lg transition-all ${
            timeRange === range
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
        </button>
      ))}
    </div>
  );
}
