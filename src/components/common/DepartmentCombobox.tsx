import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "@/data/departments";

interface DepartmentComboboxProps {
  /** 선택된 학과 값 */
  value: string;
  /** 학과 선택 시 호출되는 콜백 */
  onValueChange: (value: string) => void;
  /** 에러 상태 (유효성 검사 실패 시) */
  hasError?: boolean;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 검색 입력란 플레이스홀더 */
  searchPlaceholder?: string;
  /** 검색 결과 없음 텍스트 */
  emptyText?: string;
}

/**
 * 학과 선택 콤보박스 컴포넌트
 * - DEPARTMENTS 데이터를 기반으로 단과대학별 학과 목록을 표시
 * - 검색 기능 지원
 * - 회원가입, 동아리 지원서 등 여러 페이지에서 재사용 가능
 */
export function DepartmentCombobox({
  value,
  onValueChange,
  hasError = false,
  placeholder = "학과를 선택하세요",
  searchPlaceholder = "학과 검색...",
  emptyText = "검색 결과가 없습니다.",
}: DepartmentComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            hasError && "border-destructive focus-visible:ring-destructive",
          )}
        >
          <span className={cn(!value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {DEPARTMENTS.map((collegeGroup) => (
              <CommandGroup
                key={collegeGroup.college}
                heading={collegeGroup.college}
              >
                {collegeGroup.departments.map((dept) => (
                  <CommandItem key={dept} value={dept} onSelect={handleSelect}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === dept ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {dept}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
