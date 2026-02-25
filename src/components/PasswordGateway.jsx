import { useState } from 'react';
import { Lock, PenLine } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const PasswordGateway = ({ onAuthenticate }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // The requested password
        if (password === '0228') {
            onAuthenticate();
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gold-bg/95 backdrop-blur-sm transition-opacity duration-700 font-crimson">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm px-6 py-12 flex flex-col items-center animate-fade-in-up">

                {/* Lock Icon */}
                <div className="w-16 h-16 rounded-full bg-gold-border/20 flex items-center justify-center mb-6 shadow-sm">
                    <Lock className="w-6 h-6 text-gold-primary" />
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-3xl font-semibold italic tracking-wide text-gold-primary mb-2 text-center drop-shadow-sm">
                    Access Restricted
                </h1>
                <p className="text-xs font-inter tracking-[0.2em] text-text-secondary uppercase mb-8 text-center mt-1">
                    BHAGAVAD GITA
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
                    <div className="w-full relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ENTER PASSWORD"
                            className={`w-full px-4 py-3.5 bg-white/80 border ${error ? 'border-red-400/50' : 'border-gold-border/30'
                                } rounded-lg text-center font-inter text-sm tracking-widest text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/30 transition-all shadow-sm`}
                            autoFocus
                        />
                        {error && (
                            <p className="absolute -bottom-6 left-0 right-0 text-center text-xs font-inter text-red-500/80 tracking-widest animate-pulse">
                                INCORRECT PASSWORD
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8E793E] hover:bg-[#7A6835] text-white rounded-lg font-inter text-xs font-bold tracking-[0.15em] transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        <span>ENTER GATEWAY</span>
                        <PenLine className="w-4 h-4 ml-1 opacity-90" />
                    </button>
                </form>

                {/* Footer Notes */}
                <div className="mt-16 flex flex-col items-center gap-8 text-center text-text-secondary">
                    <p className="font-noto-kr text-[11px] tracking-wider italic text-text-secondary/80">
                        문의: <a href="mailto:roadsea@naver.com" className="hover:text-gold-primary transition-colors">roadsea@naver.com</a>
                    </p>

                    <p className="font-inter text-[9px] tracking-[0.2em] uppercase text-text-secondary/40">
                        DEDICATED TO THE TIMELESS WISDOM OF THE GITA
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordGateway;
