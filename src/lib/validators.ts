export const REGEX = {
  STUDENT_ID: /^\d{10}$/,
  PHONE: /^\d{10,11}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const ERROR_MESSAGES = {
  STUDENT_ID: "학번은 10자리 숫자로 입력해주세요.",
  PHONE: "전화번호는 하이픈 없이 10~11자리 숫자로 입력해주세요.",
  PASSWORD: "8자 이상, 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.",
  NAME: "이름을 입력해주세요.",
  DEPARTMENT: "학과를 선택해주세요.",
  PASSWORD_CONFIRM: "비밀번호 확인을 입력해주세요.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
};

export const validators = {
  studentId: (value: string) => !REGEX.STUDENT_ID.test(value),
  phone: (value: string) => !REGEX.PHONE.test(value),
  password: (value: string) => !REGEX.PASSWORD.test(value),
  name: (value: string) => !value.trim(),
  department: (value: string) => !value,
  passwordConfirm: (value: string) => !value.trim(),
};
