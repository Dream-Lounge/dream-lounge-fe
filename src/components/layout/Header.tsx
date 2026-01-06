import { Link } from "react-router-dom";
import { Search, User } from "lucide-react";
import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { LoginAlertDialog } from "@/components/common/LoginAlertDialog";
import { useState } from "react";


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
    const { user, isAuthenticated, logout } = useAuth();
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);

    return (
        <header className="w-full flex justify-center bg-background shadow-sm sticky top-0 z-50">
            <div className="container px-8 py-2 flex flex-col items-start">
                <div className="w-full flex items-center justify-between relative shrink-0">

                    {/** 좌측 영역: 로고 및 메인 네비게이션 */}
                    <div className="flex items-center gap-10">
                        {/** 로고 영역: 클릭 시 홈으로 이동 */}
                        <Link to="/" className="h-12 shrink-0 flex items-center">
                            <img src="/logo.svg" alt="Dream Lounge Logo" className="h-full w-auto" draggable={false} />
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

                        {/** 사용자 메뉴: 로그인 및 지원 내역 */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="size-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer">
                                    <User className="size-5 text-foreground" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-40 p-1">
                                <div className="flex flex-col">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="w-full px-3 py-2 text-sm font-medium text-foreground text-left cursor-default">
                                                {user?.name}님 반갑습니다.
                                            </div>
                                            <Separator className="my-1" />
                                            <Link
                                                to={`/users/${user?.studentId}/applications`}
                                                className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-sm transition-colors text-left"
                                            >
                                                내 지원 내역
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-sm transition-colors text-left"
                                            >
                                                로그아웃
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-sm transition-colors text-left"
                                            >
                                                로그인
                                            </Link>
                                            <Link
                                                to={user ? `/users/${user.studentId}/applications` : "/login"}
                                                className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-sm transition-colors text-left"
                                                onClick={(e) => {
                                                    if (!user) {
                                                        e.preventDefault();
                                                        setIsLoginAlertOpen(true);
                                                    }
                                                }}
                                            >
                                                내 지원 내역
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>
            <LoginAlertDialog
                open={isLoginAlertOpen}
                onOpenChange={setIsLoginAlertOpen}
                reason="내 지원 내역을 확인하려면 로그인이 필요합니다."
            />
        </header>
    );
}
