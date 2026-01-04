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
import {
  FileText,
  HelpCircle,
  Send,
  ArrowLeft,
  Users,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "@/data/departments";
import { getClubApplicationData } from "@/data/clubs";
import { NotFound } from "@/pages/error/NotFound";

/**
 * 동아리 지원서 페이지 컴포넌트
 * - Figma 디자인(node 249-1301)을 기반으로 구현
 * - 기본 정보, 지원 동기 입력 폼으로 구성
 * - 공유 데이터에서 title, category, description만 추출하여 사용
 */
export function ClubApplication() {
  const { id } = useParams<{ id: string }>();
  // 공유 목업 데이터에서 필요한 필드(title, category, description)만 가져옴
  const clubData = id ? getClubApplicationData(id) : null;
  if (!clubData) {
    return <NotFound />;
  }

  const navigate = useNavigate();

  // 폼 필드 상태
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");

  // 학과 선택 상태
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // 에러 상태 (필수 필드 유효성 검사)
  const [errors, setErrors] = useState<{
    name: boolean;
    studentId: boolean;
    department: boolean;
    email: boolean;
    motivation: boolean;
  }>({
    name: false,
    studentId: false,
    department: false,
    email: false,
    motivation: false,
  });

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      studentId: !studentId.trim(),
      department: !selectedDepartment,
      email: !email.trim(),
      motivation: !motivation.trim(),
    };

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      return;
    }

    // TODO: 실제 제출 로직 구현
    console.log("지원서 제출:", {
      name,
      studentId,
      selectedDepartment,
      email,
      motivation,
    });
  };

  // 필드별 onBlur 검증 핸들러 - 값이 입력되면 에러 상태 해제
  const validateFieldOnBlur = (field: keyof typeof errors, value: string) => {
    if (value.trim() && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 뒤로가기 링크 */}
        <Button
          variant="outline"
          onClick={() => navigate(`/club/${id}`)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">돌아가기</span>
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
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => validateFieldOnBlur("name", name)}
                    className={cn(
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="studentId" className="gap-1">
                    학번<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="studentId"
                    placeholder="20251234"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    onBlur={() => validateFieldOnBlur("studentId", studentId)}
                    className={cn(
                      errors.studentId &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="department" className="gap-1">
                    학과<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Popover
                    open={departmentOpen}
                    onOpenChange={setDepartmentOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={departmentOpen}
                        className={cn(
                          "w-full justify-between font-normal",
                          errors.department &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      >
                        <span
                          className={cn(
                            !selectedDepartment && "text-muted-foreground",
                          )}
                        >
                          {selectedDepartment || "학과를 선택하세요"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="학과 검색..." />
                        <CommandList>
                          <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                          {DEPARTMENTS.map((collegeGroup) => (
                            <CommandGroup
                              key={collegeGroup.college}
                              heading={collegeGroup.college}
                            >
                              {collegeGroup.departments.map((dept) => (
                                <CommandItem
                                  key={dept}
                                  value={dept}
                                  onSelect={(value) => {
                                    setSelectedDepartment(value);
                                    setDepartmentOpen(false);
                                    // 학과 선택 시 에러 상태 해제
                                    if (value && errors.department) {
                                      setErrors((prev) => ({
                                        ...prev,
                                        department: false,
                                      }));
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDepartment === dept
                                        ? "opacity-100"
                                        : "opacity-0",
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@cju.ac.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validateFieldOnBlur("email", email)}
                    className={cn(
                      errors.email &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    required
                  />
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
                    동아리에 지원하게 된 동기를 작성해주세요.
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="motivation"
                    placeholder="동아리 활동을 통해 이루고 싶은 목표, 관심 분야 등을 자유롭게 작성해주세요."
                    className={cn(
                      "min-h-[120px] resize-none",
                      errors.motivation &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    onBlur={() => validateFieldOnBlur("motivation", motivation)}
                    required
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
                  <FieldLabel htmlFor="questions">
                    동아리에 궁금한 점이 있다면 작성해주세요.
                  </FieldLabel>
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
            onClick={handleSubmit}
          >
            <Send className="h-5 w-5 mr-2" />
            지원서 제출
          </Button>
        </div>
      </div>
    </div>
  );
}
