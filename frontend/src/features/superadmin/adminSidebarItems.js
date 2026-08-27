import { LayoutDashboard, Building2, CreditCard, MessageCircle, BarChart3, Settings, ListTree } from "lucide-react";

export const adminSidebarItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/venues", label: "Venues", icon: Building2 },
  { path: "/admin/plans", label: "Plans", icon: ListTree },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
  { path: "/admin/whatsapp", label: "WhatsApp Center", icon: MessageCircle },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/admin/settings", label: "Settings", icon: Settings }
];