import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { DepartmentCombobox } from "@/components/common/DepartmentCombobox";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 회원가입 페이지 컴포넌트
 * - 이름, 전화번호, 학번, 학과, 비밀번호, 비밀번호 확인 입력 폼
 * - 필수 필드 유효성 검사 및 비밀번호 일치 확인
 */
export function Signup() {
  const navigate = useNavigate();

  // 폼 필드 상태
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 비밀번호 표시 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState<{
    name: boolean;
    phone: boolean;
    studentId: boolean;
    department: boolean;
    password: boolean;
    passwordConfirm: boolean;
    passwordMismatch: boolean;
  }>({
    name: false,
    phone: false,
    studentId: false,
    department: false,
    password: false,
    passwordConfirm: false,
    passwordMismatch: false,
  });

  // 폼 제출 핸들러
  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim(),
      studentId: !studentId.trim(),
      department: !selectedDepartment,
      password: !password.trim(),
      passwordConfirm: !passwordConfirm.trim(),
      passwordMismatch: password !== passwordConfirm,
    };

    setErrors(newErrors);

    // 에러가 있으면 제출 중단
    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      return;
    }

    // TODO: 실제 회원가입 API 호출
    console.log("회원가입 제출:", {
      name,
      phone,
      studentId,
      selectedDepartment,
      password,
    });

    // 성공 시 홈으로 이동 (임시)
    navigate("/");
  };

  // 필드별 onBlur 검증 핸들러
  const validateFieldOnBlur = (field: keyof typeof errors, value: string) => {
    if (value.trim() && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // 비밀번호 확인 필드 onBlur 핸들러
  const validatePasswordConfirmOnBlur = () => {
    if (passwordConfirm.trim()) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: false,
        passwordMismatch: password !== passwordConfirm,
      }));
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
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup className="gap-3">
            <Field>
              <FieldLabel htmlFor="studentId" className="gap-1">
                학번<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="studentId"
                placeholder="학번을 입력해주세요"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onBlur={() => validateFieldOnBlur("studentId", studentId)}
                className={cn(
                  errors.studentId &&
                    "border-destructive focus-visible:ring-destructive",
                )}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="gap-1">
                비밀번호<span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="8자 이상, 영문 대/소문자, 숫자, 특수문자 포함"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validateFieldOnBlur("password", password)}
                  className={cn(
                    "pr-10",
                    errors.password &&
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

            <Field>
              <FieldLabel htmlFor="passwordConfirm" className="gap-1">
                비밀번호 확인<span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  placeholder="비밀번호를 다시 입력해주세요"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  onBlur={validatePasswordConfirmOnBlur}
                  className={cn(
                    "pr-10",
                    (errors.passwordConfirm || errors.passwordMismatch) &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.passwordMismatch && passwordConfirm && (
                <p className="text-sm text-destructive mt-1">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </Field>

            <FieldSeparator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="name" className="gap-1">
                  이름<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validateFieldOnBlur("name", name)}
                  className={cn(
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" className="gap-1">
                  전화번호<span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => validateFieldOnBlur("phone", phone)}
                  className={cn(
                    errors.phone &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="department" className="gap-1">
                학과<span className="text-destructive">*</span>
              </FieldLabel>
              <DepartmentCombobox
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  if (value && errors.department) {
                    setErrors((prev) => ({
                      ...prev,
                      department: false,
                    }));
                  }
                }}
                hasError={errors.department}
              />
            </Field>

            <Button
              size="lg"
              className="w-full py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all mt-6"
              onClick={handleSubmit}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              회원가입
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
            </p>
          </FieldGroup>
        </CardContent>
      </Card>
    </>
  );
}
