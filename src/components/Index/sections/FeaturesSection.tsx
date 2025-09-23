// src/components/sections/FeaturesSection.tsx
import React from 'react';
import { Brain, Calendar, Target, Zap } from 'lucide-react';
import FeatureCard from '@/components/Index/FeatureCard';

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  const features = [
    { 
      icon: <Brain className="text-white w-6 h-6" />, 
      title: "Smart Task Breakdown", 
      description: "AI automatically breaks large projects into bite-sized, manageable steps that eliminate overwhelm"
    },
    { 
      icon: <Calendar className="text-white w-6 h-6" />, 
      title: "Intelligent Scheduling", 
      description: "Dynamic scheduling that learns your patterns and adapts to your deadlines and energy levels"
    },
    { 
      icon: <Target className="text-white w-6 h-6" />, 
      title: "Adaptive Reminders", 
      description: "Personalized nudges and motivational messages that inspire action without causing stress"
    },
    { 
      icon: <Zap className="text-white w-6 h-6" />, 
      title: "Distraction Blocker", 
      description: "AI-powered focus mode that eliminates digital distractions during your most important work"
    },
  ];

  return (
    <section ref={featuresRef} className="py-16 sm:py-20 px-4 sm:px-6" id="features">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
            Your AI <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Productivity Coach</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            FocusAI doesn't just organize your tasks—it transforms how you work, think, and achieve your goals
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}