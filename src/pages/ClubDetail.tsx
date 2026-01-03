import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, CheckCircle2 } from "lucide-react";
import { NotFound } from "@/pages/error/NotFound";

// 동아리 데이터 타입 정의
interface ClubData {
    title: string;
    category: string;
    tags: string[];
    description: string;
    longDescription: string;
    activities: { id: number; title: string; image: string }[];
    recruitment: {
        status: string;
        period: string;
        target: string;
        process: string;
    };
}

/**
 * 동아리 목업 데이터 상수
 * - 성능 최적화를 위해 컴포넌트 외부로 분리했습니다.
 * - ID를 키로 사용하여 O(1) 조회가 가능하도록 구성했습니다.
 * - 다양한 동아리 데이터를 추가하여 동적 라우팅 테스트가 가능합니다.
 */
const MOCK_CLUB_DATA: Record<string, ClubData> = {
    "1": {
        title: "D.N.A (Dream N Achievement)",
        category: "창업/경제",
        tags: ["#열정", "#스타트업", "#네트워킹", "#성장"],
        description: "스타트업 창업에 관심 있는 학생들이 모여 아이디어를 공유하고 실현하는 동아리입니다.",
        longDescription: `
      D.N.A는 단순한 창업 동아리가 아닙니다. 
      우리는 세상을 바꿀 아이디어를 가진 인재들이 모여 서로의 꿈을 응원하고, 
      실제 비즈니스 모델을 만들어가는 과정을 함께합니다.
      매주 정기 세미나와 해커톤 참여, 현직 창업가 멘토링 등을 통해 
      실전 창업 역량을 기르고 있습니다.
    `,
        activities: [
            { id: 1, title: "정기 아이디어 피칭", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Pitching" },
            { id: 2, title: "스타트업 CEO 초청 강연", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Lecture" },
            { id: 3, title: "연합 해커톤 참가", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Hackathon" },
        ],
        recruitment: {
            status: "모집중",
            period: "2026.03.01 ~ 2026.03.14",
            target: "창업에 열정 있는 모든 재학생 (전공 무관)",
            process: "서류 심사 > 면접 > 최종 합격",
        }
    },
    "2": {
        title: "CodeBreakers",
        category: "IT/개발",
        tags: ["#알고리즘", "#웹개발", "#코딩", "#해커톤"],
        description: "코딩을 사랑하는 사람들의 모임, 알고리즘 스터디와 프로젝트 진행.",
        longDescription: `
      CodeBreakers는 코드로 세상을 부수는 개발자들의 모임입니다.
      백준, 프로그래머스 알고리즘 스터디부터 시작하여
      실제 서비스를 런칭하는 프로젝트까지 함께합니다.
      서로의 코드를 리뷰하고 성장하는 문화를 지향합니다.
    `,
        activities: [
            { id: 1, title: "알고리즘 스터디", image: "https://placehold.co/400x300/1e293b/e2e8f0?text=Algorithm" },
            { id: 2, title: "오픈소스 기여", image: "https://placehold.co/400x300/1e293b/e2e8f0?text=OpenSource" },
        ],
        recruitment: {
            status: "마감임박",
            period: "2026.03.01 ~ 2026.03.10",
            target: "컴퓨터공학 관련 전공자 및 개발에 관심있는 분",
            process: "코딩 테스트 > 면접",
        }
    },
    "3": {
        title: "Muse",
        category: "예술/음악",
        tags: ["#밴드", "#공연", "#음악", "#친목"],
        description: "음악을 사랑하는 학우들이 모여 합주하고 공연하는 밴드 동아리입니다.",
        longDescription: `
      Muse는 음악을 통해 하나되는 공간입니다.
      정기 공연과 버스킹을 통해 무대 경험을 쌓고,
      악기 연주 실력을 함께 키워나갑니다.
      음악을 사랑하는 마음만 있다면 누구나 환영합니다.
    `,
        activities: [
            { id: 1, title: "봄 정기 공연", image: "https://placehold.co/400x300/fecaca/991b1b?text=Concert" },
            { id: 2, title: "교내 버스킹", image: "https://placehold.co/400x300/fecaca/991b1b?text=Busking" },
        ],
        recruitment: {
            status: "모집마감",
            period: "2026.02.01 ~ 2026.02.28",
            target: "악기 연주 및 보컬 가능자",
            process: "오디션 > 면접",
        }
    }
};

/**
 * 동아리 상세 페이지 컴포넌트
 * - URL 파라미터(id)를 통해 동아리 정보를 동적으로 불러옵니다.
 * - MOCK_CLUB_DATA를 활용하여 다양한 동아리 예시를 보여줍니다.
 */
export function ClubDetail() {
    // 1. URL 파라미터에서 id 추출
    const { id } = useParams<{ id: string }>();

    // 2. id에 해당하는 동아리 데이터 조회 (없으면 null)
    const clubData = id ? MOCK_CLUB_DATA[id] : null;

    // 3. 데이터가 없을 경우 (잘못된 접근 또는 존재하지 않는 ID)
    if (!clubData) {
        return <NotFound />;
    }

    // 4. 정상적으로 데이터가 로드된 경우 렌더링
    return (
        <div className="container flex flex-col gap-8 pb-20 mx-auto w-full">
            {/** 히어로 섹션: 동아리 대표 이미지 및 모집 상태 뱃지 */}
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-muted">
                <img
                    src={`https://placehold.co/1200x400/e2e8f0/1e293b?text=${encodeURIComponent(clubData.title)}`}
                    alt="Club Cover"
                    className="object-cover w-full h-full"
                />
                <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                        {clubData.recruitment.status}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/** 메인 콘텐츠 영역: 동아리 상세 소개 및 활동 내역 */}
                <div className="lg:col-span-2 space-y-8">

                    {/** 타이틀 및 헤더: 카테고리, 동아리명, 태그 정보 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span className="font-semibold text-primary">{clubData.category}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{clubData.title}</h1>
                        <p className="text-lg text-muted-foreground">{clubData.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {clubData.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1 text-secondary-foreground text-sm font-normal">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/** 동아리 소개 섹션: 상세 설명 텍스트 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold">동아리 소개</h2>
                        <div className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                            {clubData.longDescription.trim()}
                        </div>
                    </section>

                    {/** 주요 활동 갤러리: 활동 사진 및 제목 리스트 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold">주요 활동</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clubData.activities.map(activity => (
                                <div key={activity.id} className="rounded-lg overflow-hidden border bg-card">
                                    <img src={activity.image} alt={activity.title} className="w-full h-48 object-cover" />
                                    <div className="p-3">
                                        <p className="font-medium text-center text-sm">{activity.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/** 사이드 모집 정보: 모집 기간, 대상, 절차 등 중요 정보 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">모집 정보</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">모집 기간</p>
                                        <p className="text-sm text-muted-foreground">{clubData.recruitment.period}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">모집 대상</p>
                                        <p className="text-sm text-muted-foreground">{clubData.recruitment.target}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">선발 절차</p>
                                        <p className="text-sm text-muted-foreground">{clubData.recruitment.process}</p>
                                    </div>
                                </div>

                                <Separator className="my-2" />

                                <Button className="w-full font-bold text-primary-foreground py-6 shadow-md hover:shadow-lg transition-all">
                                    지원하기
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground">
                            * 동아리 지원 관련 문의는 해당 동아리 회장에게 직접 문의 바랍니다.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
