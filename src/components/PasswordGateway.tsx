import React, { useState, useCallback } from 'react';
import { Lock, ChevronRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import GatewayInput from './GatewayInput';

interface PasswordGatewayProps {
    onAuthenticate: () => void;
}

const PasswordGateway = ({ onAuthenticate }: PasswordGatewayProps) => {
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const correctPassword = import.meta.env.VITE_GATEWAY_PASSWORD || '0228';
        if (password === correctPassword) {
            onAuthenticate();
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    }, [password, onAuthenticate]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gold-bg dark:bg-dark-bg selection:bg-gold-primary/30 font-crimson overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-primary/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-primary/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="absolute top-8 right-8 animate-fade-in">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-lg px-8 py-16 flex flex-col items-center z-10 animate-slide-up">

                {/* Branding */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold-border/30 bg-gold-surface/30 dark:bg-dark-surface/30 mb-8 shadow-2xl backdrop-blur-sm group hover:border-gold-primary/50 transition-all duration-700">
                        <Lock className="w-8 h-8 text-gold-primary group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <h1 className="text-5xl font-light tracking-tighter text-gold-primary mb-3 drop-shadow-sm">
                        Gateway <span className="italic font-serif">Access</span>
                    </h1>
                    <div className="h-px w-12 bg-gold-primary/30 mx-auto mb-4"></div>
                    <p className="text-[10px] font-inter tracking-[0.5em] text-gold-muted uppercase opacity-80">
                        Sanctuary of Ancient Wisdom
                    </p>
                </div>

                {/* Authentication Interface */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8 max-w-sm">
                    <GatewayInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                    />

                    <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-gold-primary hover:bg-gold-muted text-gold-bg rounded-2xl font-inter text-xs font-bold tracking-[0.2em] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(166,139,92,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(166,139,92,0.5)] active:scale-[0.97] uppercase"
                    >
                        <span>Initiate Gateway</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* Aesthetic Footer */}
                <div className="mt-20 flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-700">
                    <a href="mailto:roadsea@naver.com" className="font-inter text-[10px] tracking-widest text-gold-muted hover:text-gold-primary transition-colors border-b border-transparent hover:border-gold-primary/30 pb-1">
                        SUPPORT & INQUIRIES
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PasswordGateway;
