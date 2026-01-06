export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined. Set it in Vercel env vars.");
}

// URL 합치기 유틸 (슬래시 중복 방지)
export function apiUrl(path: string) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}


export interface User {
  studentId: number;
  name: string;
  department: string | null;
  phone: string | null;
}

interface ApiUser {
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

interface ApiLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: ApiUser;
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

export interface SignupRequest {
  studentId: string;
  name: string;
  department: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

export interface SignupResponse {
  studentId: number;
  name: string;
  department: string | null;
  phone: string | null;
  registered_at: string;
}

interface ApiSignupResponse {
  student_id: number;
  name: string;
  department: string | null;
  phone: string | null;
  registered_at: string;
}

function mapUser(apiUser: ApiUser): User {
  return {
    studentId: apiUser.student_id,
    name: apiUser.name,
    department: apiUser.department,
    phone: apiUser.phone,
  };
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

      const data: ApiLoginResponse = await response.json();
      const user = mapUser(data.user);
      
      this.setTokens(data.access_token, data.refresh_token);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Access token refresh failed:", error);
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
      
      const errorMessage = Array.isArray(error.detail)
        ? error.detail.map((e) => e.msg).join(", ")
        : error.detail;
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async login(studentId: number, password: string): Promise<LoginResponse> {
    const response = await this.request<ApiLoginResponse>("/members/login", {
      method: "POST",
      body: JSON.stringify({ student_id: studentId, password }),
    });

    const user = mapUser(response.user);

    this.setTokens(response.access_token, response.refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return {
      ...response,
      user,
    };
  }

  logout(): void {
    this.clearTokens();
  }

  async getCurrentUser(): Promise<User> {
    const apiUser = await this.request<ApiUser>("/members/me");
    return mapUser(apiUser);
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    const requestBody = {
      student_id: parseInt(data.studentId, 10),
      name: data.name,
      department: data.department,
      phone: data.phone,
      password: data.password,
      password_confirm: data.passwordConfirm,
    };

    const response = await this.request<ApiSignupResponse>("/members/signup", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    return {
      ...response,
      studentId: response.student_id,
    };
  }
}

export const api = new ApiClient(API_BASE_URL);
