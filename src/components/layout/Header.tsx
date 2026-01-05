import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Input } from "../ui/input";


const NAV_ITEMS = [
    { label: "동아리 찾기", to: "/clubs" },
    { label: "커뮤니티", to: "/community" },
    { label: "이벤트", to: "/events" },
    { label: "고객센터", to: "/support" },
];

/**
 * 헤더 컴포넌트
 * - 사이트 전반의 네비게이션 및 주요 액션(검색, 알림 등)을 담당합니다.
 * - 반응형 디자인을 고려하여 제작되었습니다.
 */
export function Header() {
    return (
        <header className="w-full flex justify-center bg-background shadow-sm sticky top-0 z-50">
            <div className="container px-8 py-2 flex flex-col items-start">
                <div className="w-full flex items-center justify-between relative shrink-0">

                    {/** 좌측 영역: 로고 및 메인 네비게이션 */}
                    <div className="flex items-center gap-10">
                        {/** 로고 영역: 클릭 시 홈으로 이동 */}
                        <Link to="/" className="h-12 shrink-0 flex items-center">
                            <img src="/logo.svg" alt="Dream Lounge Logo" className="h-full w-auto" />
                        </Link>

                        {/** 메인 네비게이션: 메뉴 목록 렌더링 */}
                        <nav className="h-10 flex items-center gap-4 sm:gap-6">
                            {NAV_ITEMS.map(({ label, to }) => (
                                <Link
                                    key={label}
                                    to={to}
                                    className="font-kr text-base font-bold text-foreground hover:text-primary transition-colors px-3 py-1.5"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/** 우측 영역: 검색 바 및 사용자 액션 버튼 */}
                    <div className="flex items-center gap-4">
                        {/** 검색 바: 동아리 검색 기능 제공 */}
                        <div className="w-full max-w-sm space-y-2">
                            <div className="relative h-9">
                                <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
                                <Input
                                    className="bg-background pl-9 h-full rounded-2xl"
                                    id="search-input"
                                    placeholder="동아리 검색"
                                    type="search"
                                />
                            </div>
                        </div>

                        {/** 알림 버튼: 사용자 알림 확인 (추후 기능 구현 예정) */}
                        <button className="size-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                            <Bell className="size-5 text-foreground" />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
