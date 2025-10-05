// src/components/sections/TeamSection.tsx
import React from 'react';
import { Linkedin, Twitter, Github, Mail, ExternalLink, Instagram } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    website?: string;
    instagram?: string;
  };
}

interface TeamSectionProps {
  teamRef: React.RefObject<HTMLDivElement>;
}

export default function TeamSection({ teamRef }: TeamSectionProps) {
  const team: TeamMember[] = [
    { 
      name: "Raymond", 
      role: "Co-Founder & CEO", 
      description: "Leading the vision to transform productivity through AI-powered solutions. Passionate about helping people achieve their goals.",
      socials: {
        linkedin: "https://linkedin.com/in/raymond",
        instagram: "https://www.instagram.com/sussy_bungus",
        website: "https://sussybungus.github.io/",
        email: "raymond@focusai.com"
      }
    },
    { 
      name: "Patrick", 
      role: "Co-Founder & CTO", 
      description: "Building the technical infrastructure that powers FocusAI. Expert in machine learning and scalable systems.",
      socials: {
        linkedin: "https://linkedin.com/in/patrick",
        github: "https://github.com/patrick",
        email: "patrick@focusai.com"
      }
    },
    { 
      name: "Denis", 
      role: "Head of Product", 
      description: "Designing intuitive experiences that make productivity effortless. Focused on user-centric design and innovation."
    },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'website':
        return <ExternalLink className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSocialHref = (platform: string, url: string) => {
    if (platform === 'email') {
      return `mailto:${url}`;
    }
    return url;
  };

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return 'hover:bg-blue-600 hover:text-white';
      case 'twitter':
        return 'hover:bg-blue-400 hover:text-white';
      case 'github':
        return 'hover:bg-gray-800 hover:text-white';
      case 'email':
        return 'hover:bg-red-500 hover:text-white';
      case 'website':
        return 'hover:bg-purple-600 hover:text-white';
      case 'instagram':
        return 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white';
      default:
        return 'hover:bg-gray-600 hover:text-white';
    }
  };

  return (
    <section ref={teamRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50" id="team">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Meet the Team</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            The brilliant minds behind FocusAI, working together to revolutionize how people approach productivity
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Avatar */}
              <div className="relative mb-6">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 sm:w-24 h-20 sm:h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                  />
                ) : (
                  <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto flex items-center justify-center group-hover:animate-pulse shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-white">{member.name[0]}</span>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
              <p className="text-purple-600 font-semibold mb-4 text-sm sm:text-base">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{member.description}</p>

              {/* Social Links */}
              {member.socials && (
                <div className="flex justify-center space-x-3">
                  {Object.entries(member.socials).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={getSocialHref(platform, url)}
                      target={platform !== 'email' ? '_blank' : undefined}
                      rel={platform !== 'email' ? 'noopener noreferrer' : undefined}
                      className={`p-2 rounded-lg bg-gray-100 text-gray-600 transition-all duration-200 transform hover:scale-110 ${getSocialColor(platform)}`}
                      aria-label={`${member.name}'s ${platform}`}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}