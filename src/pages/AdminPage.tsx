import { PlusCircle, Settings, FileText, Tag, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ADMIN_MENU = [
  {
    section: "동아리 관리",
    items: [{ label: "동아리 등록하기", icon: PlusCircle, active: true }],
  },
  {
    section: "신청서 관리",
    items: [
      { label: "동아리 신청폼 설정", icon: Settings, active: false },
      { label: "제출된 신청서 관리", icon: FileText, active: false },
    ],
  },
  {
    section: "페이지 설정",
    items: [{ label: "소개페이지 및 태그", icon: Tag, active: false }],
  },
  {
    section: "커뮤니티",
    items: [{ label: "동아리 게시판 관리", icon: MessageSquare, active: false }],
  },
] as const;

export function AdminPage() {
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
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                            item.active
                              ? "border-r-2 border-primary bg-[#EAF1FC] text-primary"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
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
          <div className="flex items-center justify-between border-b border-border px-8 py-4">
            <h1 className="inline-flex items-center gap-2 text-2xl font-bold text-foreground">
              <PlusCircle className="size-5 text-primary" />
              동아리 등록하기
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#2E5EA6] shadow-sm">
              <span className="size-2 rounded-full bg-blue-500" />
              관리자 계정 접속중
              <span className="ml-1 inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-[11px] font-bold text-white">
                AD
              </span>
            </div>
          </div>

          <div className="p-8">
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
                    <span className="text-sm font-medium">클릭하여 이미지 업로드</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}

