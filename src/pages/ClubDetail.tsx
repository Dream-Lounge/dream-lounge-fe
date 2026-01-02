import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, CheckCircle2 } from "lucide-react";

/**
 * 동아리 상세 페이지 컴포넌트
 * - 특정 동아리의 상세 정보, 모집 기간, 활동 내역 등을 보여줍니다.
 * - 사용자는 이 페이지에서 동아리 가입 신청을 할 수 있습니다.
 */
export function ClubDetail() {
    /**
     * 동아리 목업 데이터
     * - 추후 실제 API 연동 시 교체될 예정입니다.
     */
    const clubData = {
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
            { id: 1, title: "정기 아이디어 피칭", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Activity+1" },
            { id: 2, title: "스타트업 CEO 초청 강연", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Activity+2" },
            { id: 3, title: "연합 해커톤 참가", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Activity+3" },
        ],
        recruitment: {
            status: "모집중",
            period: "2026.03.01 ~ 2026.03.14",
            target: "창업에 열정 있는 모든 재학생 (전공 무관)",
            process: "서류 심사 > 면접 > 최종 합격",
        }
    };

    return (
        <div className="container flex flex-col gap-8 pb-20 mx-auto w-full">
            {/** 히어로 섹션: 동아리 대표 이미지 및 모집 상태 뱃지 */}
            <div className="relative h-[300px] w-full rounded-2xl overflow-hidden bg-muted">
                <img
                    src="https://placehold.co/1200x400/e2e8f0/1e293b?text=Club+Cover+Image"
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
                            <span>{clubData.category}</span>
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
                        <div className="text-base leading-relaxed text-muted-foreground">
                            {clubData.longDescription}
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
