import { useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { AuthContext } from "./auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (studentId: number, password: string) => {
    const response = await api.login(studentId, password);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
