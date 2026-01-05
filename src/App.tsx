import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Home } from "@/pages/Home";
import { ClubDetail } from "@/pages/ClubDetail";
import { ClubApplication } from "@/pages/ClubApplication";
import { Signup } from "@/pages/Signup";
import { Login } from "@/pages/Login";
import { ScrollToTop } from "@/components/common/ScrollToTop";

/**
 * 앱의 메인 진입점 컴포넌트
 * - MainLayout: 헤더/푸터가 있는 일반 페이지용 레이아웃
 * - AuthLayout: 헤더/푸터 없는 인증 페이지용 레이아웃
 */
function App() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <ScrollToTop />
      <Routes>
        {/* 헤더/푸터 없는 인증 페이지 */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 헤더/푸터 있는 일반 페이지 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/club/:id/apply" element={<ClubApplication />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
