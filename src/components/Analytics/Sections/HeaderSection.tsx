import React from "react";

export default function HeaderSection() {
  return (
    <header className="mb-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Analytics
        </span>{" "}
        Dashboard
      </h1>
      <p className="text-lg text-gray-600">
        Track your productivity journey and celebrate your progress
      </p>
    </header>
  );
}
