const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface User {
  student_id: number;
  name: string;
  department: string | null;
  phone: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface ApiError {
  detail: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/members/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data: LoginResponse = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const accessToken = this.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 && accessToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getAccessToken()}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: "요청 처리 중 오류가 발생했습니다",
      }));
      throw new Error(error.detail);
    }

    return response.json();
  }

  async login(studentId: number, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/members/login", {
      method: "POST",
      body: JSON.stringify({ student_id: studentId, password }),
    });

    this.setTokens(response.access_token, response.refresh_token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  logout(): void {
    this.clearTokens();
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/members/me");
  }
}

export const api = new ApiClient(API_BASE_URL);
