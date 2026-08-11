import { useRef, useState } from "react";
import {
  PlusCircle,
  Settings,
  FileText,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Save,
  CirclePlus,
  Search,
  SlidersHorizontal,
  Bold,
  Italic,
  Underline,
  ImagePlus,
  Plus,
  X,
  SquarePen,
  Pencil,
  ChevronDown,
  Eye,
  Info,
  Mail,
  Link2,
} from "lucide-react";
import { CLUB_DIVISION_KEYS } from "@/data/clubDirectoryMeta";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AdminTab =
  | "club-register"
  | "application-form"
  | "submitted-applications"
  | "page-tags"
  | "community-board";

const ADMIN_MENU: {
  section: string;
  items: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tab: AdminTab;
  }[];
}[] = [
  {
    section: "동아리 관리",
    items: [
      { label: "동아리 정보", icon: PlusCircle, tab: "club-register" },
      { label: "상세페이지 설정", icon: Tag, tab: "page-tags" },
    ],
  },
  {
    section: "신청서 관리",
    items: [
      { label: "신청폼 설정", icon: Settings, tab: "application-form" },
      {
        label: "신청서 관리",
        icon: FileText,
        tab: "submitted-applications",
      },
    ],
  },
  {
    section: "커뮤니티",
    items: [
      {
        label: "게시판 관리",
        icon: MessageSquare,
        tab: "community-board",
      },
    ],
  },
];

const QUESTION_TYPES = [
  "단답형",
  "장문형",
  "객관식",
  "체크박스",
] as const;
type QuestionType = (typeof QUESTION_TYPES)[number];

/** 선택지를 입력받아야 하는 유형 */
function hasOptions(type: QuestionType) {
  return type === "객관식" || type === "체크박스";
}

interface ApplicationQuestion {
  id: number;
  title: string;
  type: QuestionType;
  required: boolean;
  /** 객관식일 때 보여줄 선택지 */
  options?: string[];
}

const APPLICATION_QUESTIONS: ApplicationQuestion[] = [
  { id: 1, title: "지원 동기를 작성해주세요.", type: "단답형", required: false },
  { id: 2, title: "본인의 장단점을 설명해주세요.", type: "장문형", required: false },
  {
    id: 3,
    title: "해당 분야에 대한 경험이 있으신가요?",
    type: "객관식",
    required: false,
    options: ["있음", "없음"],
  },
];

const APPLICATION_STATUSES = ["검토중", "합격", "불합격", "보류"] as const;
type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

interface SubmittedApplication {
  id: number;
  name: string;
  studentId: string;
  major: string;
  submittedAt: string;
  status: ApplicationStatusValue;
  /** 상태 변경 시 남긴 사유 메모 */
  statusComment?: string;
}

const SUBMITTED_APPLICATIONS: SubmittedApplication[] = [
  {
    id: 1,
    name: "김철수",
    studentId: "20230001",
    major: "컴퓨터공학부",
    submittedAt: "2026.04.01",
    status: "검토중",
  },
  {
    id: 2,
    name: "이영희",
    studentId: "20230015",
    major: "경영학과",
    submittedAt: "2026.04.01",
    status: "합격",
  },
  {
    id: 3,
    name: "박지민",
    studentId: "20240102",
    major: "시각디자인과",
    submittedAt: "2026.03.31",
    status: "불합격",
  },
  {
    id: 4,
    name: "최동현",
    studentId: "20220304",
    major: "전자전기공학부",
    submittedAt: "2026.03.30",
    status: "검토중",
  },
];

const STATUS_SELECT_CLASS: Record<ApplicationStatusValue, string> = {
  합격: "bg-[#E8FAEE] text-[#14863F]",
  불합격: "bg-[#FDECEE] text-[#D7263D]",
  보류: "bg-[#EEF1F6] text-[#5A6B86]",
  검토중: "bg-[#FFF9E8] text-[#B48319]",
};

const PAGE_TAGS = ["#프로젝트", "#해커톤", "#네트워킹", "#개발스터디"] as const;

/** 상세페이지에 노출할 태그 최대 개수 */
const MAX_TAGS = 5;

