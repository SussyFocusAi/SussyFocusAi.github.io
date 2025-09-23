// src/components/sections/TeamSection.tsx
import React from 'react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

interface TeamSectionProps {
  teamRef: React.RefObject<HTMLDivElement>;
}

export default function TeamSection({ teamRef }: TeamSectionProps) {
  const team: TeamMember[] = [
    { name: "Raymond", role: "Co-Owner", description: "sigma ohio boy" },
    { name: "Patrick", role: "Co-Owner", description: "surpias" },
    { name: "Denis", role: "man idk", description: "sdiybt" },
  ];

  return (
    <section ref={teamRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50" id="team">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Meet the Team</h2>
          <p className="text-lg sm:text-xl text-gray-600">The brilliant minds behind FocusAI</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:animate-pulse">
                <span className="text-xl sm:text-2xl font-bold text-white">{member.name[0]}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-purple-600 font-semibold mb-3 text-sm sm:text-base">{member.role}</p>
              <p className="text-gray-600 text-xs sm:text-sm">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}