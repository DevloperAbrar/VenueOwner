import React from "react";
import { ShieldCheck, BadgeCheck, Crown } from "lucide-react";

export default function Badge({ type }) {
  const map = {
    verified_business: { icon: ShieldCheck, label: "Verified Business", cls: "bg-green-50 text-green-700" },
    documents_verified: { icon: BadgeCheck, label: "Documents Verified", cls: "bg-blue-50 text-blue-700" },
    premium_partner: { icon: Crown, label: "Premium Partner", cls: "bg-amber-50 text-amber-700" }
  };
  const cfg = map[type];
  if (!cfg) return null;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.cls}`}>
      <Icon size={12} /> {cfg.label}
    </span>
  );
}