const COMMUNITY_POSTS = [
  {
    id: 1,
    isNotice: true,
    title: "[공지] 2026학년도 1학기 신입 부원 모집 안내",
    author: "운영진",
    createdAt: "2026.04.01",
    views: 342,
  },
  {
    id: 2,
    isNotice: true,
    title: "첫 정기 세션 일정 변경의 건",
    author: "운영진",
    createdAt: "2026.03.28",
    views: 156,
  },
  {
    id: 3,
    isNotice: false,
    title: "해커톤 팀원 모집합니다~ (프론트엔드 우대)",
    author: "김철수",
    createdAt: "2026.03.25",
    views: 89,
  },
  {
    id: 4,
    isNotice: false,
    title: "지난 스터디 자료 공유",
    author: "이영희",
    createdAt: "2026.03.20",
    views: 45,
  },
] as const;

const CLUB_DETAIL_DESCRIPTION_PLACEHOLDER =
  "예: 코딩 스터디, 프로젝트, 세미나 등을 통해 함께 성장하는 학술 동아리입니다.";

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("application-form");
  const [clubName, setClubName] = useState("");
  const [clubCategory, setClubCategory] = useState("");
  const [clubTagline, setClubTagline] = useState("");
  const [clubDetailDescription, setClubDetailDescription] = useState("");
  const [clubContact, setClubContact] = useState("");

  /** 연락처·SNS 링크 (라벨 + URL) */
  const [snsLinks, setSnsLinks] = useState<
    { id: number; label: string; url: string }[]
  >([]);

  const addSnsLink = () => {
    setSnsLinks((prev) => [
      ...prev,
      { id: prev.reduce((max, l) => Math.max(max, l.id), 0) + 1, label: "", url: "" },
    ]);
  };

  const updateSnsLink = (
    id: number,
    field: "label" | "url",
    value: string,
  ) => {
    setSnsLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    );
  };

  /** 링크 입력을 벗어나면 스킴이 없는 주소에 https://를 붙여줍니다. */
  const normalizeSnsLinkUrl = (id: number) => {
    setSnsLinks((prev) =>
      prev.map((link) => {
        if (link.id !== id) return link;
        const trimmed = link.url.trim();
        if (!trimmed || /^https?:\/\//i.test(trimmed)) {
          return { ...link, url: trimmed };
        }
        return { ...link, url: `https://${trimmed}` };
      }),
    );
  };

  const removeSnsLink = (id: number) => {
    setSnsLinks((prev) => prev.filter((link) => link.id !== id));
  };

  /** 활동 사진 — 설명은 선택 입력 */
  const [activityPhotos, setActivityPhotos] = useState<
    { id: number; caption: string }[]
  >(() => [1, 2, 3].map((id) => ({ id, caption: "" })));

  const updatePhotoCaption = (id: number, caption: string) => {
    setActivityPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, caption } : photo)),
    );
  };

  const addActivityPhoto = () => {
    setActivityPhotos((prev) => [
      ...prev,
      { id: prev.reduce((max, p) => Math.max(max, p.id), 0) + 1, caption: "" },
    ]);
  };

  const removeActivityPhoto = (id: number) => {
    setActivityPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  /** 상세페이지 태그 (최대 MAX_TAGS개) */
  const [tags, setTags] = useState<string[]>(() => [...PAGE_TAGS]);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  const closeTagInput = () => {
    setIsAddingTag(false);
    setNewTag("");
  };

  /** 입력값을 #태그 형태로 정규화해 추가합니다. */
  const commitTag = () => {
    const value = newTag.trim().replace(/^#+/, "").trim();
    if (!value) {
      closeTagInput();
      return;
    }
    const nextTag = `#${value}`;
    setTags((prev) =>
      prev.includes(nextTag) || prev.length >= MAX_TAGS
        ? prev
        : [...prev, nextTag],
    );
    closeTagInput();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTag();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeTagInput();
    }
  };
  const [applicants, setApplicants] = useState<SubmittedApplication[]>(
    () => SUBMITTED_APPLICATIONS.map((applicant) => ({ ...applicant })),
  );

  /** 신청폼 문항 (필수 여부를 여기서 관리) */
  const [questions, setQuestions] = useState<ApplicationQuestion[]>(() =>
    APPLICATION_QUESTIONS.map((question) => ({ ...question })),
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailPreviewOpen, setIsDetailPreviewOpen] = useState(false);

  /** 새 문항 추가 다이얼로그 */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<QuestionType>("단답형");
  const [newRequired, setNewRequired] = useState(false);
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);
  const [addSubmitted, setAddSubmitted] = useState(false);

  const isChoice = hasOptions(newType);
  const filledOptions = newOptions.map((o) => o.trim()).filter(Boolean);
  const titleError = !newTitle.trim();
  const optionsError = isChoice && filledOptions.length < 2;

  const openAddQuestion = () => {
    setNewTitle("");
    setNewType("단답형");
    setNewRequired(false);
    setNewOptions(["", ""]);
    setAddSubmitted(false);
    setIsAddOpen(true);
  };

  const updateOption = (index: number, value: string) => {
    setNewOptions((prev) =>
      prev.map((option, i) => (i === index ? value : option)),
    );
  };

  const addOption = () => setNewOptions((prev) => [...prev, ""]);

  const removeOption = (index: number) => {
    setNewOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const submitNewQuestion = () => {
    setAddSubmitted(true);
    if (titleError || optionsError) return;

    setQuestions((prev) => [
      ...prev,
      {
        id: prev.reduce((max, q) => Math.max(max, q.id), 0) + 1,
        title: newTitle.trim(),
        type: newType,
        required: newRequired,
        ...(isChoice ? { options: filledOptions } : {}),
      },
    ]);
    setIsAddOpen(false);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const toggleRequired = (id: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === id
          ? { ...question, required: !question.required }
          : question,
      ),
    );
  };

  /** 상태 변경 확인 다이얼로그 대상 (null이면 닫힘) */
  const [statusEdit, setStatusEdit] = useState<{
    applicant: SubmittedApplication;
    nextStatus: ApplicationStatusValue;
  } | null>(null);
  const [statusComment, setStatusComment] = useState("");

  /** 상태를 고르면 사유를 받기 위해 다이얼로그를 엽니다. */
  const openStatusEdit = (
    applicant: SubmittedApplication,
    nextStatus: ApplicationStatusValue,
  ) => {
    setStatusEdit({ applicant, nextStatus });
    setStatusComment(applicant.statusComment ?? "");
  };

  const closeStatusEdit = () => {
    setStatusEdit(null);
    setStatusComment("");
  };

  /** 다이얼로그에서 저장을 눌러야 상태와 코멘트가 반영됩니다. */
  const confirmStatusChange = () => {
    if (!statusEdit) return;
    const { applicant, nextStatus } = statusEdit;
    const comment = statusComment.trim();
    setApplicants((prev) =>
      prev.map((row) =>
        row.id === applicant.id
          ? { ...row, status: nextStatus, statusComment: comment || undefined }
          : row,
      ),
    );
    closeStatusEdit();
  };

  const renderMainContent = () => {
    if (activeTab === "club-register") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-2xl align-bottom font-bold text-foreground">
            동아리 정보
          </h2>
          <div className="mt-0 border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  동아리명 <span className="text-red-500">*</span>
                </h3>
                <Input
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="예: CPR"
                  className="mt-3 h-10 bg-white"
                />
              </div>
              <div>
                <h3 id="club-category-label" className="text-base font-bold text-slate-800">
                  카테고리 <span className="text-red-500">*</span>
                </h3>
                <div className="relative mt-3">
                  <select
                    id="club-category"
                    aria-labelledby="club-category-label"
                    value={clubCategory}
                    onChange={(e) => setClubCategory(e.target.value)}
                    className={cn(
                      "h-10 w-full appearance-none rounded-md border border-input bg-white px-3 pr-10 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      !clubCategory && "text-muted-foreground",
                    )}
                  >
                    <option value="" disabled>
                      분과를 선택해주세요
                    </option>
                    {CLUB_DIVISION_KEYS.map((division) => (
                      <option key={division} value={division} className="text-foreground">
                        {division}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                대표 이미지{" "}
                <span className="text-sm font-medium text-slate-400">(권장: 1920×1080px)</span>
              </h3>
              <button
                type="button"
                className="mt-3 flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ImageIcon className="mb-2 size-8 text-slate-400" />
                <span className="text-sm font-medium">
                  클릭하여 이미지 업로드
                </span>
              </button>
            </div>

            <div className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                동아리 한줄 소개 <span className="text-red-500">*</span>
              </h3>
              <Textarea
                value={clubTagline}
                onChange={(e) => setClubTagline(e.target.value)}
                placeholder="동아리를 소개하는 글을 입력해주세요."
                className="mt-3 min-h-[84px] resize-none bg-white"
              />
            </div>

            <section className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                태그 설정 <span className="text-sm font-medium text-slate-400">(최대 5개)</span>
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FC] px-3 py-1.5 text-sm font-semibold text-[#1B4A8F]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex size-4 items-center justify-center rounded-full bg-[#D9E6FB] text-[#1B4A8F] transition-colors hover:bg-[#C3D8F7]"
                      aria-label={`${tag} 삭제`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}

                {/* 마지막: 추가 입력 또는 추가 버튼 */}
                {isAddingTag ? (
                  <input
                    ref={tagInputRef}
                    autoFocus
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={commitTag}
                    placeholder="입력 후 Enter"
                    maxLength={20}
                    aria-label="태그 직접 입력"
                    className="h-8 w-36 rounded-full border border-primary bg-white px-3 text-sm font-semibold text-slate-700 outline-none ring-2 ring-primary/30 placeholder:font-normal placeholder:text-slate-400"
                  />
                ) : (
                  tags.length < MAX_TAGS && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewTag("");
                        setIsAddingTag(true);
                      }}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      <Plus className="size-3.5" />
                      태그 추가
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="mt-5">
              <h3 className="text-base font-bold text-slate-800">
                연락처 · SNS 링크
              </h3>

              <div className="mt-3 flex items-center gap-2">
                <Input
                  value={clubContact}
                  onChange={(e) => setClubContact(e.target.value)}
                  placeholder="이메일 또는 전화번호 (예: dreamlounge@cju.ac.kr)"
                  className="h-10 flex-1 bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSnsLink}
                  className="h-10 shrink-0"
                >
                  <Plus className="mr-1 size-4" />
                  링크 추가
                </Button>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {snsLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) =>
                        updateSnsLink(link.id, "label", e.target.value)
                      }
                      placeholder="예: 인스타그램"
                      aria-label="링크 이름"
                      className="h-10 w-32 shrink-0 bg-white sm:w-40"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateSnsLink(link.id, "url", e.target.value)
                      }
                      onBlur={() => normalizeSnsLinkUrl(link.id)}
                      placeholder="instagram.com/dreamlounge"
                      aria-label="링크 주소"
                      className="h-10 flex-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeSnsLink(link.id)}
                      aria-label="링크 삭제"
                      className="shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg px-5 sm:w-auto">
                <Save className="mr-1 size-4" />
                저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "application-form") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl align-bottom font-bold text-foreground">
              신청폼 설정
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="h-9 w-full rounded-lg px-4 sm:w-auto"
              >
                <Eye className="mr-1 size-4" />
                미리보기
              </Button>
              <Button
                onClick={openAddQuestion}
                className="h-9 w-full rounded-lg bg-slate-900 px-4 text-white hover:bg-slate-800 sm:w-auto"
              >
                <CirclePlus className="mr-1 size-4" />새 문항 추가
              </Button>
            </div>
          </div>

          <div className="mt-0 border-t border-slate-200 pt-5">
            <ul className="space-y-4">
              {questions.map((question, index) => (
                <li
                  key={question.id}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-foreground">
                        {question.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-1 sm:justify-end shrink-0">
                      <span className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                        {question.type}
                      </span>
                      <label className="inline-flex cursor-pointer items-center gap-2 align-bottom text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={() => toggleRequired(question.id)}
                          className="size-4 rounded border-slate-300"
                        />
                        필수 응답
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-slate-400 transition-colors hover:text-destructive"
                        aria-label={`${question.title} 문항 삭제`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg px-5 sm:w-auto">
                <Save className="mr-1 size-4" />
                변경사항 저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "submitted-applications") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl align-bottom font-bold text-foreground">
                신청서 관리
              </h2>
              <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-lg font-extrabold text-[#1F4F95]">
                총 12명
              </span>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row xl:w-auto">
              <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-500 sm:flex-1 xl:w-[280px] xl:flex-none">
                <Search className="size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="이름, 학번, 학과 검색"
                  className="h-full w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 sm:w-11"
                aria-label="필터"
              >
                <SlidersHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full table-fixed">
              <thead className="bg-[#F8FAFD]">
                <tr className="h-12 text-left text-sm font-semibold text-slate-500">
                  <th className="w-[72px] px-4">NO.</th>
                  <th className="w-[160px] px-4">이름 / 학번</th>
                  <th className="w-[160px] px-4">학과</th>
                  <th className="w-[130px] px-4">지원일시</th>
                  <th className="w-[120px] px-4">상태</th>
                  <th className="w-[130px] px-4 text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {applicants.map((applicant) => {
                  return (
                    <tr
                      key={applicant.id}
                      className="h-[88px] border-t border-slate-100 text-sm text-slate-700 first:border-t-0"
                    >
                      <td className="px-4 text-sm font-semibold text-slate-600">
                        {applicant.id}
                      </td>
                      <td className="px-4">
                        <div className="text-sm font-bold leading-tight text-slate-900">
                          {applicant.name}
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-500">
                          {applicant.studentId}
                        </div>
                      </td>
                      <td className="px-4 text-sm font-semibold text-slate-700">
                        {applicant.major}
                      </td>
                      <td className="px-4 text-sm font-semibold text-slate-500">
                        {applicant.submittedAt}
                      </td>
                      <td className="px-4">
                        <div className="relative inline-flex">
                          <select
                            value={applicant.status}
                            onChange={(e) =>
                              openStatusEdit(
                                applicant,
                                e.target.value as ApplicationStatusValue,
                              )
                            }
                            aria-label={`${applicant.name} 상태 변경`}
                            className={cn(
                              "h-7 cursor-pointer appearance-none rounded-full border-transparent pl-3 pr-7 text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                              STATUS_SELECT_CLASS[applicant.status],
                            )}
                          >
                            {APPLICATION_STATUSES.map((status) => (
                              <option key={status} value={status} className="bg-white text-slate-700">
                                {status}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2"
                            aria-hidden
                          />
                        </div>

                        {/* 저장된 사유 미리보기 */}
                        {applicant.statusComment && (
                          <button
                            type="button"
                            onClick={() =>
                              openStatusEdit(applicant, applicant.status)
                            }
                            title={applicant.statusComment}
                            className="mt-1.5 flex max-w-[104px] items-center gap-1 text-left text-xs text-slate-500 transition-colors hover:text-slate-700"
                          >
                            <MessageSquare className="size-3 shrink-0" aria-hidden />
                            <span className="truncate">
                              {applicant.statusComment}
                            </span>
                          </button>
                        )}
                      </td>
                      <td className="px-4 text-center">
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-[#EDF3FF] px-4 text-sm font-semibold text-[#2B63B4] transition-colors hover:bg-[#E2EDFF]"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-slate-500">전체 12명 중 1-4명</p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-400"
                >
                  이전
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-bold text-[#2B63B4]"
                >
                  1
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-500"
                >
                  2
                </button>
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-500"
                >
                  3
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                >
                  다음
                </button>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "page-tags") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl align-bottom font-bold text-foreground">
              상세페이지 설정
            </h2>
            <Button
              variant="outline"
              onClick={() => setIsDetailPreviewOpen(true)}
              className="h-9 w-full rounded-lg px-4 sm:w-auto"
            >
              <Eye className="mr-1 size-4" />
              미리보기
            </Button>
          </div>

          <div className="mt-0 border-t border-slate-200 pt-6">
            <section>
              <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-800">
                상단 배너 이미지
                <span className="text-sm font-medium text-slate-400">
                  (권장: 1500×500px)
                </span>
                <span className="group relative inline-flex">
                  <button
                    type="button"
                    aria-label="배너 이미지 안내"
                    aria-describedby="banner-crop-tip"
                    className="inline-flex text-slate-400 transition-colors hover:text-slate-600 focus-visible:text-slate-600 focus-visible:outline-none"
                  >
                    <Info className="size-4" />
                  </button>
                  <span
                    id="banner-crop-tip"
                    role="tooltip"
                    className="pointer-events-none absolute top-full left-1/2 z-20 mt-2 w-60 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                  >
                    화면 너비에 따라 좌우나 위아래가 잘릴 수 있습니다. 로고와
                    문구는 가운데에 배치해주세요.
                  </span>
                </span>
              </h3>
              <button
                type="button"
                className="mt-3 flex aspect-[3/1] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ImageIcon className="mb-2 size-8 text-slate-400" />
                <span className="text-sm font-medium">
                  클릭하여 이미지 업로드
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  JPG, PNG · 최대 5MB
                </span>
              </button>
            </section>

            <section className="mt-6">
              <h3 className="text-base font-bold text-slate-800">
                동아리 상세 설명
              </h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                <div className="flex h-11 items-center gap-1 border-b border-slate-200 bg-[#F8FAFD] px-3">
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="굵게"
                  >
                    <Bold className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="기울임"
                  >
                    <Italic className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="밑줄"
                  >
                    <Underline className="size-4" />
                  </button>
                  <div className="mx-1 h-4 w-px bg-slate-300" />
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-200"
                    aria-label="이미지 삽입"
                  >
                    <ImagePlus className="size-4" />
                  </button>
                </div>
                <Textarea
                  id="club-detail-description"
                  value={clubDetailDescription}
                  onChange={(e) => setClubDetailDescription(e.target.value)}
                  placeholder={CLUB_DETAIL_DESCRIPTION_PLACEHOLDER}
                  className="min-h-[170px] w-full resize-y rounded-none border-0 bg-white p-4 text-sm leading-relaxed shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label="동아리 상세 설명"
                />
              </div>
            </section>

            <section className="mt-6">
              <h3 className="text-base font-bold text-slate-800">활동 사진</h3>
              <div className="mt-3 flex flex-wrap items-start gap-3">
                {activityPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="flex w-[120px] flex-col gap-1.5 sm:w-[140px]"
                  >
                    <div className="relative">
                      <div className="flex h-[96px] w-full items-center justify-center rounded-xl border border-slate-200 bg-[#F4F6FA] text-sm font-semibold text-slate-400 sm:h-[116px] sm:text-base">
                        사진 {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeActivityPhoto(photo.id)}
                        aria-label={`사진 ${index + 1} 삭제`}
                        className="absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                    <Input
                      value={photo.caption}
                      onChange={(e) =>
                        updatePhotoCaption(photo.id, e.target.value)
                      }
                      placeholder="설명 (선택)"
                      maxLength={30}
                      aria-label={`사진 ${index + 1} 설명`}
                      className="h-8 bg-white px-2 text-xs"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addActivityPhoto}
                  className="flex h-[96px] w-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-500 transition-colors hover:bg-slate-50 sm:h-[116px] sm:w-[140px]"
                >
                  <div className="inline-flex size-8 items-center justify-center rounded-full border border-slate-300">
                    <Plus className="size-4" />
                  </div>
                  <span className="mt-2 text-sm font-semibold">사진 추가</span>
                </button>
              </div>
            </section>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 w-full rounded-lg bg-[#0A5CB5] px-6 text-white hover:bg-[#0A4F9D] sm:w-auto">
                <Save className="mr-1.5 size-4" />
                페이지 설정 저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "community-board") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl align-bottom font-bold text-foreground">
              게시판 관리
            </h2>
            <Button className="h-11 w-full rounded-xl bg-[#0F1B33] px-5 text-sm font-semibold text-white hover:bg-[#111f3b] sm:w-auto">
              <SquarePen className="mr-2 size-4" />
              게시글 작성
            </Button>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full table-fixed">
              <thead className="bg-[#F8FAFD]">
                <tr className="h-12 border-b border-slate-200 text-left text-sm font-semibold text-slate-500">
                  <th className="w-[72px] px-4">선택</th>
                  <th className="px-4">제목</th>
                  <th className="w-[96px] px-4">작성자</th>
                  <th className="w-[108px] px-4">작성일</th>
                  <th className="w-[72px] px-4">조회</th>
                  <th className="w-[88px] px-4 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {COMMUNITY_POSTS.map((post) => (
                  <tr
                    key={post.id}
                    className="h-[56px] border-t border-slate-100 text-sm font-medium text-slate-700 first:border-t-0"
                  >
                    <td className="px-4">
                      <input
                        type="checkbox"
                        className="size-5 rounded border-slate-300 align-middle"
                        aria-label={`${post.title} 선택`}
                      />
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        {post.isNotice ? (
                          <Badge className="font-semibold">공지</Badge>
                        ) : null}
                        <span className="truncate text-[15px] font-semibold text-slate-800">
                          {post.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-sm text-slate-600">{post.author}</td>
                    <td className="px-4 text-sm text-slate-500">{post.createdAt}</td>
                    <td className="px-4 text-sm text-slate-500">{post.views}</td>
                    <td className="px-4">
                      <div className="flex items-center justify-center gap-3 text-slate-400">
                        <button
                          type="button"
                          className="transition-colors hover:text-slate-600"
                          aria-label={`${post.title} 수정`}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="transition-colors hover:text-slate-600"
                          aria-label={`${post.title} 삭제`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-3">
              <button
                type="button"
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                선택 삭제
              </button>
              <button
                type="button"
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                공지로 등록
              </button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-2xl align-bottom font-bold text-foreground">준비 중인 메뉴</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          현재 탭은 다음 화면에서 구현 예정입니다.
        </p>
      </Card>
    );
  };

  return (
    <section className="w-full rounded-xl border border-border bg-[#F6F8FB]">
      <div className="flex min-h-[760px] flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-border bg-[#F3F5F8] lg:w-[248px] lg:border-r lg:border-b-0">
          <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="text-2xl font-extrabold tracking-tight text-[#1B4A8F]">
              Dream Lounge
            </div>
            <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-slate-400">
              ADMINISTRATOR
            </div>
          </div>

          <nav className="space-y-4 px-3 py-4 sm:space-y-6 sm:px-4 sm:py-5" aria-label="관리자 메뉴">
            {ADMIN_MENU.map((group) => (
              <div key={group.section}>
                <p className="mb-2 px-2 text-xs font-semibold text-slate-400">
                  {group.section}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          onClick={() => setActiveTab(item.tab)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                            isActive
                              ? "border-r-2 border-primary bg-[#EAF1FC] text-primary"
                              : "text-slate-600 hover:bg-slate-100",
                          )}
                        >
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 bg-[#F6F8FB]">
          <div className="p-3 sm:p-5 lg:p-8">{renderMainContent()}</div>
        </div>
      </div>

      {/* 새 문항 추가 */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="mb-2.5 font-bold">새 문항 추가</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* 문항 내용 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="new-question-title"
                className="text-sm font-semibold text-foreground"
              >
                문항 내용 <span className="text-destructive">*</span>
              </label>
              <Input
                id="new-question-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="지원자에게 물어볼 내용을 입력해주세요."
                maxLength={100}
                className={cn(
                  addSubmitted &&
                    titleError &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {addSubmitted && titleError && (
                <p className="text-sm text-destructive">
                  문항 내용을 입력해주세요.
                </p>
              )}
            </div>

            {/* 유형 */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-foreground">유형</span>
              <div className="flex flex-wrap gap-2">
                {QUESTION_TYPES.map((type) => {
                  const isActive = newType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewType(type)}
                      aria-pressed={isActive}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-muted/60",
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 객관식 선택지 */}
            {isChoice && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">
                  선택지 <span className="text-destructive">*</span>
                </span>
                <div className="flex flex-col gap-2">
                  {newOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`선택지 ${index + 1}`}
                        maxLength={50}
                        aria-label={`선택지 ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        disabled={newOptions.length <= 2}
                        aria-label={`선택지 ${index + 1} 삭제`}
                        className="shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {addSubmitted && optionsError && (
                  <p className="text-sm text-destructive">
                    선택지를 2개 이상 입력해주세요.
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="h-9 self-start"
                >
                  <Plus className="mr-1 size-4" />
                  선택지 추가
                </Button>
              </div>
            )}

            {/* 필수 응답 */}
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                checked={newRequired}
                onChange={() => setNewRequired((prev) => !prev)}
                className="size-4 rounded border-slate-300"
              />
              필수 응답으로 설정
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
            >
              취소
            </Button>
            <Button type="button" onClick={submitNewQuestion}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 신청폼 미리보기 — 지원자에게 보이는 모습 */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="mb-2.5 font-bold">
              신청폼 미리보기
            </DialogTitle>
          </DialogHeader>

          {questions.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              아직 등록된 문항이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {questions.map((question, index) => (
                <div key={question.id} className="flex flex-col gap-2">
                  <label
                    htmlFor={`preview-q-${question.id}`}
                    className="flex gap-1.5 text-sm font-semibold text-foreground"
                  >
                    <span className="text-muted-foreground">{index + 1}.</span>
                    <span>
                      {question.title}
                      {question.required && (
                        <span className="ml-1 text-destructive">*</span>
                      )}
                    </span>
                  </label>

                  {question.type === "단답형" && (
                    <Input
                      id={`preview-q-${question.id}`}
                      placeholder="답변을 입력해주세요."
                    />
                  )}

                  {question.type === "장문형" && (
                    <Textarea
                      id={`preview-q-${question.id}`}
                      placeholder="답변을 입력해주세요."
                      className="min-h-[120px] resize-none"
                    />
                  )}

                  {hasOptions(question.type) && (
                    <div className="flex flex-col gap-2">
                      {question.options?.map((option, optionIndex) => (
                        <label
                          key={`${question.id}-${optionIndex}`}
                          className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground"
                        >
                          {question.type === "객관식" ? (
                            <input
                              type="radio"
                              name={`preview-q-${question.id}`}
                              className="size-4 border-slate-300"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              name={`preview-q-${question.id}`}
                              className="size-4 rounded border-slate-300"
                            />
                          )}
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setIsPreviewOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상세페이지 미리보기 — 지원자에게 보이는 모습 */}
      <Dialog open={isDetailPreviewOpen} onOpenChange={setIsDetailPreviewOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="mb-2.5 font-bold">
              상세페이지 미리보기
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            {/* 상단 배너 */}
            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-slate-100">
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
                <ImageIcon className="size-7" aria-hidden />
                <span className="text-xs font-medium">
                  등록된 배너 이미지 없음
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <Badge size="detail" className="bg-primary font-semibold text-primary-foreground">
                  모집중
                </Badge>
              </div>
            </div>

            {/* 카테고리 · 동아리명 · 한줄 소개 · 태그 — ClubDetail과 동일 구성 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-primary">
                  {clubCategory || "분과 미선택"}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {clubName.trim() || (
                  <span className="text-muted-foreground/60">
                    동아리명 미입력
                  </span>
                )}
              </h3>
              <p
                className={cn(
                  "text-base whitespace-pre-line sm:text-lg",
                  clubTagline.trim()
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60",
                )}
              >
                {clubTagline.trim() || "한줄 소개 미입력"}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    size="detail"
                    className="font-normal text-secondary-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 동아리 소개 */}
            <section className="space-y-4">
              <h4 className="text-xl font-bold">동아리 소개</h4>
              <div
                className={cn(
                  "text-base leading-relaxed whitespace-pre-line",
                  clubDetailDescription.trim()
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60",
                )}
              >
                {clubDetailDescription.trim() ||
                  "아직 작성된 상세 설명이 없습니다."}
              </div>
            </section>

            {/* 주요 활동 */}
            <section className="space-y-4">
              <h4 className="text-xl font-bold">주요 활동</h4>
              {activityPhotos.length === 0 ? (
                <p className="text-base text-muted-foreground/60">
                  등록된 활동 사진이 없습니다.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {activityPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="flex flex-col overflow-hidden rounded-lg border bg-card"
                    >
                      {/* 설명이 없는 카드는 이미지가 남은 높이를 채웁니다. */}
                      <div className="flex min-h-48 w-full flex-1 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
                        사진 {index + 1}
                      </div>
                      {/* 설명은 선택 입력이라 비어 있으면 표시하지 않습니다. */}
                      {photo.caption.trim() && (
                        <div className="p-3">
                          <p className="text-center text-sm font-bold">
                            {photo.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 연락처 · SNS — 입력된 것이 하나라도 있을 때만 노출 */}
            {(clubContact.trim() ||
              snsLinks.some((link) => link.label.trim() && link.url.trim())) && (
              <section className="space-y-4">
                <h4 className="text-xl font-bold">연락처</h4>
                <div className="flex flex-col gap-3">
                  {clubContact.trim() && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                      {clubContact}
                    </div>
                  )}
                  {snsLinks
                    .filter((link) => link.label.trim() && link.url.trim())
                    .map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
                      >
                        <Link2 className="size-4 shrink-0" aria-hidden />
                        {link.label}
                      </a>
                    ))}
                </div>
              </section>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIsDetailPreviewOpen(false)}
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상태 변경 시 사유를 남기는 다이얼로그 */}
      <Dialog
        open={statusEdit !== null}
        onOpenChange={(open) => {
          if (!open) closeStatusEdit();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>상태 변경</DialogTitle>
            <DialogDescription>
              {statusEdit && (
                <>
                  <span className="font-semibold text-foreground">
                    {statusEdit.applicant.name}
                  </span>
                  님의 상태를{" "}
                  <span className="font-semibold text-foreground">
                    {statusEdit.nextStatus}
                  </span>
                  (으)로 변경합니다.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="status-comment"
              className="text-sm font-semibold text-foreground"
            >
              코멘트
            </label>
            <Textarea
              id="status-comment"
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="변경 사유나 지원자에게 전달할 내용을 남겨주세요."
              rows={4}
              maxLength={300}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                선택 입력입니다.
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {statusComment.length} / 300
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={closeStatusEdit}>
              취소
            </Button>
            <Button type="button" onClick={confirmStatusChange}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
