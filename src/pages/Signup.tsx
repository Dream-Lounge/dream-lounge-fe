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
import { validators, ERROR_MESSAGES } from "@/lib/validators";

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validators.name(name),
      phone: validators.phone(phone),
      studentId: validators.studentId(studentId),
      department: validators.department(selectedDepartment),
      password: validators.password(password),
      passwordConfirm: validators.passwordConfirm(passwordConfirm),
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

    // 성공 시 로그인 페이지로 이동
    navigate("/login");
  };

  // 실시간 검증 핸들러
  const handleFieldChange = (
    field: "name" | "phone" | "studentId" | "password",
    value: string,
    setter: (value: string) => void,
  ) => {
    setter(value);
    if (errors[field]) {
      const hasError = validators[field](value);
      if (!hasError) {
        setErrors((prev) => ({ ...prev, [field]: false }));
      }
    }
  };

  // 비밀번호 확인 실시간 검증
  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    if (errors.passwordConfirm || errors.passwordMismatch) {
      if (value.trim()) {
        setErrors((prev) => ({
          ...prev,
          passwordConfirm: false,
          passwordMismatch: password !== value,
        }));
      }
    }
  };

  const handleBlur = (
    field: "name" | "phone" | "studentId" | "password",
    value: string,
  ) => {
    const hasError = validators[field](value);
    setErrors((prev) => ({ ...prev, [field]: hasError }));
  };

  const handlePasswordConfirmBlur = () => {
    setErrors((prev) => ({
      ...prev,
      passwordConfirm: validators.passwordConfirm(passwordConfirm),
      passwordMismatch: passwordConfirm.trim() ? password !== passwordConfirm : false,
    }));
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
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
            <Field>
              <FieldLabel htmlFor="studentId">
                학번
              </FieldLabel>
              <Input
                id="studentId"
                placeholder="학번을 입력해주세요"
                value={studentId}
                onChange={(e) =>
                  handleFieldChange("studentId", e.target.value, setStudentId)
                }
                onBlur={(e) => handleBlur("studentId", e.target.value)}
                className={cn(
                  errors.studentId &&
                  "border-destructive focus-visible:ring-destructive",
                )}
                required
              />
              {errors.studentId && studentId && (
                <p className="text-sm text-destructive mt-1">
                  {ERROR_MESSAGES.STUDENT_ID}
                </p>
              )}
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
                  placeholder="8자 이상, 영문 대/소문자, 숫자, 특수문자 포함"
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value, setPassword)
                  }
                  onBlur={(e) => handleBlur("password", e.target.value)}
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
              {errors.password && password && (
                <p className="text-sm text-destructive mt-1">
                  {ERROR_MESSAGES.PASSWORD}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="passwordConfirm">
                비밀번호 확인
              </FieldLabel>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  placeholder="비밀번호를 다시 입력해주세요"
                  onChange={(e) => handlePasswordConfirmChange(e.target.value)}
                  onBlur={handlePasswordConfirmBlur}
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
                <FieldLabel htmlFor="name">
                  이름
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChange={(e) =>
                    handleFieldChange("name", e.target.value, setName)
                  }
                  onBlur={(e) => handleBlur("name", e.target.value)}
                  className={cn(
                    errors.name &&
                    "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">
                  전화번호
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="전화번호를 입력해주세요"
                  value={phone}
                  onChange={(e) =>
                    handleFieldChange("phone", e.target.value, setPhone)
                  }
                  onBlur={(e) => handleBlur("phone", e.target.value)}
                  className={cn(
                    errors.phone &&
                    "border-destructive focus-visible:ring-destructive",
                  )}
                  required
                />
                {errors.phone && phone && (
                  <p className="text-sm text-destructive mt-1">
                    {ERROR_MESSAGES.PHONE}
                  </p>
                )}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="department">
                학과
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
              type="submit"
              size="lg"
              className="w-full py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all mt-6"
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
          </form>
        </CardContent>
      </Card>
    </>
  );
}
