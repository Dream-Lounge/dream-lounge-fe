import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { DepartmentCombobox } from "@/components/common/DepartmentCombobox";
import {
  FileText,
  HelpCircle,
  Send,
  ArrowLeft,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getClubApplicationData } from "@/data/clubs";
import { NotFound } from "@/pages/error/NotFound";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export function ClubApplication() {
  const { id } = useParams<{ id: string }>();
  const clubData = id ? getClubApplicationData(id) : null;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [questions, setQuestions] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setStudentId(String(user.studentId));
      setSelectedDepartment(user.department || "");
      setPhone(user.phone || "");
    }
  }, [isAuthenticated, user]);

  const [errors, setErrors] = useState<{
    name: boolean;
    studentId: boolean;
    department: boolean;
    phone: boolean;
    motivation: boolean;
  }>({
    name: false,
    studentId: false,
    department: false,
    phone: false,
    motivation: false,
  });

  const handleSubmit = async () => {
    const newErrors = {
      name: !name.trim(),
      studentId: !studentId.trim(),
      department: !selectedDepartment,
      phone: !phone.trim(),
      motivation: !motivation.trim(),
    };

    setErrors(newErrors);
    setSubmitError(null);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      return;
    }

    if (!isAuthenticated) {
      setSubmitError("로그인이 필요합니다.");
      return;
    }

    if (!id) {
      setSubmitError("동아리 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitMemberApplication({
        clubId: parseInt(id, 10),
        content: {
          motivation,
          experience: experience || undefined,
          questions: questions || undefined,
        },
      });

      navigate(`/club/${id}`, {
        state: { applicationSuccess: true },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "신청서 제출에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFieldOnBlur = (field: keyof typeof errors, value: string) => {
    if (value.trim() && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  if (!clubData) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="outline"
          onClick={() => navigate(`/club/${id}`)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">돌아가기</span>
        </Button>

        <div className="flex flex-col gap-8">
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
                      isAuthenticated && "bg-muted cursor-not-allowed",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    readOnly={isAuthenticated}
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
                      isAuthenticated && "bg-muted cursor-not-allowed",
                      errors.studentId &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    readOnly={isAuthenticated}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="department" className="gap-1">
                    학과<span className="text-destructive">*</span>
                  </FieldLabel>
                  {isAuthenticated ? (
                    <Input
                      id="department"
                      value={selectedDepartment}
                      className="bg-muted cursor-not-allowed"
                      readOnly
                    />
                  ) : (
                    <DepartmentCombobox
                      value={selectedDepartment}
                      onValueChange={(value) => {
                        setSelectedDepartment(value);
                        if (value && errors.department) {
                          setErrors((prev) => ({
                            ...prev,
                            department: false,
                          }));
                        }
                      }}
                      hasError={errors.department}
                    />
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone" className="gap-1">
                    전화번호<span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => validateFieldOnBlur("phone", phone)}
                    className={cn(
                      isAuthenticated && "bg-muted cursor-not-allowed",
                      errors.phone &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    readOnly={isAuthenticated}
                    required
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

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
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
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
                    value={questions}
                    onChange={(e) => setQuestions(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {submitError}
            </div>
          )}

          <Button
            size="lg"
            className="w-full py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                제출 중...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                지원서 제출
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
