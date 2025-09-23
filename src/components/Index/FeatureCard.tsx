"use client";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: 'default' | 'highlight';
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  className = "",
  variant = 'default' 
}: FeatureCardProps) {
  const baseClasses = "p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group";
  
  const variantClasses = {
    default: "bg-white/80 backdrop-blur-lg border border-white/50 hover:bg-white/90",
    highlight: "bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 hover:border-purple-300"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}