import { useState } from "react";
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      { label: "동아리 등록하기", icon: PlusCircle, tab: "club-register" },
    ],
  },
  {
    section: "신청서 관리",
    items: [
      { label: "동아리 신청폼 설정", icon: Settings, tab: "application-form" },
      {
        label: "제출된 신청서 관리",
        icon: FileText,
        tab: "submitted-applications",
      },
    ],
  },
  {
    section: "페이지 설정",
    items: [{ label: "소개페이지 및 태그", icon: Tag, tab: "page-tags" }],
  },
  {
    section: "커뮤니티",
    items: [
      {
        label: "동아리 게시판 관리",
        icon: MessageSquare,
        tab: "community-board",
      },
    ],
  },
];

const APPLICATION_QUESTIONS = [
  { id: 1, title: "지원 동기를 작성해주세요.", type: "단답형" },
  { id: 2, title: "본인의 장단점을 설명해주세요.", type: "장문형" },
  {
    id: 3,
    title: "해당 분야에 대한 경험이 있으신가요?",
    type: "객관식 (단일선택)",
  },
] as const;

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("application-form");

  const renderMainContent = () => {
    if (activeTab === "club-register") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">기본 정보 입력</h2>
          <div className="mt-5 border-t border-slate-200 pt-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  동아리명 <span className="text-red-500">*</span>
                </label>
                <Input placeholder="예: CPR" className="h-10 bg-white" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <Input placeholder="학술" className="h-10 bg-white" />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                대표 이미지{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (권장: 1920×1080px)
                </span>
              </label>
              <button
                type="button"
                className="flex h-36 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
              >
                <ImageIcon className="mb-2 size-8 text-slate-400" />
                <span className="text-sm font-medium">
                  클릭하여 이미지 업로드
                </span>
              </button>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                한 줄 소개 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="동아리를 가장 잘 표현하는 한 줄을 작성해주세요."
                className="h-10 bg-white"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                모집 대상 및 자격 요건
              </label>
              <Textarea
                placeholder="지원 가능한 대상과 자격 요건을 입력해주세요."
                className="min-h-[84px] resize-none bg-white"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 rounded-lg px-5">
                <PlusCircle className="mr-1 size-4" />
                동아리 등록
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (activeTab === "application-form") {
      return (
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              모집 신청폼 문항 설정
            </h2>
            <Button className="h-9 rounded-lg bg-slate-900 px-4 text-white hover:bg-slate-800">
              <CirclePlus className="mr-1 size-4" />새 문항 추가
            </Button>
          </div>

          <div className="mt-5 border-t border-slate-200 pt-5">
            <ul className="space-y-4">
              {APPLICATION_QUESTIONS.map((question) => (
                <li
                  key={question.id}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                          {question.id}
                        </span>
                        <p className="text-base font-semibold text-foreground">
                          {question.title}
                        </p>
                      </div>
                      <span className="mt-2 ml-10 inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                        {question.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300"
                        />
                        필수 응답
                      </label>
                      <button
                        type="button"
                        className="text-slate-400 transition-colors hover:text-slate-600"
                        aria-label="문항 삭제"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-end">
              <Button className="h-10 rounded-lg px-5">
                <Save className="mr-1 size-4" />
                변경사항 저장
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground">준비 중인 메뉴</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          현재 탭은 다음 화면에서 구현 예정입니다.
        </p>
      </Card>
    );
  };

  return (
    <section className="w-full rounded-xl border border-border bg-[#F6F8FB]">
      <div className="flex min-h-[760px]">
        <aside className="w-[248px] shrink-0 border-r border-border bg-[#F3F5F8]">
          <div className="border-b border-border px-6 py-5">
            <div className="text-2xl font-extrabold tracking-tight text-[#1B4A8F]">
              Dream Lounge
            </div>
            <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-slate-400">
              ADMINISTRATOR
            </div>
          </div>

          <nav className="space-y-6 px-4 py-5" aria-label="관리자 메뉴">
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
          <div className="p-8">{renderMainContent()}</div>
        </div>
      </div>
    </section>
  );
}
