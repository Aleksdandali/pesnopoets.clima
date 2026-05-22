"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../layout";
import { Loader2, CheckCircle2, XCircle, UserMinus, UserCheck, Shield } from "lucide-react";

interface Member {
  id: number;
  telegram_user_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  position: string | null;
  role: "owner" | "manager" | "operator";
  status: "pending" | "approved" | "rejected";
  is_active: boolean;
  requested_at: string | null;
  decided_at: string | null;
}

type Action = "approve" | "reject" | "deactivate" | "reactivate" | "set_role";

export default function TeamPage() {
  const { fetchApi } = useAdmin();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetchApi("/api/admin/team");
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || `Ошибка ${res.status}`);
      } else {
        setMembers(data.members ?? []);
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runAction(
    telegram_user_id: number,
    action: Action,
    role?: "owner" | "manager" | "operator",
  ) {
    setBusy(telegram_user_id);
    try {
      const res = await fetchApi("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_user_id, action, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || `Ошибка ${res.status}`);
      } else {
        await load();
      }
    } finally {
      setBusy(null);
    }
  }

  const pending = members.filter((m) => m.status === "pending");
  const approved = members.filter((m) => m.status === "approved");
  const rejected = members.filter((m) => m.status === "rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Сотрудники</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Доступ к боту и /tg Mini App. Новые заявки приходят сюда после /start в боте.
        </p>
      </header>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-[var(--danger)]/10 text-[var(--danger)] text-sm border border-[var(--danger)]/30">
          {error}
        </div>
      )}

      {pending.length > 0 && (
        <Section title={`Ожидают подтверждения (${pending.length})`} accent="warning">
          {pending.map((m) => (
            <PendingCard
              key={m.id}
              m={m}
              busy={busy === m.telegram_user_id}
              onApprove={() => runAction(m.telegram_user_id, "approve")}
              onReject={() => runAction(m.telegram_user_id, "reject")}
            />
          ))}
        </Section>
      )}

      <Section title={`Активные (${approved.filter((m) => m.is_active).length})`}>
        {approved.length === 0 ? (
          <EmptyMsg>Нет активных сотрудников.</EmptyMsg>
        ) : (
          approved.map((m) => (
            <MemberCard
              key={m.id}
              m={m}
              busy={busy === m.telegram_user_id}
              onDeactivate={() => runAction(m.telegram_user_id, "deactivate")}
              onReactivate={() => runAction(m.telegram_user_id, "reactivate")}
              onSetRole={(role) => runAction(m.telegram_user_id, "set_role", role)}
            />
          ))
        )}
      </Section>

      {rejected.length > 0 && (
        <Section title={`Отклонённые (${rejected.length})`}>
          {rejected.map((m) => (
            <MemberCard
              key={m.id}
              m={m}
              busy={busy === m.telegram_user_id}
              onReactivate={() => runAction(m.telegram_user_id, "reactivate")}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent?: "warning";
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
          accent === "warning" ? "text-amber-600" : "text-[var(--muted-foreground)]"
        }`}
      >
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function EmptyMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-[var(--muted-foreground)] py-4 text-center bg-[var(--muted)] rounded-lg border border-[var(--border)]">
      {children}
    </div>
  );
}

function PendingCard({
  m,
  busy,
  onApprove,
  onReject,
}: {
  m: Member;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-[var(--background)] border border-amber-300/40 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[var(--foreground)]">
            {[m.first_name, m.last_name].filter(Boolean).join(" ") || m.name || "—"}
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {m.position || "должность не указана"}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            {m.telegram_username ? `@${m.telegram_username}` : `id ${m.telegram_user_id}`}
            {" · "}
            {m.requested_at && new Date(m.requested_at).toLocaleString("ru-RU")}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onApprove}
            disabled={busy}
            className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Принять
          </button>
          <button
            onClick={onReject}
            disabled={busy}
            className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--border)] disabled:opacity-50 flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberCard({
  m,
  busy,
  onDeactivate,
  onReactivate,
  onSetRole,
}: {
  m: Member;
  busy: boolean;
  onDeactivate?: () => void;
  onReactivate?: () => void;
  onSetRole?: (role: "owner" | "manager" | "operator") => void;
}) {
  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[var(--foreground)]">
            {[m.first_name, m.last_name].filter(Boolean).join(" ") || m.name || "—"}
            {!m.is_active && (
              <span className="ml-2 text-xs text-[var(--muted-foreground)]">(неактивен)</span>
            )}
          </p>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {m.position || "—"}
            <span className="mx-1.5">·</span>
            <RoleBadge role={m.role} />
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            {m.telegram_username ? `@${m.telegram_username}` : `id ${m.telegram_user_id}`}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {onSetRole && (
            <select
              value={m.role}
              onChange={(e) =>
                onSetRole(e.target.value as "owner" | "manager" | "operator")
              }
              disabled={busy}
              className="text-xs px-2 py-1 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            >
              <option value="owner">owner</option>
              <option value="manager">manager</option>
              <option value="operator">operator</option>
            </select>
          )}
          {m.is_active && onDeactivate && (
            <button
              onClick={onDeactivate}
              disabled={busy}
              className="px-2.5 py-1 rounded text-xs text-[var(--muted-foreground)] hover:text-[var(--danger)] disabled:opacity-50 flex items-center gap-1"
            >
              <UserMinus className="w-3.5 h-3.5" />
              Деактивировать
            </button>
          )}
          {!m.is_active && onReactivate && (
            <button
              onClick={onReactivate}
              disabled={busy}
              className="px-2.5 py-1 rounded text-xs text-[var(--primary)] hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Активировать
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isOwner = role === "owner";
  const isManager = role === "manager";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide ${
        isOwner
          ? "text-amber-600"
          : isManager
          ? "text-[var(--primary)]"
          : "text-[var(--muted-foreground)]"
      }`}
    >
      {isOwner && <Shield className="w-3 h-3" />}
      {role}
    </span>
  );
}
