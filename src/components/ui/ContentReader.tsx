import React, { ReactNode } from 'react';

export interface ContentReaderProps {
    header?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    fontFamily?: string;
    maxWidth?: string;
}

/**
 * 범용 컨텐츠 리더 뷰 레이아웃 (Zero Monolith)
 * - 상단 컨트롤러(header), 중앙 텍스트(children), 하단 여백 및 컨트롤러(footer) 레이아웃 패턴 추출
 * - Flex 기반 중앙 수직 정렬 기본 적용
 */
export const ContentReader = React.memo(({
    header,
    children,
    footer,
    fontFamily = 'font-crimson',
    maxWidth = 'max-w-[1000px]'
}: ContentReaderProps) => {
    return (
        <div className={`flex flex-col flex-1 h-full bg-transparent ${fontFamily} text-text-primary dark:text-dark-text-primary transition-colors duration-500`}>
            <div className={`mx-auto flex flex-col justify-center flex-1 w-full ${maxWidth} px-4 py-8 sm:px-6`}>
                
                {header && (
                    <div className="flex flex-col items-center justify-center mb-2">
                        {header}
                    </div>
                )}

                {children}

                {footer && (
                    <div className="mt-16 pb-8 flex justify-center font-inter">
                        {footer}
                    </div>
                )}

            </div>
        </div>
    );
});
