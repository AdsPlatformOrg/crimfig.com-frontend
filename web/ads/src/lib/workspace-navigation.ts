import type { NavGroup } from "../components/DashboardSidebar";
import {
  BarChart3,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  DollarSign,
  Menu,
  Sparkles,
  Globe,
  Share2,
  Smartphone,
  CreditCard,
  Bell,
  HelpCircle,
  Plus,
  Layers,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
export type WorkspaceRole = "advertiser" | "promoter" | "admin";
export function workspaceNavigation(
  role: WorkspaceRole,
  grants?: string[],
): NavGroup[] {
  // Advertiser Nav Groups
  const advertiserNavGroups: NavGroup[] = [
    {
      title: "Campaign Management",
      items: [
        {
          id: "overview_dash",
          label: "Overview Dashboard",
          icon: BarChart3,
          href: "/dashboard",
        },
        {
          id: "campaigns",
          label: "Active Campaigns",
          icon: Layers,
          href: "/campaigns",
        },
        {
          id: "new_campaign",
          label: "Create Campaign",
          icon: Plus,
          href: "/campaigns/new",
        },
      ],
    },
    {
      title: "Performance & Traffic",
      items: [
        {
          id: "conversions",
          label: "Conversion Tracking",
          icon: Sparkles,
          href: "/conversions",
        },
        {
          id: "disputes",
          label: "Invalid Traffic Audits",
          icon: ShieldCheck,
          href: "/disputes",
        },
      ],
    },
    {
      title: "Finance & Account",
      items: [
        {
          id: "billing_escrow",
          label: "Billing & Escrow",
          icon: CreditCard,
          href: "/billing",
        },
        { id: "profile", label: "User Profile", icon: User, href: "/profile" },
        {
          id: "settings",
          label: "Settings",
          icon: Settings,
          href: "/settings",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: Bell,
          href: "/notifications",
        },
        {
          id: "support",
          label: "Help & Support",
          icon: HelpCircle,
          href: "/support",
        },
      ],
    },
  ];

  // Promoter Nav Groups
  const promoterNavGroups: NavGroup[] = [
    {
      title: "Websites & Delivery",
      items: [
        {
          id: "websites",
          label: "Websites",
          icon: Globe,
          href: "/promoter/websites",
        },
        {
          id: "slots",
          label: "CrimFig Ads Slots",
          icon: Layers,
          href: "/promoter/slots",
        },
      ],
    },
    {
      title: "Direct Advertising",
      items: [
        {
          id: "adstation",
          label: "AdStation Direct Ads",
          icon: Share2,
          href: "/promoter/adstation",
        },
      ],
    },
    {
      title: "Distribution Channels",
      items: [
        {
          id: "individuals",
          label: "Links & Reels Social",
          icon: Share2,
          href: "/promoter/individuals",
        },
        {
          id: "mobile_apps",
          label: "Mobile Apps SDK",
          icon: Smartphone,
          href: "/promoter/mobile-apps",
        },
      ],
    },
    {
      title: "Discovery & Quality",
      items: [
        {
          id: "marketplace",
          label: "Ad Marketplace",
          icon: Share2,
          href: "/promoter/marketplace",
        },
        {
          id: "quality",
          label: "Quality & Trust Score",
          icon: ShieldCheck,
          href: "/promoter/quality",
        },
      ],
    },
  ];

  // Admin Nav Groups
  const adminNavGroups: NavGroup[] = [
    {
      title: "Advertising Operations",
      items: [
        {
          roles: ["super_admin", "ads_admin", "ads_reviewer"],
          id: "moderation",
          label: "Creative Review Queue",
          icon: ShieldCheck,
          href: "/admin/moderation",
        },
        {
          roles: ["super_admin", "ads_admin"],
          id: "house",
          label: "House Ads",
          icon: Sparkles,
          children: [
            {
              id: "house_ads",
              label: "Creatives",
              icon: Layers,
              href: "/admin/house-ads",
            },
            {
              id: "house_performance",
              label: "Performance",
              icon: BarChart3,
              href: "/admin/house-ads/performance",
            },
          ],
        },
        {
          roles: ["super_admin", "ads_admin"],
          id: "delivery_reports",
          label: "Delivery Performance",
          icon: BarChart3,
          children: [
            {
              id: "admin_websites",
              label: "Websites & Promoters",
              icon: Globe,
              href: "/admin/websites",
            },
            {
              id: "admin_slots",
              label: "Ad Slots",
              icon: Layers,
              href: "/admin/ad-slots",
            },
          ],
        },
        {
          roles: ["super_admin", "ads_admin", "ads_finance"],
          id: "admin_disputes",
          label: "Traffic Adjustments",
          icon: ShieldAlert,
          href: "/admin/disputes",
        },
      ],
    },
    {
      title: "System & Health",
      items: [
        {
          roles: ["super_admin", "ads_admin"],
          id: "admin_tests",
          label: "API Test Suite",
          icon: Sparkles,
          href: "/admin/tests",
        },
      ],
    },
  ];

  const groups =
    role === "admin"
      ? adminNavGroups
      : role === "promoter"
        ? promoterNavGroups
        : advertiserNavGroups;
  return grants === undefined
    ? groups
    : groups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              !item.roles || item.roles.some((role) => grants.includes(role)),
          ),
        }))
        .filter((group) => group.items.length > 0);
}
export function resolveWorkspaceContext(
  pathname: string,
  utilityRole: WorkspaceRole = "advertiser",
): [WorkspaceRole, string] {
  const path = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  const role: WorkspaceRole =
    path === "/admin" || path.startsWith("/admin/")
      ? "admin"
      : path === "/promoter" || path.startsWith("/promoter/")
        ? "promoter"
        : [
              "/profile",
              "/settings",
              "/notifications",
              "/support",
              "/billing",
            ].includes(path)
          ? utilityRole
          : "advertiser";
  const leaves = workspaceNavigation(role).flatMap((group) =>
    group.items.flatMap((item) => item.children || [item]),
  );
  if (role === "admin" && /^\/admin\/house-ads\/.*performance$/.test(path))
    return [role, "house_performance"];
  if (role === "admin" && path.startsWith("/admin/promoters/"))
    return [role, "admin_websites"];
  const selected = leaves
    .filter(
      (item) =>
        item.href && (path === item.href || path.startsWith(item.href + "/")),
    )
    .sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0))[0];
  return [
    role,
    selected?.id ||
      (role === "admin"
        ? "admin_overview"
        : role === "promoter"
          ? "websites"
          : "overview_dash"),
  ];
}
