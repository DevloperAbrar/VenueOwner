import {
  LayoutDashboard, Globe, CalendarClock, MessageSquare, CalendarCheck,
  Users, Receipt, BarChart3, Settings, Store, Star
} from "lucide-react";

export const ownerSidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/website", label: "Website Builder", icon: Globe },
  { path: "/dashboard/marketplace-profile", label: "Marketplace Profile", icon: Store },
  { path: "/dashboard/reviews", label: "Reviews", icon: Star },
  { path: "/dashboard/slots", label: "Slots", icon: CalendarClock },
  { path: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { path: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { path: "/dashboard/clients", label: "Clients", icon: Users },
  { path: "/dashboard/billing/invoice", label: "Billing", icon: Receipt },
  { path: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/dashboard/settings", label: "Settings", icon: Settings }
];