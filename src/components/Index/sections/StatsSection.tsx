// src/components/sections/StatsSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Users, TrendingDown, Zap, Clock, ArrowUpRight } from 'lucide-react';

interface StatsData {
  number: string;
  target: number;
  label: string;
  sublabel: string;
  color: string;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

interface StatsSectionProps {
  currentStat: number;
}

export default function StatsSection({ currentStat }: StatsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatsData[] = [
    { 
      number: "10K+", 
      target: 10000,
      label: "Active Users", 
      sublabel: "and growing daily",
      color: "from-purple-500 to-pink-500",
      icon: <Users className="w-6 h-6" />,
      suffix: "+"
    },
    { 
      number: "67%", 
      target: 67,
      label: "Less Procrastination", 
      sublabel: "reported by users",
      color: "from-blue-500 to-cyan-500",
      icon: <TrendingDown className="w-6 h-6" />,
      suffix: "%"
    },
    { 
      number: "6.7x", 
      target: 6.7,
      label: "More Productive", 
      sublabel: "on average",
      color: "from-green-500 to-emerald-500",
      icon: <Zap className="w-6 h-6" />,
      suffix: "x"
    },
    { 
      number: "67", 
      target: 67,
      label: "Minutes Saved", 
      sublabel: "every single day",
      color: "from-orange-500 to-red-500",
      icon: <Clock className="w-6 h-6" />,
      suffix: "min"
    }
  ];

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let currentCount = 0;
      const increment = stat.target / steps;

      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= stat.target) {
          currentCount = stat.target;
          clearInterval(timer);
        }
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[index] = currentCount;
          return newCounts;
        });
      }, interval);
    });
  }, [isVisible]);

  const formatNumber = (num: number, index: number) => {
    const stat = stats[index];
    if (stat.suffix === '+') {
      return Math.floor(num).toLocaleString();
    } else if (stat.suffix === '%') {
      return Math.floor(num);
    } else if (stat.suffix === 'x') {
      return num.toFixed(1);
    } else if (stat.suffix === 'min') {
      return Math.floor(num);
    }
    return Math.floor(num);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Join the productivity revolution and see real results
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                currentStat === index ? 'ring-2 ring-purple-400 scale-105' : ''
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease-out ${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Number */}
              <div className="mb-2">
                <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent flex items-start gap-1`}>
                  {formatNumber(counts[index], index)}
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
              </div>

              {/* Label */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.sublabel}</p>
              </div>

              {/* Hover Effect Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
            </div>
          ))}
        </div>
      </div>

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