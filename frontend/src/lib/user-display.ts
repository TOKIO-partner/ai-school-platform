import type { User } from "@/types";

/** Display name in Japanese order (姓 名), falling back to username. */
export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "ゲスト";
  const full = `${user.last_name ?? ""} ${user.first_name ?? ""}`.trim();
  return full || user.username || "ゲスト";
}

/** Up to two-character avatar initials derived from the user's name. */
export function getInitials(user: User | null | undefined): string {
  if (!user) return "AS";
  const last = (user.last_name ?? "").trim();
  const first = (user.first_name ?? "").trim();
  if (last || first) {
    return `${last.charAt(0)}${first.charAt(0)}`.trim() || last.charAt(0) || first.charAt(0);
  }
  return (user.username?.slice(0, 2) || "AS").toUpperCase();
}

const ROLE_LABELS: Record<User["role"], string> = {
  admin: "管理者",
  corp_admin: "法人管理者",
  instructor: "講師",
  student: "受講者",
};

export function getRoleLabel(user: User | null | undefined): string {
  if (!user) return "";
  return ROLE_LABELS[user.role] ?? "";
}

const PLAN_LABELS: Record<User["plan"], string> = {
  free: "Free Plan",
  pro: "Pro Plan",
  business: "Business Plan",
};

export function getPlanLabel(user: User | null | undefined): string {
  if (!user) return "";
  return PLAN_LABELS[user.plan] ?? "";
}
