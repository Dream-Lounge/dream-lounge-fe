import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Home } from "@/pages/Home";
import { ClubDetail } from "@/pages/ClubDetail";
import { ScrollToTop } from "@/components/common/ScrollToTop";

/**
 * 앱의 메인 진입점 컴포넌트
 * - 전체 레이아웃 (헤더, 푸터)을 설정하고 라우팅을 관리합니다.
 * - Flexbox를 사용하여 footer가 항상 하단에 위치하도록 레이아웃을 구성했습니다.
 */
function App() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="container mx-auto py-8 px-4 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 라우터 추가 */}
          <Route path="/club/:id" element={<ClubDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
