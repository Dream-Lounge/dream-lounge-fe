import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 로그인 페이지 컴포넌트
 * - 학번, 비밀번호 입력 폼
 * - 필수 필드 유효성 검사 및 로그인 실패 에러 메시지
 */
export function Login() {
  const navigate = useNavigate();

  // 폼 필드 상태
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  // 비밀번호 표시 상태
  const [showPassword, setShowPassword] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState<{
    studentId: boolean;
    password: boolean;
  }>({
    studentId: false,
    password: false,
  });

  // 로그인 실패 에러 상태
  const [loginError, setLoginError] = useState(false);

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const newErrors = {
      studentId: !studentId.trim(),
      password: !password.trim(),
    };

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      return;
    }

    // TODO: 실제 로그인 API 호출
    // 현재는 테스트를 위해 로그인 실패 에러를 표시
    // 실제 API 연동 시 서버 응답에 따라 loginError 상태 제어
    console.log("로그인 시도:", {
      studentId,
      password,
    });

    // 임시: 로그인 실패 에러 표시 (API 연동 시 제거)
    setLoginError(true);

    // 성공 시 홈으로 이동 (API 연동 후 활성화)
    // navigate("/");
  };

  // 필드별 onBlur 검증 핸들러
  const validateFieldOnBlur = (field: keyof typeof errors, value: string) => {
    if (value.trim() && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // 입력 필드 변경 시 로그인 에러 초기화
  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    if (loginError) {
      setLoginError(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (loginError) {
      setLoginError(false);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <Link to="/">
          <img src="/logo.svg" alt="Dream Lounge" className="h-20" />
        </Link>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel htmlFor="studentId">
                학번
              </FieldLabel>
              <Input
                id="studentId"
                placeholder="학번을 입력해주세요"
                value={studentId}
                onChange={(e) => handleStudentIdChange(e.target.value)}
                onBlur={() => validateFieldOnBlur("studentId", studentId)}
                className={cn(
                  (errors.studentId || loginError) &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">
                비밀번호
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="비밀번호를 입력해주세요"
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => validateFieldOnBlur("password", password)}
                  className={cn(
                    "pr-10",
                    (errors.password || loginError) &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </Field>

            {loginError && (
              <p className="text-sm text-destructive text-center">
                학번 또는 비밀번호가 일치하지 않습니다
              </p>
            )}

            <Button
              size="lg"
              className="w-full py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all mt-6"
              onClick={handleSubmit}
            >
              <LogIn className="h-5 w-5 mr-2" />
              로그인
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/signup")}
              >
                회원가입
              </Button>
            </p>
          </FieldGroup>
        </CardContent>
      </Card>
    </>
  );
}
