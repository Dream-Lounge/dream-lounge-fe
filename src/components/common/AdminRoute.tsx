import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * 관리자 페이지의 비로그인 및 비관리자 접근을 차단합니다.
 */
export function AdminRoute() {
  const { isAuthenticated, isLoading, isClubAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isClubAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}

