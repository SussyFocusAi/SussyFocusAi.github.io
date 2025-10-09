// src/components/sections/TestimonialsSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  color: string;
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "SJ",
      color: "from-purple-400 to-pink-400"
    },
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "MC",
      color: "from-blue-400 to-cyan-400"
    },
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "ER",
      color: "from-orange-400 to-red-400"
    },
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "DP",
      color: "from-green-400 to-emerald-400"
    },
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "LT",
      color: "from-yellow-400 to-orange-400"
    },
    {
      name: "67",
      role: "67",
      company: "67",
      text: "67",
      rating: 5,
      avatar: "JW",
      color: "from-indigo-400 to-purple-400"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsAutoPlaying(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setIsDragging(false);
  };

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + testimonials.length) % testimonials.length;
    const totalCards = testimonials.length;
    
    if (diff === 0) {
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg) translateZ(0px)',
        opacity: 1,
        zIndex: 50,
        filter: 'blur(0px)',
      };
    } else if (diff === 1) {
      return {
        transform: 'translateX(70%) scale(0.8) rotateY(-25deg) translateZ(-100px)',
        opacity: 0.7,
        zIndex: 40,
        filter: 'blur(1px)',
      };
    } else if (diff === totalCards - 1) {
      return {
        transform: 'translateX(-70%) scale(0.8) rotateY(25deg) translateZ(-100px)',
        opacity: 0.7,
        zIndex: 40,
        filter: 'blur(1px)',
      };
    } else if (diff === 2) {
      return {
        transform: 'translateX(130%) scale(0.6) rotateY(-35deg) translateZ(-200px)',
        opacity: 0.4,
        zIndex: 30,
        filter: 'blur(2px)',
      };
    } else if (diff === totalCards - 2) {
      return {
        transform: 'translateX(-130%) scale(0.6) rotateY(35deg) translateZ(-200px)',
        opacity: 0.4,
        zIndex: 30,
        filter: 'blur(2px)',
      };
    } else {
      return {
        transform: 'translateX(0%) scale(0.4) rotateY(0deg) translateZ(-300px)',
        opacity: 0,
        zIndex: 0,
        filter: 'blur(3px)',
      };
    }
  };

  return (
    <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Sparkles className="w-4 h-4" />
            Loved by thousands
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-purple-100 max-w-3xl mx-auto">
            Real stories from people who transformed their productivity
          </p>
        </div>
        
        {/* 3D Carousel Container */}
        <div 
          ref={carouselRef}
          className="relative mb-16 select-none cursor-grab active:cursor-grabbing"
          style={{ 
            perspective: '2000px',
            minHeight: '500px'
          }}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {/* Cards Container */}
          <div className="relative h-[450px] sm:h-[500px] lg:h-[550px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={index}
                  className="absolute w-full max-w-[90%] sm:max-w-[500px] lg:max-w-[600px] transition-all duration-700 ease-out"
                  style={getCardStyle(index)}
                  onClick={() => !isActive && goToSlide(index)}
                >
                  <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 lg:p-12 border-2 transition-all duration-500 h-full ${
                    isActive 
                      ? 'border-white/40 shadow-2xl shadow-purple-500/50' 
                      : 'border-white/10 shadow-xl'
                  }`}>
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.color} opacity-5`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Quote decoration */}
                      <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20">
                        <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${testimonial.color} opacity-20 blur-xl`}></div>
                        <Quote className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-white/40" />
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                        ))}
                      </div>

                      {/* Testimonial text */}
                      <p className="text-base sm:text-lg lg:text-xl mb-8 leading-relaxed text-white/90 font-light">
                        "{testimonial.text}"
                      </p>

                      {/* Author info */}
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-xl flex-shrink-0`}>
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.color} blur-lg opacity-50`}></div>
                          <span className="relative z-10">{testimonial.avatar}</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg sm:text-xl text-white mb-1">{testimonial.name}</div>
                          <div className="text-purple-200 text-sm sm:text-base">{testimonial.role}</div>
                          <div className="text-purple-300/70 text-xs sm:text-sm">{testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl items-center justify-center transition-all duration-300 z-50 hover:scale-110 border border-white/20 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl items-center justify-center transition-all duration-300 z-50 hover:scale-110 border border-white/20 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentIndex
                  ? 'w-12 sm:w-14 h-3 bg-white shadow-lg shadow-white/50'
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile swipe hint */}
        <div className="sm:hidden text-center mt-8 text-purple-100/70 text-sm">
          👈 Swipe to explore more 👉
        </div>
      </div>
    </section>
  );
}