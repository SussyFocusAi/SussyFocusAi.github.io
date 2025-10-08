// src/components/sections/PricingSection.tsx
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Zap, Users, Sparkles, Shield, Clock, Star, X } from 'lucide-react';
import Button from '../../Button';

interface PricingPlan {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  icon: React.ReactNode;
  color: string;
  savings?: string;
}

interface PricingSectionProps {
  pricingRef: React.RefObject<HTMLDivElement>;
}

export default function PricingSection({ pricingRef }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const pricing: PricingPlan[] = [
    {
      title: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for individuals getting started",
      features: [
        "Basic Task Management",
        "Simple Reminders",
        "Up to 10 projects",
        "Community Support",
        "Mobile App Access"
      ],
      popular: false,
      icon: <Sparkles className="w-5 h-5" />,
      color: "from-gray-600 to-gray-700"
    },
    {
      title: "Pro",
      price: isAnnual ? "$68" : "$6.77",
      period: isAnnual ? "/year" : "/month",
      description: "Advanced features for power users",
      features: [
        "Everything in Starter",
        "Full AI Scheduling",
        "Adaptive Reminders",
        "Distraction Blocker",
        "Unlimited Projects",
        "Priority Support",
        "Advanced Analytics",
        "Export Data"
      ],
      popular: true,
      icon: <Zap className="w-5 h-5" />,
      color: "from-purple-600 to-blue-600",
      savings: isAnnual ? "Save $13" : undefined
    },
    {
      title: "Team",
      price: isAnnual ? "$214" : "$21.41",
      period: isAnnual ? "/year" : "/month",
      description: "Collaboration for teams",
      features: [
        "Everything in Pro",
        "Team Collaboration",
        "Admin Controls",
        "Team Analytics",
        "Dedicated Manager",
        "Priority Onboarding",
        "SLA Guarantee"
      ],
      popular: false,
      icon: <Users className="w-5 h-5" />,
      color: "from-blue-600 to-cyan-600",
      savings: isAnnual ? "Save $43" : undefined
    },
  ];

  const comparisonData = [
    { feature: "Price", starter: "Free", pro: isAnnual ? "$68/year" : "$6.77/month", team: isAnnual ? "$214/year" : "$21.41/month" },
    { feature: "Projects", starter: "Up to 10", pro: "Unlimited", team: "Unlimited" },
    { feature: "Task Management", starter: "✓", pro: "✓", team: "✓" },
    { feature: "Simple Reminders", starter: "✓", pro: "✓", team: "✓" },
    { feature: "Mobile App Access", starter: "✓", pro: "✓", team: "✓" },
    { feature: "AI Scheduling", starter: "—", pro: "✓", team: "✓" },
    { feature: "Adaptive Reminders", starter: "—", pro: "✓", team: "✓" },
    { feature: "Distraction Blocker", starter: "—", pro: "✓", team: "✓" },
    { feature: "Advanced Analytics", starter: "—", pro: "✓", team: "✓" },
    { feature: "Export Data", starter: "—", pro: "✓", team: "✓" },
    { feature: "Team Collaboration", starter: "—", pro: "—", team: "✓" },
    { feature: "Admin Controls", starter: "—", pro: "—", team: "✓" },
    { feature: "Team Analytics", starter: "—", pro: "—", team: "✓" },
    { feature: "Dedicated Manager", starter: "—", pro: "—", team: "✓" },
    { feature: "Support", starter: "Community", pro: "Priority", team: "Priority + SLA" },
  ];

  return (
    <section ref={pricingRef} className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-purple-50/50" id="pricing">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4" />
            Pricing Plans
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your productivity goals
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                !isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Annual
              {!isAnnual && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  -17%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {pricing.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl transition-all duration-300 ${
                plan.popular 
                  ? 'shadow-2xl shadow-purple-200 md:scale-105 border-2 border-purple-500' 
                  : 'shadow-lg hover:shadow-xl border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className={`p-6 sm:p-8 ${plan.popular ? 'pt-10 sm:pt-12' : ''}`}>
                {/* Icon & Title */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} text-white mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-base">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-full">
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 sm:py-4 font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {plan.price !== 'Free' && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    14-day free trial • No credit card required
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Secure & Private</h4>
              <p className="text-xs text-gray-600">Bank-level encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Cancel Anytime</h4>
              <p className="text-xs text-gray-600">No contracts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Money-back</h4>
              <p className="text-xs text-gray-600">30-day guarantee</p>
            </div>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-gray-700 text-base sm:text-lg mb-3">Have questions about our plans?</p>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
          >
            View FAQ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Plan Comparison</h2>
                <p className="text-sm text-gray-600 mt-1">Compare all features across plans</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-[calc(90vh-100px)]">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b-2 border-gray-200 z-10">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-gray-900 bg-gray-50">Feature</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900 bg-gray-50/50">
                      <div className="flex flex-col items-center">
                        <Sparkles className="w-5 h-5 text-gray-600 mb-1" />
                        <span>Starter</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-bold bg-purple-50">
                      <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5 text-purple-600 mb-1" />
                        <span className="text-purple-600">Pro</span>
                        <span className="text-xs font-normal text-purple-600">Most Popular</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900 bg-gray-50/50">
                      <div className="flex flex-col items-center">
                        <Users className="w-5 h-5 text-blue-600 mb-1" />
                        <span>Team</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === 0 ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="text-center py-4 px-6 text-gray-700">{row.starter}</td>
                      <td className="text-center py-4 px-6 text-gray-700 bg-purple-50/20 font-medium">{row.pro}</td>
                      <td className="text-center py-4 px-6 text-gray-700">{row.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg px-8">
                Start Free Trial
              </Button>
              <button
                onClick={() => setShowModal(false)}
                className="px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-semibold text-gray-700 hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}