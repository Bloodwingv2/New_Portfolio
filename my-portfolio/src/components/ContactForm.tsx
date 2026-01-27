import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Send, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const ContactForm: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        message: '',
        website: '' // Honeypot field
    });
    const startTime = useRef(Date.now());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        // Spam Protection 1: Honeypot
        if (formData.website) {
            // Silently fail for bots
            setStatus('success');
            return;
        }

        // Spam Protection 2: Time validation (too fast = bot)
        if (Date.now() - startTime.current < 2000) {
            setStatus('error');
            setErrorMessage("You're too fast! Please take a moment.");
            return;
        }

        if (!formData.user_name || !formData.user_email || !formData.message) {
            setStatus('error');
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setStatus('sending');

        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id',
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
                form.current!,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key'
            );
            setStatus('success');
        } catch (error: any) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            // Check if it's likely a quota or auth error to suggest the fallback
            setErrorMessage("Failed to send message via the agent network.");
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center animate-fade-in">
                <div className="flex justify-center mb-3">
                    <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Message Transmitted</h3>
                <p className="text-gray-300">Thank you! I've received your signal and will establish a connection shortly.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 shadow-xl w-full max-w-md">
            <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                <Send size={16} className="text-blue-400" />
                Initialize Uplink
            </h3>
            <p className="text-gray-400 text-xs mb-4">Secure channel established. Ready for transmission.</p>

            <form ref={form} onSubmit={sendEmail} className="space-y-3">
                {/* Honeypot Field - Hidden */}
                <div className="hidden">
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="user_name"
                        placeholder="Operator Name"
                        value={formData.user_name}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                        disabled={status === 'sending'}
                    />
                </div>

                <div>
                    <input
                        type="email"
                        name="user_email"
                        placeholder="Comms Frequency (Email)"
                        value={formData.user_email}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                        disabled={status === 'sending'}
                    />
                </div>

                <div>
                    <textarea
                        name="message"
                        placeholder="Transmission Content..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none resize-none transition-colors"
                        disabled={status === 'sending'}
                    />
                </div>

                {status === 'error' && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded p-3 text-red-400 text-xs">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold mb-1">Transmission Failed</p>
                            <p>{errorMessage}</p>

                            {/* Fallback Button */}
                            <a
                                href="https://mirang.framer.ai/form-submit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs transition-colors"
                            >
                                Use Emergency Channel
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {status === 'sending' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Transmitting...
                        </>
                    ) : (
                        'Send Transmission'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
