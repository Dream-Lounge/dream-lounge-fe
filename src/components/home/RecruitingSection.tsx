import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Laptop, Palette, BookOpen, Camera, Utensils, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { MoreLink } from "@/components/common/MoreLink";

/**
 * 모집중인 동아리 및 분과별 소개 섹션 컴포넌트
 * - 현재 모집 기간인 동아리 목록을 하이라이트하여 보여줍니다.
 * - 우측에는 분과별 통계 및 카테고리 바로가기를 제공합니다.
 */
export function RecruitingSection() {
    const navigate = useNavigate();
    // 모집중인 동아리 임시 데이터
    const recruitingClubs = [
        {
            id: 1,
            title: "코딩 마스터즈",
            category: "학술",
            endDate: "2023.09.26",
            deadlineText: "오늘까지",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        },
        {
            id: 2,
            title: "디지털 아트 크리에이터",
            category: "교양",
            endDate: "2025.09.26",
            deadlineText: "오늘까지",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        },
        {
            id: 3,
            title: "경제 분석 연구회",
            category: "학술",
            endDate: "2025.09.26",
            deadlineText: "오늘까지",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        },
        {
            id: 4,
            title: "지역사회 봉사단",
            category: "봉사",
            endDate: "2025.09.28",
            deadlineText: "",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        },
        {
            id: 5,
            title: "드림라운지 산악회",
            category: "체육",
            endDate: "2025.09.26",
            deadlineText: "오늘까지",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        },
        {
            id: 6,
            title: "드림라운지 음악회",
            category: "음악",
            endDate: "2025.09.28",
            deadlineText: "",
            bgColor: "bg-slate-800",
            textColor: "text-white"
        }
    ];

    // 분과별 동아리 수 데이터
    const divisions = [
        { name: "공연", count: 12 },
        { name: "교양", count: 8 },
        { name: "봉사", count: 6 },
        { name: "종교사회", count: 4 },
        { name: "체육", count: 15 },
        { name: "학술", count: 9 },
    ];

    // 카테고리(태그)별 데이터 및 아이콘
    const categories = [
        { name: "프로그래밍", count: 15, icon: Laptop },
        { name: "디자인", count: 12, icon: Palette },
        { name: "음악", count: 18, icon: Music },
        { name: "독서토론", count: 9, icon: BookOpen },
        { name: "운동", count: 22, icon: Trophy },
        { name: "요리", count: 8, icon: Utensils },
        { name: "사진", count: 14, icon: Camera },
    ];

    return (
        <Card>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-12 w-full mx-auto px-4 py-2">
                    {/* 좌측 영역: 모집중인 동아리 카드 리스트 */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">모집중인 동아리</h2>
                            <MoreLink>더보기</MoreLink>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {recruitingClubs.map((club) => (
                                <Card
                                    key={club.id}
                                    className={cn(
                                        club.bgColor,
                                        club.textColor,
                                        "overflow-hidden border-none shadow-sm h-100 relative",
                                        "group cursor-pointer",
                                        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    )}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/club/${club.id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            navigate(`/club/${club.id}`);
                                        }
                                    }}
                                >
                                    <CardContent className="h-full flex flex-col justify-between relative z-10">
                                        <div className="flex justify-between items-start">
                                            <Badge className="bg-primary text-primary-foreground border-none py-1 px-3">
                                                {club.category}
                                            </Badge>
                                            {club.deadlineText && (
                                                <Badge variant="secondary" className="bg-secondary text-secondary-foreground border-none py-1 px-3">
                                                    {club.deadlineText}
                                                </Badge>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">{club.title}</h3>
                                            <p className="text-sm opacity-70">{club.endDate}</p>
                                        </div>
                                    </CardContent>
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* 우측 사이드바: 분과별 정보 및 태그 탐색 */}
                    <div className="w-full lg:w-96 shrink-0 space-y-8">
                        <div>
                            {/* TODO: mt-1 추가하기 */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">분과별 모아보기</h2>
                            <div className="space-y-4">
                                {divisions.map((division) => (
                                    <div
                                        key={division.name}
                                        className="flex justify-between items-center group cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={() => { }}
                                    >
                                        <span className="text-gray-700 font-medium group-hover:text-gray-900">{division.name}</span>
                                        <MoreLink className="text-gray-400 group-hover:text-gray-600">
                                            {division.count}개 동아리
                                        </MoreLink>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className={cn(
                                "w-full h-12",
                                "text-gray-700 border-border",
                                "hover:bg-gray-50 hover:text-gray-900",
                                "cursor-pointer"
                            )}>
                            전체 동아리
                        </Button>

                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <div
                                    key={cat.name}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2",
                                        "bg-white border border-gray-100 rounded-lg shadow-sm",
                                        "hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                                    )}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={() => { }}
                                >
                                    <cat.icon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                    <span className="text-xs text-gray-400">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
}
