// src/components/sections/PricingSection.tsx
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../Button';

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface PricingSectionProps {
  pricingRef: React.RefObject<HTMLDivElement>;
}

export default function PricingSection({ pricingRef }: PricingSectionProps) {
  const pricing: PricingPlan[] = [
    { 
      title: "Starter", 
      price: "Free", 
      period: "forever",
      features: ["Basic Task Management", "Simple Reminders", "Up to 10 projects", "Community Support"],
      popular: false
    },
    { 
      title: "Pro", 
      price: "$6.77", 
      period: "/month",
      features: ["Full AI Scheduling", "Adaptive Reminders", "Distraction Blocker", "Unlimited Projects", "Priority Support", "Analytics Dashboard"],
      popular: true
    },
    { 
      title: "Team", 
      price: "$21.41", 
      period: "/month",
      features: ["All Pro Features", "Team Collaboration", "Admin Controls", "Custom Integrations", "Dedicated Success Manager", "Advanced Analytics"],
      popular: false
    },
  ];

  return (
    <section ref={pricingRef} className="py-16 sm:py-20 px-4 sm:px-6" id="pricing">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg sm:text-xl text-gray-600">Choose the plan that fits your productivity goals</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {pricing.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                plan.popular ? 'ring-4 ring-purple-500 lg:scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1 text-sm sm:text-base">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full transform transition-all duration-300 hover:scale-105 active:scale-95">
                  {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}