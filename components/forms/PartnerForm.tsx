"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { trackInquirySubmit } from "@/lib/gtag";

type Locale = "bg" | "en" | "ru" | "ua";

interface PartnerFormCopy {
  name: string;
  namePh: string;
  phone: string;
  email: string;
  emailPh: string;
  profession: string;
  professionOptions: string[];
  volume: string;
  volumeOptions: string[];
  message: string;
  messagePh: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  errorText: string;
  required: string;
  reassurance: string;
  privacy: string;
}

interface PartnerFormProps {
  locale: Locale;
  copy: PartnerFormCopy;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function PartnerForm({ locale, copy }: PartnerFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const rawPhone = (form.get("phone") as string)?.trim() || "";
    const name = (form.get("name") as string)?.trim() || "";
    const email = (form.get("email") as string)?.trim() || "";
    const profession = (form.get("profession") as string)?.trim() || "";
    const volume = (form.get("volume") as string)?.trim() || "";
    const note = (form.get("message") as string)?.trim() || "";

    const newErrors: Record<string, string> = {};
    if (!name || name.length < 2) newErrors.name = copy.required;
    if (!rawPhone) newErrors.phone = copy.required;
    if (!profession) newErrors.profession = copy.required;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Compose a structured message for ops/Telegram
    const lines: string[] = [
      `[PARTNER PROGRAM]`,
      `Profession / роля: ${profession}`,
    ];
    if (volume) lines.push(`Volume / обем: ${volume}`);
    if (note) lines.push(`Note: ${note}`);
    const composed = lines.join("\n");

    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: `+359 ${rawPhone}`,
          email: email || undefined,
          message: composed,
          source: "partners",
          locale,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      trackInquirySubmit("partners");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10 px-4 sm:px-6">
        <CheckCircle2
          className="w-16 h-16 text-success mx-auto mb-4"
          aria-hidden="true"
        />
        <h3 className="text-xl font-bold text-foreground mb-2">
          {copy.successTitle}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {copy.successText}
        </p>
      </div>
    );
  }

  const baseInput =
    "w-full px-4 py-3 text-base sm:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[48px]";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="p-name"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.name} <span className="text-danger">*</span>
        </label>
        <input
          id="p-name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          placeholder={copy.namePh}
          className={`${baseInput} ${errors.name ? "border-danger" : "border-border"}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="p-phone"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.phone} <span className="text-danger">*</span>
        </label>
        <div
          className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden ${
            errors.phone ? "border-danger" : "border-border"
          }`}
        >
          <span
            aria-hidden="true"
            className="flex items-center px-3 bg-muted text-sm font-medium text-muted-foreground border-r border-border tabular-nums"
          >
            +359
          </span>
          <input
            id="p-phone"
            name="phone"
            type="tel"
            required
            maxLength={20}
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="88 123 4567"
            pattern="[0-9 ()\-]{7,}"
            onInput={(e) => {
              const el = e.currentTarget;
              const clean = el.value
                .replace(/^\+?359\s?/, "")
                .replace(/^0+/, "");
              if (clean !== el.value) el.value = clean;
            }}
            className="flex-1 min-w-0 px-4 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="p-email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.email}
        </label>
        <input
          id="p-email"
          name="email"
          type="email"
          maxLength={200}
          autoComplete="email"
          placeholder={copy.emailPh}
          className={`${baseInput} border-border`}
        />
      </div>

      {/* Profession */}
      <div>
        <label
          htmlFor="p-profession"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.profession} <span className="text-danger">*</span>
        </label>
        <div
          className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden ${
            errors.profession ? "border-danger" : "border-border"
          }`}
        >
          <span
            aria-hidden="true"
            className="flex items-center px-3 bg-muted border-r border-border"
          >
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </span>
          <select
            id="p-profession"
            name="profession"
            required
            defaultValue=""
            className="flex-1 min-w-0 px-3 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
          >
            <option value="" disabled>
              —
            </option>
            {copy.professionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        {errors.profession && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {errors.profession}
          </p>
        )}
      </div>

      {/* Volume */}
      <div>
        <label
          htmlFor="p-volume"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.volume}
        </label>
        <select
          id="p-volume"
          name="volume"
          defaultValue=""
          className={`${baseInput} border-border`}
        >
          <option value="">—</option>
          {copy.volumeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Note */}
      <div>
        <label
          htmlFor="p-message"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {copy.message}
        </label>
        <textarea
          id="p-message"
          name="message"
          rows={3}
          maxLength={1000}
          placeholder={copy.messagePh}
          className="w-full px-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <div
          className="flex items-center gap-2 bg-danger-light text-danger rounded-lg p-3 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {copy.errorText}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[48px] text-base sm:text-sm"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {copy.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {copy.submit}
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center font-medium">
        {copy.reassurance}
      </p>
      <p className="text-xs text-muted-foreground text-center">{copy.privacy}</p>
    </form>
  );
}
