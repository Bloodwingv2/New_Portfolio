import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { Certification } from '../data/portfolioData';

interface CertificationDisplayProps {
    certifications: Certification[];
}

const CertificationDisplay: React.FC<CertificationDisplayProps> = ({ certifications }) => {


    return (
        <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
            {certifications.map((cert) => (
                <div
                    key={cert.id}
                    className="group"
                >
                    <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 hover:bg-gray-900/60 hover:border-gray-700 transition-all duration-300">
                        <div className="flex items-start gap-4">
                            {/* Icon Box */}
                            <div className="w-12 h-12 bg-white rounded-lg p-2 shrink-0 flex items-center justify-center overflow-hidden">
                                <img
                                    src={cert.icon}
                                    alt={`${cert.name} logo`}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                                        {cert.name}
                                    </h3>
                                    <span className="text-xs font-mono text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded self-start sm:self-auto shrink-0">
                                        {cert.date}
                                    </span>
                                </div>

                                <p className="text-sm text-blue-300 mb-3 font-medium">
                                    {cert.issuer}
                                </p>

                                <p className="text-gray-200 text-sm leading-relaxed mb-4">
                                    {cert.description}
                                </p>

                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                                    >
                                        View Credential <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CertificationDisplay;
