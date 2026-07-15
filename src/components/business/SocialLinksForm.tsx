"use client";

import { Input } from "@/components/ui/Input";
import type { MemberSocialLinks } from "@/lib/business/types";

const FIELDS: { key: keyof MemberSocialLinks; label: string; placeholder?: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "@handle" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "website", label: "Website", placeholder: "https://…" },
];

// Shared social-links editor for the owner Team drawer and My Profile.
export function SocialLinksForm({ value, onChange }: { value: MemberSocialLinks; onChange: (next: MemberSocialLinks) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {FIELDS.map(({ key, label, placeholder }) => (
        <Input
          key={key}
          label={label}
          placeholder={placeholder}
          value={value[key] || ""}
          onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        />
      ))}
    </div>
  );
}
