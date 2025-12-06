import { Search, Bell } from "lucide-react";
import { Input } from "../ui/input";


export function Header() {
    return (
        <header className="w-full flex justify-center bg-white shadow-sm">
            <div className="w-full px-12 py-5 flex flex-col items-start bg-background shadow box-border">
                <div className="w-full flex items-center justify-between relative shrink-0">

                    {/* Left Section: Logo & Navigation */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <div className="w-14 h-12 relative shrink-0 flex items-center">
                            <div className="relative w-full h-full">
                                <span className="absolute top-1 left-0 font-logo text-base leading-4 tracking-tighter text-primary">
                                    Dream
                                </span>
                                <span className="absolute top-7 left-0 font-logo text-base leading-4 tracking-tighter text-primary">
                                    Lounge
                                </span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="h-10 flex items-center gap-4 sm:gap-6">
                            {["동아리 찾기", "커뮤니티", "이벤트", "고객센터"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="font-kr text-base font-bold text-foreground hover:text-primary transition-colors px-3 py-1.5"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right Section: Search & Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
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

                        {/* Icon Button (Placeholder) */}
                        <button className="size-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                            <Bell className="size-5 text-foreground" />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
