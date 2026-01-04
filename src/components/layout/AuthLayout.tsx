import { Outlet } from "react-router-dom";

/**
 * 헤더와 푸터 없는 인증 페이지 전용 레이아웃
 * - 회원가입, 로그인 등 인증 관련 페이지에 사용
 */
export function AuthLayout() {
  return (
    <main className="min-h-screen flex items-start justify-center pt-[12vh] pb-8 px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
}
