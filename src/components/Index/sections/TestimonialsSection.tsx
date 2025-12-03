// src/components/sections/TestimonialsSection.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react'; // Added useMemo
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

// ... (Testimonial interface and data remain the same) ...
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
  const [isHovering, setIsHovering] = useState(false);

  // ... (Testimonial data remains the same) ...
  const testimonials: Testimonial[] = [
    { name: "Sam J.", role: "Lead Developer", company: "TechNexus", text: "This tool is a game-changer. I went from feeling overwhelmed to having total control over my schedule in one week. The AI is surprisingly effective at preventing procrastination.", rating: 5, avatar: "SJ", color: "from-purple-500 to-pink-500" },
    { name: "Maria C.", role: "Marketing Manager", company: "Innovate Inc.", text: "The smart reminders don't just tell me what to do, they tell me *when* and *why*. It's like having a personal productivity coach 24/7. Highly recommend!", rating: 5, avatar: "MC", color: "from-blue-500 to-cyan-500" },
    { name: "Ethan R.", role: "Startup Founder", company: "Growth Labs", text: "As a founder, I juggle a million tasks. This scheduler cuts through the noise and keeps me focused on the highest-leverage activities. My productivity jumped 40%.", rating: 5, avatar: "ER", color: "from-orange-500 to-red-500" },
    { name: "David P.", role: "Freelance Designer", company: "Self-Employed", text: "I used to dread project planning. Now, I just input my goals, and the system builds a flawless, actionable plan. No more missed deadlines—ever.", rating: 5, avatar: "DP", color: "from-green-500 to-emerald-500" },
    { name: "Liam T.", role: "Student", company: "University of Toronto", text: "Studying became so much less stressful. I stopped wasting time figuring out *how* to study and just started doing it. Great for managing multiple courses.", rating: 5, avatar: "LT", color: "from-yellow-500 to-orange-500" },
    { name: "Jasmine W.", role: "Project Manager", company: "Global Solutions", text: "The integration with my existing tools was seamless. It's the only productivity software that truly feels like it's anticipating my needs.", rating: 5, avatar: "JW", color: "from-indigo-500 to-purple-500" }
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

  // ... (useEffect for Auto-play and Drag handlers remain the same) ...
  useEffect(() => {
    if (!isAutoPlaying || isHovering) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex, isHovering]);

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
    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setIsDragging(false);
  };

  // 💡 Use useMemo to cache card styles and prevent unnecessary recalculations
  const cardStyles = useMemo(() => {
    const styles = testimonials.map((_, index) => {
      const totalCards = testimonials.length;
      const diff = (index - currentIndex + totalCards) % totalCards;
      
      let style: React.CSSProperties = {
        opacity: 0,
        zIndex: 0,
        filter: 'blur(3px)',
        transform: 'translateX(0%) scale(0.3) rotateY(0deg) translateZ(-400px)',
      };

      if (diff === 0) {
        style = {
          transform: 'translateX(0%) scale(1) rotateY(0deg) translateZ(0px)',
          opacity: 1,
          zIndex: 50,
          filter: 'blur(0px)',
        };
      } else if (diff === 1) {
        style = {
          // Changed to 50% translation for better spacing and less aggression
          transform: 'translateX(50%) scale(0.8) rotateY(-20deg) translateZ(-100px)', 
          opacity: 0.7,
          zIndex: 40,
          filter: 'blur(1px)',
        };
      } else if (diff === totalCards - 1) {
        style = {
          transform: 'translateX(-50%) scale(0.8) rotateY(20deg) translateZ(-100px)',
          opacity: 0.7,
          zIndex: 40,
          filter: 'blur(1px)',
        };
      } else if (diff === 2) {
        style = {
          // Changed to 80% translation for better off-screen positioning
          transform: 'translateX(80%) scale(0.6) rotateY(-30deg) translateZ(-200px)', 
          opacity: 0.3,
          zIndex: 30,
          filter: 'blur(2px)',
        };
      } else if (diff === totalCards - 2) {
        style = {
          transform: 'translateX(-80%) scale(0.6) rotateY(30deg) translateZ(-200px)',
          opacity: 0.3,
          zIndex: 30,
          filter: 'blur(2px)',
        };
      }
      // Add `will-change` to all styles for performance
      style.willChange = 'transform, opacity, filter'; 
      return style;
    });

    return styles;
  }, [currentIndex, testimonials.length]);
  // ----------------------------------------------------------------------

  return (
    <>
      {/* 💡 PERFORMANCE FIX: Use style jsx for hardware acceleration and smooth transitions */}
      <style jsx>{`
        .card-transition {
          /* Add translateZ(0) to force GPU rendering (hardware acceleration) */
          transition: transform 700ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms ease, filter 700ms ease;
          transform: translateZ(0); /* Critical for initial acceleration */
        }
      `}</style>
      
      <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gray-900 text-white overflow-hidden relative">
        {/* Animated background remains the same */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <div className="absolute inset-0" 
              style={{ 
                backgroundImage: 'radial-gradient(#ffffff20 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }}>
          </div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }}></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header remains the same */}
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
            <div className="inline-flex items-center gap-2 bg-purple-400/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6 border border-purple-400/40">
              <Sparkles className="w-4 h-4 text-purple-300" />
              Loved by **thousands of achievers**
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
              What Our Users Say
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Real stories from people who transformed their productivity with AI-driven focus.
            </p>
          </div>
          
          {/* 3D Carousel Container */}
          <div 
            ref={carouselRef}
            className="relative mb-16 select-none cursor-grab active:cursor-grabbing"
            style={{ 
              perspective: '2500px',
              // 💡 Sizing Fix: Ensure sufficient vertical space for the active card
              height: '550px' 
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
          >
            {/* Cards Container - Now fixed height */}
            <div className="absolute inset-0 flex items-center justify-center">
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentIndex;
                const style = cardStyles[index]; // Use the cached style
                
                return (
                  <div
                    key={index}
                    // 💡 Sizing Fix: Use fixed max-width and fixed height to prevent content reflow
                    className={`absolute w-full max-w-xl lg:max-w-2xl card-transition`} 
                    style={style}
                    onClick={() => !isActive && goToSlide(index)}
                  >
                    <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl rounded-[30px] p-8 sm:p-10 lg:p-12 border-2 transition-all duration-500 h-[450px] flex flex-col justify-between cursor-pointer 
                      ${isActive 
                        ? 'border-purple-400/50 shadow-[0_0_80px_rgba(168,85,247,0.7)] hover:scale-[1.03]'
                        : 'border-white/10 shadow-xl'
                      }`}>
                      
                      {/* Gradient accent (inner) */}
                      <div className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${testimonial.color} opacity-10`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Quote decoration */}
                        <div className="absolute -top-6 -left-6 w-16 h-16 sm:w-20 sm:h-20">
                          <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${testimonial.color} opacity-20 blur-xl`}></div>
                          <Quote className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-white/50" />
                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-6 pt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 drop-shadow-xl" />
                          ))}
                        </div>

                        {/* Testimonial text */}
                        <p className="text-xl sm:text-2xl lg:text-3xl mb-auto leading-snug text-gray-100 font-medium flex-grow">
                          "{testimonial.text}"
                        </p>

                        {/* Author info */}
                        <div className="flex items-center gap-4 sm:gap-5 mt-8">
                          <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center font-extrabold text-white text-xl sm:text-2xl shadow-2xl flex-shrink-0 border-2 border-white/50`}>
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${testimonial.color} blur-lg opacity-50`}></div>
                            <span className="relative z-10">{testimonial.avatar}</span>
                          </div>
                          <div>
                            <div className="font-extrabold text-xl sm:text-2xl text-white mb-0.5">{testimonial.name}</div>
                            <div className="text-purple-300 text-base sm:text-lg">{testimonial.role}</div>
                            <div className="text-gray-400 text-sm sm:text-base">{testimonial.company}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows (remain the same) */}
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="hidden sm:flex absolute left-0 lg:left-12 top-1/2 -translate-y-1/2 w-16 h-16 lg:w-20 lg:h-20 bg-white/10 hover:bg-white/30 backdrop-blur-xl rounded-full items-center justify-center transition-all duration-300 z-50 hover:scale-125 border-2 border-white/30 group shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-8 h-8 lg:w-10 lg:h-10 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="hidden sm:flex absolute right-0 lg:right-12 top-1/2 -translate-y-1/2 w-16 h-16 lg:w-20 lg:h-20 bg-white/10 hover:bg-white/30 backdrop-blur-xl rounded-full items-center justify-center transition-all duration-300 z-50 hover:scale-125 border-2 border-white/30 group shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-8 h-8 lg:w-10 lg:h-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dots Navigation (remain the same) */}
          <div className="flex justify-center gap-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 rounded-full h-3 border border-white/30 ${
                  index === currentIndex
                    ? 'w-16 sm:w-20 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                    : 'w-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile swipe hint (remain the same) */}
          <div className="sm:hidden text-center mt-8 text-gray-300/70 text-base">
            👈 Swipe to explore more stories 👉
          </div>
        </div>
      </section>
    </>
  );
}