import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Youtube, href: "#", label: "Youtube" },
    { Icon: Twitter, href: "#", label: "Twitter" },
];

const FOOTER_SECTIONS = [
    {
        title: "소개",
        links: [
            { to: "/about", text: "서비스 소개" },
            { to: "/team", text: "팀 소개" },
        ],
    },
    {
        title: "고객지원",
        links: [
            { to: "/notice", text: "공지사항" },
            { to: "/faq", text: "자주 묻는 질문" },
            { to: "/report", text: "신고하기" },
            { to: "/developers", text: "개발자 센터" },
        ],
    },
    {
        title: "정책",
        links: [
            { to: "/terms", text: "이용약관" },
            { to: "/privacy", text: "개인정보처리방침" },
            { to: "/cookies", text: "쿠키정책" },
        ],
    },
];

export function Footer() {
    return (
        <footer className="w-full flex justify-center bg-stone-900 text-stone-100">
            <div
                className="w-full max-w-7xl px-12 py-10 flex flex-col gap-8 items-start relative box-border"
                data-node-id="7:541"
            >
                {/* Top Section */}
                <div className="w-full flex gap-13 items-start relative shrink-0">

                    {/* Left Column: Logo & Description */}
                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-80">
                        {/* Logo */}
                        <Link to="/" className="relative shrink-0 w-full h-11 block">
                            <span className="absolute left-0 top-0 font-logo font-bold text-lg leading-snug tracking-tight text-primary">
                                Dream
                            </span>
                            <span className="absolute left-0 top-5 font-logo font-bold text-lg leading-snug tracking-tight text-primary">
                                Lounge
                            </span>
                        </Link>

                        {/* Description */}
                        <div className="relative shrink-0 w-full h-10 font-kr text-sm text-stone-400">
                            <p className="leading-5">대학생들의 꿈과 열정을 이어주는</p>
                            <p className="leading-5">동아리 플랫폼입니다.</p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-2">
                            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-8 bg-stone-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white transition-colors text-stone-900"
                                >
                                    <Icon className="size-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Columns: Navigation */}
                    <div className="flex-1 flex gap-20 pt-2">
                        {FOOTER_SECTIONS.map(({ title, links }) => (
                            <div key={title} className="flex flex-col gap-3">
                                <h3 className="font-kr font-bold text-base text-white">{title}</h3>
                                <ul className="flex flex-col gap-2">
                                    {links.map(({ to, text }) => (
                                        <li key={text}>
                                            <Link to={to} className="font-kr text-sm text-stone-400 hover:text-white transition-colors">
                                                {text}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Bottom Section: Copyright */}
                <div className="w-full pt-8 border-t border-stone-800 mt-auto">
                    <p className="font-kr text-xs text-stone-600 text-center">
                        © 2024 Dream Lounge. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
