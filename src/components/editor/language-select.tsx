"use client";

import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LanguageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export function LanguageSelect({
  value,
  onValueChange,
  label = "Language"
}: LanguageSelectProps) {
  return (
    <label className="flex min-w-[150px] items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="sr-only">{label}</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger aria-label={label} className="h-8">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
