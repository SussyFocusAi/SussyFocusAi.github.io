// src/components/sections/TestimonialsSection.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: "John D",
      role: "Input",
      text: "Input",
      rating: 5
    },
    {
      name: "John D",
      role: "Input",
      text: "Input",
      rating: 5
    },
    {
      name: "John D",
      role: "Input",
      text: "Input",
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg sm:text-xl text-purple-100">Real results from real people</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-base sm:text-lg mb-6 italic">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-purple-200 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}