// src/components/Index/sections/VideoSection.tsx
import React from "react";

export default function VideoSection() {
  return (
    <section className="relative bg-white/80 backdrop-blur-md py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Watch Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Quick Demo</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how our platform helps you stop procrastinating and start achieving.
        </p>

        {/* Responsive 16:9 YouTube embed */}
        <div className="relative w-full pb-[56.25%] rounded-2xl overflow-hidden shadow-xl">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/pD8mxge6kek?si=rMsClKfRMx1QsAOG"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
