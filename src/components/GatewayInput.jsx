import React from 'react';

// 로그인 폼 입력 필드 관리 컴포넌트.
const GatewayInput = ({ value, onChange, error }) => {
    return (
        <div className="w-full relative group">
            <input
                type="password"
                value={value}
                onChange={onChange}
                placeholder="ENTER GATEWAY PASSWORD"
                className={`w-full px-6 py-5 bg-white/5 dark:bg-black/20 border transition-all duration-500 text-center font-inter text-sm tracking-[0.3em] text-gold-primary placeholder:text-gold-primary/20 focus:outline-none rounded-2xl
                    ${error
                        ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-shake'
                        : 'border-gold-border/20 focus:border-gold-primary/50 focus:bg-white/10 dark:focus:bg-white/5 shadow-inner'
                    }
                `}
                autoFocus
            />
            {error && (
                <p className="absolute -bottom-8 left-0 right-0 text-center text-[10px] font-inter text-red-500/80 tracking-[0.2em] uppercase animate-pulse">
                    Invalid Credentials
                </p>
            )}
        </div>
    );
};

export default React.memo(GatewayInput);
