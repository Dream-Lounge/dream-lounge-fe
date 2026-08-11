import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEndDateLabel } from "@/lib/date";

/**
 * 모집중인 동아리 및 분과별 소개 섹션 컴포넌트
 * - 좌측: 모집중인 동아리를 가로 스크롤 한 줄로 표시합니다.
 * - 우측: 분과별 동아리 수 바로가기를 제공합니다.
 */
export function RecruitingSection() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 모집중인 동아리 임시 데이터
  const recruitingClubs = [
    {
      id: 6,
      title: "CPR",
      category: "학술",
      endDate: "상시모집",
      deadlineText: "모집예정",
      image: "/images/cpr_v1.png",
      textColor: "text-white",
      aiRecommended: true,
    },
    {
      id: 1,
      title: "디스토션",
      category: "공연",
      endDate: "2023.09.26",
      deadlineText: "",
      image: "/images/performence.jpg",
      textColor: "text-white",
      aiRecommended: true,
    },
    {
      id: 3,
      title: "사진예술연구회",
      category: "교양",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/photo_exhibition_v1.png",
      textColor: "text-white",
      aiRecommended: true,
    },
    {
      id: 2,
      title: "RCY",
      category: "봉사",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/rcy_v1.jpg",
      textColor: "text-white",
      aiRecommended: false,
    },
    {
      id: 4,
      title: "스매시",
      category: "체육",
      endDate: "2025.09.28",
      deadlineText: "",
      image: "/images/smash.jpg",
      textColor: "text-white",
      aiRecommended: false,
    },
    {
      id: 5,
      title: "유스호스텔",
      category: "교양",
      endDate: "2025.09.26",
      deadlineText: "",
      image: "/images/hostel.jpg",
      textColor: "text-white",
      aiRecommended: false,
    },
  ];

  // 분과별 동아리 수 데이터
  const divisions = [
    { name: "공연", count: 12 },
    { name: "교양", count: 8 },
    { name: "봉사", count: 6 },
    { name: "종교사회", count: 4 },
    { name: "체육", count: 15 },
    { name: "학술", count: 9 },
    { name: "학과", count: 7 },
  ];

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
      {/* 좌측 컬럼: 모집중인 동아리 (타이틀 + 가로 스크롤 카드) */}
      <div className="flex min-w-0 flex-col gap-6">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            모집중인 동아리
          </h2>
          <button
            type="button"
            aria-label="모집 동아리 전체보기"
            onClick={() => navigate("/clubs")}
            className="flex size-8 shrink-0 items-center justify-center text-gray-900 transition-colors hover:text-gray-500"
          >
            <Plus className="size-6" />
          </button>
        </div>

        {/* 가로 스크롤 동아리 카드 */}
        <div className="relative min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <div
            ref={scrollRef}
            className="flex items-stretch gap-3 overflow-x-auto scroll-smooth lg:h-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {recruitingClubs.map((club) => (
              <Card
                key={club.id}
                className={cn(
                  club.textColor,
                  "relative aspect-[3/4] h-36 w-auto shrink-0 overflow-hidden border-none py-0 gap-0 shadow-sm sm:h-56 lg:h-full",
                  "group cursor-pointer",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                )}
                onClick={() => navigate(`/club/${club.id}`)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${club.image})` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <CardContent className="relative z-10 flex h-full min-h-0 flex-col justify-between p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="border-none bg-primary/90 font-semibold text-primary-foreground backdrop-blur-sm">
                      {club.category}
                    </Badge>
                    {club.aiRecommended && (
                      <Badge className="gap-1 border-none bg-white/85 font-semibold text-primary backdrop-blur-sm">
                        <Sparkles className="size-3" />
                        AI추천
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="mb-0.5 line-clamp-1 text-base font-bold drop-shadow-md">
                      {club.title}
                    </h3>
                    <p className="text-xs opacity-90 drop-shadow-sm">
                      {formatEndDateLabel(club.endDate)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 이전 버튼 */}
          {canScrollPrev && (
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="이전 동아리"
              className="absolute left-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="size-5 text-gray-600" />
            </button>
          )}

          {/* 다음 버튼 */}
          {canScrollNext && (
            <button
              type="button"
              onClick={scrollNext}
              aria-label="다음 동아리"
              className="absolute right-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition-colors hover:bg-gray-50"
            >
              <ChevronRight className="size-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* 우측 컬럼: 분과별 모아보기 (타이틀 + 분과 목록) */}
      <div className="flex flex-col gap-6">
        {/* 섹션 헤더 */}
        <div className="flex items-center">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            분과별 모아보기
          </h2>
        </div>

        {/* 분과 목록 */}
        <aside className="flex w-full shrink-0 flex-col lg:w-96">
          {divisions.map((division) => (
            <button
              key={division.name}
              type="button"
              className="group flex items-center justify-between border-b border-gray-100 py-4 text-left transition-colors hover:bg-gray-50/60"
              onClick={() => navigate("/clubs")}
            >
              <span className="font-bold text-gray-800 group-hover:text-gray-900">
                {division.name}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-400">
                {division.count}개 동아리
                <ChevronRight className="size-4 group-hover:text-gray-600" />
              </span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
