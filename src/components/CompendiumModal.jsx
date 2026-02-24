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
                            바가바드기타는 흔히 ‘전쟁 이야기’ 혹은 ‘철학적 교훈집’ 정도로만 이해되곤 합니다. 그러나 바가바드기타의 본질은 단순한 서사나 산문 해설에 머물지 않습니다. 이 텍스트는 이름 그대로 <strong className="font-bold text-[#1C2B36]">‘거룩한 자의 노래’</strong>이며, ‘바가바드(Bhagavad)’는 <strong className="font-bold text-[#1C2B36]">거룩한 자</strong>, ‘기타(Gītā)’는 <strong className="font-bold text-[#1C2B36]">노래</strong>를 뜻합니다.
                        </p>

                        <p className="mb-6">
                            즉 바가바드기타는 “경전 문장”이기 이전에 <strong className="font-bold text-[#1C2B36]">노래(가사)</strong>입니다. 가사가 노래라면, 거기에는 자연스럽게 하나의 질문이 따라옵니다.
                        </p>

                        {/* Highlight Box */}
                        <div className="bg-[#F5EFE6] dark:bg-[#222] border-l-4 border-gold-primary p-5 my-8 rounded-r-md">
                            <h3 className="font-bold text-[#1C2B36] dark:text-gold-light mb-2">가사에 연결된 ‘멜로디’는 무엇인가?</h3>
                            <p className="text-[#5B7282] m-0">
                                이 사이트는 바가바드기타를 문장 해석으로만 소비하지 않고, 그 안에 함께 내재된 <strong className="font-bold text-[#1C2B36]">리듬과 구조(‘멜로디에 해당하는 원리’)</strong>를 찾아가는 학습을 지향합니다. 멜로디는 오늘날 하나의 고정된 악보로 확정되어 있지 않더라도, 가사와 분리될 수 없는 방식으로 텍스트 안에 연결되어 있습니다. 그리고 그 연결을 “찾아내는 것”이야말로 바가바드기타 공부의 핵심에 가깝습니다.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">18장 전체는 ‘하나의 체험 지도’로 읽을 수 있습니다</h3>
                        <p className="mb-4">
                            바가바드기타는 1장부터 18장까지 구성되어 있습니다. 이 사이트는 18장을 단순히 “장별 주제”로 분해하기보다, 전체를 <strong className="font-bold text-[#1C2B36]">인간이 삶의 체험을 통과해 해탈(해방)의 방향으로 이동하는 과정</strong>으로 읽는 관점을 제시합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-3 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">1장: 서론 — 아르주나의 고민(상황의 제시)</strong><br />삶이라는 장(場)에 던져진 존재가 ‘전쟁 직전’의 갈등을 마주하는 출발점입니다.</li>
                            <li><strong className="text-[#1C2B36]">2장~8장: 내적 구조(7단계)와 연결된 구간</strong><br />이 구간은 인간의 <strong className="text-[#1C2B36]">7가지 내적 체험 단계</strong>(차크라/내적 구조)와 연결되어 읽힐 수 있으며, 각 단계에는 통과해야 할 체험과 기준이 담겨 있습니다.</li>
                            <li><strong className="text-[#1C2B36]">9장: 경계 너머의 전환점</strong><br />내적 7단계를 지나면, 체험의 범위는 개인의 내부를 넘어 <strong className="text-[#1C2B36]">‘바깥’의 차원</strong>으로 확장되는 전환점을 맞습니다.</li>
                            <li><strong className="text-[#1C2B36]">10장~18장: 확장된 질서 속에서의 통과</strong><br />이 이후의 구간은 (하나의 해석적 프레임으로서) <strong className="text-[#1C2B36]">더 큰 질서/영적 계층 구조</strong>와 연결해 읽을 수 있으며, 체험의 지평이 개인을 넘어 더 넓은 영역으로 이동하는 흐름으로 볼 수 있습니다.</li>
                        </ul>
                        <p className="text-[14px] opacity-80 italic mb-8">
                            (이러한 장-구조 연결은 “정설의 단정”이 아니라, 텍스트 내부의 묶음과 흐름을 따라가기 위한 <strong className="font-bold">하나의 관점적 읽기</strong>임을 전제로 합니다.)
                        </p>

                        {/* Section 2 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">핵심은 ‘체험의 주체’를 바꾸는 것입니다</h3>
                        <p className="mb-4">
                            바가바드기타가 노래하는 전쟁은 단지 바깥에서 벌어지는 전쟁이 아니라, 더 깊게는 <strong className="font-bold text-[#1C2B36]">두 사고방식의 충돌</strong>로 읽힐 수 있습니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-4 text-[#5B7282] marker:text-gold-primary">
                            <li>진리/신의 관점</li>
                            <li>자기중심적 관점 (익숙하지만 어리석은 선택의 자동반응)</li>
                        </ul>
                        <p className="mb-4">여기서 중요한 질문은 이것입니다.</p>
                        <blockquote className="border-l-4 border-gold-primary/50 pl-4 py-1 my-4 italic text-[#1C2B36]">
                            "나는 분명 그 체험을 겪었는데, 왜 여전히 통과하지 못했는가?"
                        </blockquote>
                        <p className="mb-8">
                            이 사이트는 그 이유를 <strong className="font-bold text-[#1C2B36]">‘체험의 주체가 누구인가’</strong>라는 문제로 다룹니다.<br />
                            몸과 마음이 겪은 사건이 곧 “존재의 핵(참된 주체)”이 통과한 체험과 동일한가? 바가바드기타의 실천은 이 질문을 피하지 않고, 매 순간 선택의 주체를 다시 세우는 훈련으로 이어집니다.
                        </p>

                        {/* Section 3 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">바가바드기타는 ‘요약 경전’이 아니라 ‘실천의 디테일’을 가진 텍스트입니다</h3>
                        <p className="mb-4">
                            어떤 경전은 핵심을 극도로 압축해 ‘요약’의 형태로 남습니다. 그러나 바가바드기타는 핵심만 던지고 끝나는 방식이 아니라, 삶의 다양한 국면에서 부딪히는 체험들에 대해 <strong className="font-bold text-[#1C2B36]">구체적인 가이드라인</strong>을 제공합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-6 text-[#5B7282] marker:text-gold-primary">
                            <li>각 단계에서 어떤 체험이 나타나는가</li>
                            <li>그 체험은 무엇을 의미하는가</li>
                            <li>그때 신/진리의 기준으로 어떻게 생각하고 어떻게 행동해야 하는가</li>
                        </ul>
                        <p className="mb-8">
                            이런 점에서 바가바드기타는 단순한 철학 텍스트가 아니라, <strong className="font-bold text-[#1C2B36]">일상의 체험을 통과하게 하는 실천서</strong>로 읽힐 수 있습니다.
                        </p>

                        {/* Section 4 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">배경 개념: 샹캬 철학의 언어로 읽으면 문장이 ‘열립니다’</h3>
                        <p className="mb-4">
                            바가바드기타를 읽다 보면 샹캬 철학의 핵심 개념들이 반복해서 등장합니다. 푸루샤(Puruṣa)와 프라크리티(Prakṛti), 그리고 삼구나(sattva/rajas/tamas) 같은 언어는 단순 배경지식이 아니라, 바가바드기타의 문장들을 <strong className="font-bold text-[#1C2B36]">정확히 읽게 하는 해독 키</strong>가 됩니다.
                        </p>
                        <p className="mb-8">
                            이 사이트는 용어를 “외워서 아는 것”보다, 반복 학습을 통해 의미가 살아나는 <strong className="font-bold text-[#1C2B36]">감각(진동감각)</strong>을 중시합니다. 말의 뜻을 넘어서, 그 말이 가리키는 세계를 ‘느끼는 이해’로 옮겨가는 것이 목표입니다.
                        </p>

                        {/* Section 5 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">바가바드기타는 ‘특수 경전’이 아니라 ‘보편 경전’입니다</h3>
                        <p className="mb-8">
                            바가바드기타는 소수 수행자만의 특수 문헌이라기보다, 오랫동안 널리 암송되고 전승되어 온 <strong className="font-bold text-[#1C2B36]">보편 경전</strong>에 가깝습니다. 어떤 시대와 계층에 있든, 삶의 언어로 반복해서 불리고 배우며 전달된 텍스트였다는 점에서, 바가바드기타를 공부하는 것은 “특별한 사람만 하는 공부”가 아니라 <strong className="font-bold text-[#1C2B36]">원래 자연스러운 공부</strong>에 더 가깝습니다.
                        </p>

                        {/* Section 6 */}
                        <h3 className="text-lg font-bold text-gold-primary mt-10 mb-4 pb-2 border-b border-gold-border/20">이 사이트의 학습 방향</h3>
                        <p className="mb-4">
                            이 사이트는 바가바드기타를 “읽는 것”으로 끝내지 않습니다. 각 장을 <strong className="font-bold text-[#1C2B36]">체험의 지도</strong>로 배치하고, 텍스트가 제시하는 기준을 오늘의 삶에서 적용할 수 있도록 안내합니다.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-8 text-[#5B7282] marker:text-gold-primary">
                            <li><strong className="text-[#1C2B36]">구조 읽기:</strong> 18장의 흐름을 지도처럼 잡기</li>
                            <li><strong className="text-[#1C2B36]">체험 읽기:</strong> 내 삶의 어떤 국면과 연결되는지 찾기</li>
                            <li><strong className="text-[#1C2B36]">기준 읽기:</strong> 신/진리의 관점에서 선택을 정렬하기</li>
                            <li><strong className="text-[#1C2B36]">실천하기:</strong> “아는 것”을 “통과하는 것”으로 바꾸기</li>
                        </ul>

                        <div className="bg-gold-surface/30 dark:bg-[#1a1a1a] p-6 rounded-lg text-center mt-12 mb-4">
                            <p className="mb-2">바가바드기타의 핵심은 결국 단순합니다.</p>
                            <h4 className="text-xl font-bold text-gold-primary mb-4">관점이 서면, 나머지는 읽고 실천하는 문제로 바뀝니다.</h4>
                            <p className="italic opacity-80">이 사이트는 그 관점이 서도록 돕는 학습 공간이 되겠습니다.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompendiumModal;
