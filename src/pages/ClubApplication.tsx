import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, FileText, HelpCircle, Loader2, Save, Send, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { api, type ApplicationFormResponse, type FormQuestionResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

type ApplicationMode = "create" | "edit" | "view";

function getMode(pathname: string): ApplicationMode {
  if (pathname.endsWith("/view")) return "view";
  if (pathname.endsWith("/edit")) return "edit";
  return "create";
}

function parseMultiValue(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export function ClubApplication() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const mode = getMode(location.pathname);

  const [clubId, setClubId] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [form, setForm] = useState<ApplicationFormResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !id) return;
    let active = true;

    const load = async () => {
      setIsDataLoading(true);
      setSubmitError(null);
      try {
        let resolvedClubId = id;
        let initialAnswers: Record<string, string> = {};

        if (mode === "create") {
          const [hasSubmitted, drafts] = await Promise.all([
            api.checkApplicationStatus(id),
            api.getDraftApplications(),
          ]);
          const existingDraft = drafts.find((draft) => draft.club_id === id);
          if (existingDraft) {
            toast.info("임시저장한 지원서를 불러옵니다.");
            navigate(`/applications/${existingDraft.id}/edit`, { replace: true });
            return;
          }
          if (hasSubmitted) {
            toast.error("이미 지원서를 제출한 동아리입니다.", { id: "already-applied" });
            navigate(user ? `/users/${user.studentId}/applications` : "/", { replace: true });
            return;
          }
        } else {
          const application = mode === "edit"
            ? await api.getDraftApplication(id)
            : await api.getSubmittedApplication(id);
          resolvedClubId = application.club_id ?? "";
          initialAnswers = Object.fromEntries(
            application.answers.map((answer) => [answer.question_id, answer.answer_text ?? ""]),
          );
        }

        const [club, applicationForm] = await Promise.all([
          api.getClub(resolvedClubId),
          api.getClubForm(resolvedClubId),
        ]);
        if (!active) return;
        setClubId(resolvedClubId);
        setClubName(club.name);
        setClubCategory(club.division ?? club.club_type ?? "분과");
        setClubDescription(club.description ?? "동아리 지원서를 작성합니다.");
        setForm(applicationForm);
        setAnswers(initialAnswers);
      } catch (error) {
        if (active) setSubmitError(error instanceof Error ? error.message : "지원서 정보를 불러오지 못했습니다.");
      } finally {
        if (active) setIsDataLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [id, isAuthLoading, mode, navigate, user]);

  const orderedQuestions = useMemo(
    () => [...(form?.questions ?? [])].sort((a, b) => a.order_index - b.order_index),
    [form],
  );

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, [questionId]: false }));
  };

  const toggleMultiAnswer = (questionId: string, option: string) => {
    const selected = parseMultiValue(answers[questionId]);
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    setAnswer(questionId, JSON.stringify(next));
  };

  const buildAnswers = () => orderedQuestions.map((question) => ({
    question_id: question.id,
    answer_text: answers[question.id] ?? "",
  }));

  const validate = () => {
    const next = Object.fromEntries(orderedQuestions.map((question) => [
      question.id,
      question.is_required && !(answers[question.id] ?? "").trim(),
    ]));
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!id || !form || mode === "view" || !validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (mode === "create") await api.createApplication(form.id, buildAnswers(), false);
      else await api.patchApplication(id, buildAnswers(), false);
      toast.success("지원서가 성공적으로 제출되었습니다.");
      navigate(user ? `/users/${user.studentId}/applications` : `/club/${clubId}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "지원서 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!id || !form || mode === "view") return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const saved = mode === "create"
        ? await api.createApplication(form.id, buildAnswers(), true)
        : await api.patchApplication(id, buildAnswers(), true);
      toast.success("지원서가 임시저장되었습니다.");
      if (mode === "create") navigate(`/applications/${saved.id}/edit`, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "임시저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isDataLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }

  if (!form) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-medium text-destructive">{submitError ?? "활성화된 신청폼이 없습니다."}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>뒤로 가기</Button>
      </div>
    );
  }

  const isReadOnly = mode === "view";
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" /> 이전 화면으로 돌아가기
        </Button>
        <div className="flex flex-col gap-8">
          <Card>
            <CardContent>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="rounded-xl bg-primary/10 p-3"><Users className="size-8 text-primary" /></div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold">{clubName}</h2>
                    <Badge variant="secondary" className="font-semibold">{clubCategory}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{clubDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3 text-lg"><div className="rounded-lg bg-primary/10 p-2"><FileText className="size-5 text-primary" /></div>기본 정보</CardTitle></CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field><FieldLabel>이름</FieldLabel><Input value={user?.name ?? ""} readOnly className="cursor-not-allowed bg-muted" /></Field>
                <Field><FieldLabel>학번</FieldLabel><Input value={user?.studentId ?? ""} readOnly className="cursor-not-allowed bg-muted" /></Field>
                <Field><FieldLabel>학과</FieldLabel><Input value={user?.department ?? ""} readOnly className="cursor-not-allowed bg-muted" /></Field>
                <Field><FieldLabel>전화번호</FieldLabel><Input value={user?.phone ?? ""} readOnly className="cursor-not-allowed bg-muted" /></Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-3 text-lg"><div className="rounded-lg bg-primary/10 p-2"><HelpCircle className="size-5 text-primary" /></div>{form.title}</CardTitle></CardHeader>
            <CardContent>
              {orderedQuestions.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">등록된 질문이 없습니다.</p> : (
                <FieldGroup>{orderedQuestions.map((question, index) => (
                  <QuestionField key={question.id} question={question} index={index} value={answers[question.id] ?? ""} readOnly={isReadOnly} hasError={Boolean(errors[question.id])} onChange={(value) => setAnswer(question.id, value)} onToggle={(option) => toggleMultiAnswer(question.id, option)} />
                ))}</FieldGroup>
              )}
            </CardContent>
          </Card>

          {submitError && <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{submitError}</div>}
          {!isReadOnly && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button variant="outline" size="lg" className="w-full py-6 text-base font-bold" onClick={handleSaveDraft} disabled={isSubmitting}><Save className="mr-2 size-5" /> 임시저장</Button>
              <Button size="lg" className="w-full py-6 text-base font-bold" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 size-5 animate-spin" /> : <Send className="mr-2 size-5" />} 지원서 제출</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionField({ question, index, value, readOnly, hasError, onChange, onToggle }: {
  question: FormQuestionResponse;
  index: number;
  value: string;
  readOnly: boolean;
  hasError: boolean;
  onChange: (value: string) => void;
  onToggle: (option: string) => void;
}) {
  const inputId = `application-question-${question.id}`;
  const options = question.options ?? [];
  return (
    <Field>
      <FieldLabel htmlFor={inputId} className="gap-1"><span className="text-muted-foreground">{index + 1}.</span> {question.question_text}{question.is_required && <span className="text-destructive">*</span>}</FieldLabel>
      {question.question_type === "textarea" ? (
        <Textarea id={inputId} value={value} onChange={(event) => onChange(event.target.value)} readOnly={readOnly} className={cn("min-h-32 resize-none", readOnly && "cursor-not-allowed bg-muted", hasError && "border-destructive")} />
      ) : question.question_type === "choice" ? (
        <div id={inputId} className={cn("flex flex-col gap-2 rounded-lg border p-3", hasError && "border-destructive")}>{options.map((option) => <label key={option} className="flex items-center gap-2 text-sm"><input type="radio" name={inputId} value={option} checked={value === option} onChange={() => onChange(option)} disabled={readOnly} />{option}</label>)}</div>
      ) : question.question_type === "multiselect" ? (
        <div id={inputId} className={cn("flex flex-col gap-2 rounded-lg border p-3", hasError && "border-destructive")}>{options.map((option) => <label key={option} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={parseMultiValue(value).includes(option)} onChange={() => onToggle(option)} disabled={readOnly} />{option}</label>)}</div>
      ) : (
        <Input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} readOnly={readOnly} className={cn(readOnly && "cursor-not-allowed bg-muted", hasError && "border-destructive")} />
      )}
      {hasError && <p className="text-sm text-destructive">필수 문항에 답변해주세요.</p>}
    </Field>
  );
}
