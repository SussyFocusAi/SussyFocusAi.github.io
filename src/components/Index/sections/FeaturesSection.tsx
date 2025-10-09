// src/components/sections/FeaturesSection.tsx
import React, { useState } from 'react';
import { Brain, Calendar, Target, Zap, Sparkles, Info, X } from 'lucide-react';
import FeatureCard from '@/components/Index/FeatureCard';

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    { 
      icon: <Brain className="text-white w-6 h-6" />, 
      title: "Smart Task Breakdown", 
      description: "AI automatically breaks large projects into bite-sized, manageable steps that eliminate overwhelm",
      color: "from-purple-500 to-pink-500",
      stats: "90% less overwhelm",
      details: "Our AI analyzes your projects and intelligently divides them into achievable micro-tasks. It considers task dependencies, your available time, and energy levels to create the perfect workflow.",
      benefits: ["Reduces analysis paralysis", "Clear action steps", "Progress tracking", "Automatic prioritization"]
    },
    { 
      icon: <Calendar className="text-white w-6 h-6" />, 
      title: "Intelligent Scheduling", 
      description: "Dynamic scheduling that learns your patterns and adapts to your deadlines and energy levels",
      color: "from-blue-500 to-cyan-500",
      stats: "3x more productive",
      details: "Machine learning algorithms study your work patterns to schedule tasks when you're most likely to complete them successfully. It adapts in real-time to changes in your routine.",
      benefits: ["Peak performance timing", "Deadline optimization", "Energy-aware planning", "Automatic rescheduling"]
    },
    { 
      icon: <Target className="text-white w-6 h-6" />, 
      title: "Adaptive Reminders", 
      description: "Personalized nudges and motivational messages that inspire action without causing stress",
      color: "from-orange-500 to-red-500",
      stats: "85% completion rate",
      details: "Context-aware notifications that understand your current situation and mood. Get the right message at the right time, delivered in a way that motivates rather than stresses you.",
      benefits: ["Mood-based messaging", "Smart timing", "No notification fatigue", "Personalized motivation"]
    },
    { 
      icon: <Zap className="text-white w-6 h-6" />, 
      title: "Distraction Blocker", 
      description: "AI-powered focus mode that eliminates digital distractions during your most important work",
      color: "from-yellow-500 to-orange-500",
      stats: "4+ hours of deep work",
      details: "Intelligent blocking that learns which apps and websites distract you most. Creates distraction-free zones automatically when you need to focus on important tasks.",
      benefits: ["Smart app blocking", "Website filtering", "Focus time tracking", "Productivity insights"]
    },
  ];

  return (
    <section ref={featuresRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white via-purple-50/30 to-white" id="features">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
            Your AI <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Productivity Coach</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            FocusAI doesn't just organize your tasks—it transforms how you work, think, and achieve your goals
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Tooltip Info Button */}
              <button
                onClick={() => setSelectedFeature(index)}
                className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <Info className="w-4 h-4 text-white" />
              </button>

              {/* Stats Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className={`bg-gradient-to-r ${feature.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap`}>
                  {feature.stats}
                </div>
              </div>

              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature !== null && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedFeature(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-6 sm:p-8 bg-gradient-to-br ${features[selectedFeature].color} overflow-hidden`}>
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-white/90 hover:text-white transition-all hover:bg-white/20 rounded-lg p-1.5 sm:p-2"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="flex items-start gap-4 pr-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  {features[selectedFeature].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{features[selectedFeature].title}</h3>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">{features[selectedFeature].stats}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(85vh-140px)] sm:max-h-[calc(90vh-160px)]">
              <div className="mb-6">
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${features[selectedFeature].color}`}></div>
                  How it works
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{features[selectedFeature].details}</p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${features[selectedFeature].color}`}></div>
                  Key Benefits
                </h4>
                <div className="grid gap-3">
                  {features[selectedFeature].benefits.map((benefit, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${features[selectedFeature].color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}