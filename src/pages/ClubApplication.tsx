import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FileText, HelpCircle, Send, ArrowLeft, Users, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "@/data/departments";

// 동아리 데이터 (ClubDetail.tsx와 동일한 목업 데이터)
const MOCK_CLUB_DATA: Record<string, { title: string; category: string; description: string }> = {
    "6": {
        title: "CPR (CJU Public Relation)",
        category: "학술분과",
        description: "프로그래밍과 AI에 대한 열정을 실현하며 미래를 준비하는 동아리 입니다.",
    },
};

/**
 * 동아리 지원서 페이지 컴포넌트
 * - Figma 디자인(node 249-1301)을 기반으로 구현
 * - 기본 정보, 지원 동기 입력 폼으로 구성
 */
export function ClubApplication() {
    const { id } = useParams<{ id: string }>();
    const clubData = id ? MOCK_CLUB_DATA[id] : null;
    const navigate = useNavigate();

    // 학과 선택 상태
    const [departmentOpen, setDepartmentOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 max-w-[800px]">
                {/* 뒤로가기 링크 */}
                <Button
                    variant="outline"
                    onClick={() => navigate(`/club/${id}`)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm">동아리 상세로 돌아가기</span>
                </Button>

                <div className="flex flex-col gap-8">
                    {/* 동아리 정보 섹션 */}
                    <Card>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold">
                                            {clubData?.title || "동아리"}
                                        </h2>
                                        <Badge variant="secondary" className="text-xs">
                                            {clubData?.category || "분과"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {clubData?.description || "동아리 지원서를 작성합니다."}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 기본 정보 섹션 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                기본 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Field>
                                    <FieldLabel htmlFor="name" className="gap-1">
                                        이름<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input id="name" placeholder="홍길동" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="studentId" className="gap-1">
                                        학번<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input id="studentId" placeholder="20251234" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="department" className="gap-1">
                                        학과<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={departmentOpen}
                                                className="w-full justify-between font-normal"
                                            >
                                                {selectedDepartment || "학과를 선택하세요"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="학과 검색..." />
                                                <CommandList>
                                                    <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                                                    {DEPARTMENTS.map((collegeGroup) => (
                                                        <CommandGroup key={collegeGroup.college} heading={collegeGroup.college}>
                                                            {collegeGroup.departments.map((dept) => (
                                                                <CommandItem
                                                                    key={dept}
                                                                    value={dept}
                                                                    onSelect={(value) => {
                                                                        setSelectedDepartment(value === selectedDepartment ? "" : value);
                                                                        setDepartmentOpen(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedDepartment === dept ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {dept}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email" className="gap-1">
                                        이메일<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input id="email" type="email" placeholder="example@cju.ac.kr" />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* 지원 동기 / 질문 섹션 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <HelpCircle className="h-5 w-5 text-primary" />
                                </div>
                                지원 동기
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="motivation" className="gap-1">
                                        동아리에 지원하게 된 동기를 작성해주세요.<span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Textarea
                                        id="motivation"
                                        placeholder="동아리 활동을 통해 이루고 싶은 목표, 관심 분야 등을 자유롭게 작성해주세요."
                                        className="min-h-[120px] resize-none"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="experience" className="gap-1">
                                        관련 경험이나 활동 이력이 있다면 작성해주세요.
                                    </FieldLabel>
                                    <Textarea
                                        id="experience"
                                        placeholder="프로젝트 경험, 스터디 참여, 수강 과목 등 관련 경험을 자유롭게 작성해주세요."
                                        className="min-h-[120px] resize-none"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="questions">동아리에 궁금한 점이 있다면 작성해주세요.</FieldLabel>
                                    <Textarea
                                        id="questions"
                                        placeholder="궁금한 점을 자유롭게 작성해주세요."
                                        className="min-h-[80px] resize-none"
                                    />
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {/* 제출 버튼 */}
                    <Button
                        size="lg"
                        className="w-full py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Send className="h-5 w-5 mr-2" />
                        지원서 제출
                    </Button>
                </div>
            </div>
        </div>
    );
}
