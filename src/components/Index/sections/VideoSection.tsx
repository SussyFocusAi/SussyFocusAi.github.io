// src/components/Index/sections/VideoSection.tsx
import React from "react";

export default function VideoSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Watch Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Quick Demo</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how FocusAI helps you stop procrastinating and start achieving your goals.
          </p>
        </div>

        {/* Video container with better styling to match your design */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
          <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src=""
              title="FocusAI Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}