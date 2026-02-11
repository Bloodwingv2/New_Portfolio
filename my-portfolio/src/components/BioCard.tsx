import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MapPin, Briefcase, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
const myImage = portfolioData.profileImage;

const BioCard: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(cardRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, { scope: cardRef });

    return (
        <div ref={cardRef} className="max-w-xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm mt-4">

            {/* Banner / Cover */}

            <div
                className="h-32 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${portfolioData.headerImage})` }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
            </div>

            <div className="px-6 pb-6 relative">
                {/* Profile Image */}
                <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-2xl border-4 border-[#0a0a0a] overflow-hidden bg-gray-800 shadow-xl">
                        <img
                            src={myImage}
                            alt={portfolioData.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(portfolioData.name)}&background=random`;
                            }}
                        />
                    </div>
                </div>

                {/* Header Info */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{portfolioData.name}</h2>
                    <div className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                        <Briefcase size={16} />
                        {portfolioData.role}
                    </div>
                    <div className="text-gray-500 text-sm flex items-center gap-2">
                        <MapPin size={16} />
                        {portfolioData.location}
                    </div>
                </div>

                {/* Bio Text */}
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 mb-6 leading-relaxed">
                    {portfolioData.bio.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-2 last:mb-0">
                            {paragraph.trim()}
                        </p>
                    ))}
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
                    {portfolioData.socials.map((social) => {
                        const Icon = social.name.includes('GitHub') ? Github :
                            social.name.includes('LinkedIn') ? Linkedin :
                                social.name.includes('Twitter') ? Twitter :
                                    social.name.includes('Email') ? Mail : Briefcase;

                        return (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 hover:text-white transition-all group"
                            >
                                <Icon size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                                {social.name}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BioCard;
