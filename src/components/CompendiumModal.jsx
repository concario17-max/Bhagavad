import { X } from 'lucide-react';

const CompendiumModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-dark-surface border border-gold-border rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gold-border/30">
                    <h2 className="text-xl sm:text-2xl font-serif text-gold-primary tracking-wide">
                        Compendium
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gold-primary hover:bg-gold-surface dark:hover:bg-dark-bg rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                    <div className="prose prose-[#5B7282] dark:prose-invert max-w-none font-noto-kr text-[15px] sm:text-base leading-relaxed break-keep">

                        <p className="mb-6">
                            바가바드기타. 단순 전쟁 실록이나 윤리 교과서 아님. 이 텍스트는 직역 그대로 <strong className="font-bold text-[#1C2B36]">‘거룩한 자의 노래’</strong>. ‘바가바드(Bhagavad)’는 <strong className="font-bold text-[#1C2B36]">거룩한 자</strong>, ‘기타(Gītā)’는 <strong className="font-bold text-[#1C2B36]">노래</strong>.
                        </p>

                        <p className="mb-6">
                            단순 “경전 문장” 이전에 <strong className="font-bold text-[#1C2B36]">노래(가사)</strong>. 가사라면 멜로디의 정체가 문제됨.
                        </p>

                        {/* Highlight Box */}
                        <div className="bg-[#F5EFE6] dark:bg-[#222] border-l-4 border-gold-primary p-5 my-8 rounded-r-md">
                            <h3 className="font-bold text-[#1C2B36] dark:text-gold-light mb-2">가사에 연결된 ‘멜로디’의 정체</h3>
                            <p className="text-[#5B7282] m-0">
                                단순 문장 해석 거부. 내재된 <strong className="font-bold text-[#1C2B36]">리듬과 구조(‘멜로디’ 원리)</strong> 탐구 지향. 멜로디는 고정 악보가 없어도 가사와 불가분으로 텍스트에 내장. 그 연결의 “구조적 파악”이 바가바드기타 학습의 본질.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">18장 전체. 단일한 ‘체험 지도’</h3>
                        <p className="mb-4">
                            1장부터 18장의 파편화 거부. 전체를 <strong className="font-bold text-[#1C2B36]">인간이 삶을 관통해 해방으로 직진하는 단방향 프로세스</strong>로 해석 제안.
                        </p>
                        <ul className="list-disc pl-5 space-y-3 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">1장: 서론 (상황 제시)</strong><br />존재가 맞닥뜨린 전장의 갈등. 출발점.</li>
                            <li><strong className="text-[#1C2B36]">2장~8장: 내적 7단계</strong><br /><strong className="text-[#1C2B36]">차크라 및 내적 구조 병렬</strong>. 각 단계별 필수 통과 기준 내포.</li>
                            <li><strong className="text-[#1C2B36]">9장: 임계점</strong><br />내부 소진 완료. 외부 차원으로의 강제 확장.</li>
                            <li><strong className="text-[#1C2B36]">10장~18장: 거시 질서</strong><br />개인 초월. <strong className="text-[#1C2B36]">영적 계층 구조</strong>와의 도킹. 체험 영역 극대화.</li>
                        </ul>
                        <p className="text-[14px] opacity-80 italic mb-8">
                            (절대적 교리 아님. 텍스트 흐름 추적을 위한 알고리즘적 <strong className="font-bold">관점</strong>.)
                        </p>

                        {/* Section 2 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">핵심. ‘체험 주체’의 강제 전환</h3>
                        <p className="mb-4">
                            외부 전쟁 아님. 두 사고체계의 치명적 충돌.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-[#5B7282] marker:text-gold-primary">
                            <li>진명/신의 알고리즘</li>
                            <li>자기중심적 관점 (관성적이고 어리석은 자동반응)</li>
                        </ul>
                        <p className="mb-4">의문 발생.</p>
                        <blockquote className="border-l-4 border-gold-primary/50 pl-4 py-1 my-4 italic text-[#1C2B36]">
                            "체험은 완료. 왜 통과는 실패했는가?"
                        </blockquote>
                        <p className="mb-8">
                            원인 분석. <strong className="font-bold text-[#1C2B36]">‘체험 주체’ 오지정</strong>.<br />
                            육체/정신의 데이터가 "존재 핵(참된 주체)"의 체험과 불일치. 바가바드기타 실천의 핵심은 매 순간 주체를 재설정하는 지속적 훈련 구동.
                        </p>

                        {/* Section 3 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">압축 경전 아님. 마이크로 실천 매뉴얼</h3>
                        <p className="mb-4">
                            추상적 요약본 거부. 삶의 다중 국면에서 발생되는 체험에 대한 <strong className="font-bold text-[#1C2B36]">초정밀 가이드라인</strong> 제공.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li>각 단계별 발생 체험 특정</li>
                            <li>해당 체험의 심층 의미 디코딩</li>
                            <li>신/진리 기준의 행동 지침 즉각 하달</li>
                        </ul>
                        <p className="mb-8">
                            단순 관념론 아님. <strong className="font-bold text-[#1C2B36]">일상 체험 돌파용 실무 지침서</strong>.
                        </p>

                        {/* Section 4 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">배경 설계: 샹캬 철학 베이스 디코딩</h3>
                        <p className="mb-4">
                            샹캬 철학 개념의 반복 등장. 푸루샤(Puruṣa), 프라크리티(Prakṛti), 삼구나(sattva/rajas/tamas). 단순 배경 지식 아님. 텍스트 <strong className="font-bold text-[#1C2B36]">정밀 해독을 위한 마스터 키</strong>.
                        </p>
                        <p className="mb-8">
                            단순 암기 거부. 반복 노출로 각인되는 <strong className="font-bold text-[#1C2B36]">실감(진동감각)</strong> 최우선. 개념 너머의 실체적 이해 도달 목표.
                        </p>

                        {/* Section 5 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">특수 문헌 아님. 보편 알고리즘</h3>
                        <p className="mb-8">
                            소수 엘리트용 비밀 문서 아님. 시대를 관통하며 검증된 <strong className="font-bold text-[#1C2B36]">보편 경전</strong>. 계층 무관, 삶의 현장에서 지속적 변환 및 적용 가능. <strong className="font-bold text-[#1C2B36]">자연스럽고 필수적인 생존 지식</strong>.
                        </p>

                        {/* Section 6 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">학습 아키텍처</h3>
                        <p className="mb-4">
                            단순 독해 거절. 각 장을 <strong className="font-bold text-[#1C2B36]">체험 매핑 영역</strong>으로 배치. 텍스트 로직의 즉각적 실존 적용 가이드.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-8 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">구조 파악:</strong> 18장 전체 흐름 구조화</li>
                            <li><strong className="text-[#1C2B36]">체험 동기화:</strong> 개인적 현실과 텍스트 병렬 연결</li>
                            <li><strong className="text-[#1C2B36]">관점 정렬:</strong> 진리 기반 선택 알고리즘 강제</li>
                            <li><strong className="text-[#1C2B36]">실행:</strong> "인지"를 "절대적 통과"로 변환</li>
                        </ul>

                        <div className="bg-gold-surface/30 dark:bg-[#1a1a1a] p-6 rounded-lg text-center mt-12 mb-4">
                            <p className="mb-2">본질. 극도로 단순함.</p>
                            <h4 className="text-xl font-bold text-gold-primary mb-4">관점 확립. 그 후는 단순 반복 실행.</h4>
                            <p className="italic opacity-80">관점 셋업을 위한 최적화 환경 지향.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
