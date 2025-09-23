"use client";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'white';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  className = "", 
  variant = 'primary',
  size = 'md',
  disabled = false 
}: ButtonProps) {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
    secondary: "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50",
    white: "bg-white text-purple-900 hover:bg-gray-100"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4",
    lg: "px-12 py-6 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}