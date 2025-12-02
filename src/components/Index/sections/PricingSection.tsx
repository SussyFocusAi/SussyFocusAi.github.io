import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Zap, Users, Sparkles, Shield, Clock, Star, X } from 'lucide-react';

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
  // The type of the ref is correct: a RefObject pointing to an HTMLDivElement
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
    // FIX: The pricingRef prop must be passed to the 'ref' attribute of the element you want to reference.
    // The previous code already had `ref={pricingRef}`, which was correct, but I'll make sure it's clear.
    <section ref={pricingRef} className="relative py-20 lg:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-sm border border-purple-200/50 backdrop-blur-sm">
            <Star className="w-4 h-4 animate-pulse" />
            Pricing Plans
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your productivity goals. Start free, upgrade anytime.
          </p>

          {/* Enhanced Billing Toggle */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-lg border border-purple-200/50">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                !isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                isAnnual
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg animate-bounce">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricing.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/90 backdrop-blur-sm rounded-3xl transition-all duration-500 hover:translate-y-[-8px] group ${
                plan.popular 
                  ? 'shadow-2xl shadow-purple-200/50 lg:scale-105 border-2 border-purple-400 ring-4 ring-purple-100' 
                  : 'shadow-xl hover:shadow-2xl border border-gray-200/50'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-xl whitespace-nowrap animate-pulse">
                    ⭐ Most Popular
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className={`relative p-8 ${plan.popular ? 'pt-14' : ''}`}>
                {/* Icon & Title */}
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.title}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 text-lg">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <span className="inline-flex items-center gap-1.5 text-green-700 text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 rounded-full shadow-sm">
                      💰 {plan.savings}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white hover:scale-105 shadow-md hover:shadow-lg'
                  }`}
                >
                  {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {plan.price !== 'Free' && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    14-day free trial • No credit card required
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {[
            { icon: Shield, color: 'green', title: 'Secure & Private', desc: 'Bank-level encryption' },
            { icon: Clock, color: 'blue', title: 'Cancel Anytime', desc: 'No contracts' },
            { icon: Sparkles, color: 'purple', title: 'Money-back', desc: '30-day guarantee' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] border border-gray-100">
              <div className={`flex-shrink-0 w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center shadow-md`}>
                <item.icon className={`w-7 h-7 text-${item.color}-700`} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ CTA */}
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4 font-medium">Have questions about our plans?</p>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold text-lg group/faq bg-purple-50 hover:bg-purple-100 px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View Full Comparison
            <ArrowRight className="w-5 h-5 group-hover/faq:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Enhanced Comparison Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-purple-600 mb-3 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  Complete Feature Breakdown
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Plan Comparison
                </h2>
                <p className="text-gray-600">Find the perfect plan for your needs</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-all hover:bg-white/90 backdrop-blur-sm rounded-xl p-3 hover:rotate-90 duration-300 shadow-md"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-auto max-h-[calc(90vh-240px)]">
              <table className="w-full">
                <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-purple-50 border-b-2 border-purple-200 z-10 shadow-sm">
                  <tr>
                    <th className="text-left py-5 px-6 font-bold text-gray-900 text-lg">Feature</th>
                    <th className="text-center py-5 px-6 font-bold text-gray-900">
                      <div className="flex flex-col items-center gap-2">
                        <Sparkles className="w-6 h-6 text-gray-600" />
                        <span className="text-lg">Starter</span>
                      </div>
                    </th>
                    <th className="text-center py-5 px-6 font-bold bg-gradient-to-b from-purple-100 to-purple-50">
                      <div className="flex flex-col items-center gap-2">
                        <Zap className="w-6 h-6 text-purple-600" />
                        <span className="text-lg text-purple-600">Pro</span>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-3 py-1 rounded-full">Most Popular</span>
                      </div>
                    </th>
                    <th className="text-center py-5 px-6 font-bold text-gray-900">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span className="text-lg">Team</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-100 hover:bg-purple-50/30 transition-colors ${
                        index === 0 ? 'bg-purple-50/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-5 px-6 font-semibold text-gray-900">{row.feature}</td>
                      <td className="text-center py-5 px-6 text-gray-700">{row.starter}</td>
                      <td className="text-center py-5 px-6 text-purple-600 bg-purple-50/30 font-semibold">{row.pro}</td>
                      <td className="text-center py-5 px-6 text-gray-700">{row.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-10 py-4 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-bold text-gray-700 hover:bg-white transition-all duration-300 hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}