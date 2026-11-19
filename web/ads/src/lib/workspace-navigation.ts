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
  History,
  Trophy,
} from "lucide-react";
export type WorkspaceRole = "advertiser" | "promoter" | "admin";
export function workspaceNavigation(
  role: WorkspaceRole,
  grants?: string[],
): NavGroup[] {
  // Advertiser Nav Groups
  const advertiserNavGroups: NavGroup[] = [
    {
      title: "Ads Console",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: BarChart3,
          href: "/dashboard",
        },
        {
          id: "campaigns",
          label: "My Ad Campaigns",
          icon: Layers,
          href: "/campaigns",
        },
        {
          id: "advertiser_rewards",
          label: "Advertiser Rewards",
          icon: Trophy,
          href: "/advertiser/rewards",
        },
      ],
    },
    {
      title: "Performance & Traffic",
      items: [
        { id: "reports", label: "Reports", icon: BarChart3, href: "/reports" },
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
      title: "Promoter Hub",
      items: [
        {
          id: "promoter_dashboard",
          label: "Dashboard",
          icon: BarChart3,
          href: "/promoter",
        },
      ],
    },
    {
      title: "CrimFig Ad Network",
      items: [
        {
          id: "ad_network_dashboard",
          label: "Dashboard",
          icon: Globe,
          href: "/promoter/ad-network",
        },
        {
          id: "ad_network_get_started",
          label: "Get Started",
          icon: Sparkles,
          children: [
            {
              id: "ad_network_overview_guide",
              label: "Setup Guide",
              icon: Sparkles,
              href: "/promoter/ad-network/get-started",
            },
            {
              id: "websites",
              label: "On Website",
              icon: Globe,
              href: "/promoter/websites",
            },
            {
              id: "mobile_apps",
              label: "On Mobile App",
              icon: Smartphone,
              href: "/promoter/mobile-apps",
            },
            {
              id: "individuals",
              label: "Affiliate Link",
              icon: Share2,
              href: "/promoter/individuals",
            },
          ],
        },
        {
          id: "promoter_reports",
          label: "Reports",
          icon: BarChart3,
          href: "/reports?workspace=promoter",
        },
      ],
    },
    {
      title: "AdStation",
      items: [
        {
          id: "adstation",
          label: "Dashboard",
          icon: Share2,
          href: "/promoter/adstation",
        },
        {
          id: "adstation_setup",
          label: "Setup a Direct Ad Slot",
          icon: Plus,
          href: "/promoter/adstation/setup",
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
        {
          id: "promoter_cfig",
          label: "Virtual $cfig",
          icon: Sparkles,
          href: "/promoter/rewards",
        },
      ],
    },
  ];

  // Admin Nav Groups
  const adminNavGroups: NavGroup[] = [
    {title:"Promotional rewards",items:[{roles:["super_admin","ads_finance"],id:"admin_cfig",label:"House Ad rewards",icon:Sparkles,href:"/admin/rewards/cfig",children:[{id:"cfig_policies",label:"Policies",icon:Settings,href:"/admin/rewards/cfig/policies"},{id:"cfig_reserve",label:"Funding status",icon:ShieldCheck,href:"/admin/rewards/cfig/reserve"}]}]},
    {
      title: "Advertising Operations",
      items: [
        {
          roles: ["super_admin", "ads_admin", "ads_reviewer", "ads_manager", "ads_support"],
          id: "moderation",
          label: "Ad Review Queue",
          icon: ShieldCheck,
          href: "/admin/moderation",
        },
        {
          roles: ["super_admin", "ads_admin", "ads_reviewer", "ads_manager", "ads_support"],
          id: "admin_campaign_readiness",
          label: "Campaign Readiness",
          icon: ShieldCheck,
          href: "/admin/campaigns/readiness",
        },
        {
          roles: ["super_admin", "ads_admin", "ads_reviewer"],
          id: "admin_website_approvals",
          label: "Website Approvals",
          icon: Globe,
          href: "/admin/websites/review",
        },
        {
          roles: ["super_admin", "ads_admin", "ads_reviewer"],
          id: "admin_auction_logs",
          label: "Auction Logs",
          icon: History,
          href: "/admin/auction-logs",
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
            { id: "click_audit", label: "Click Audit", icon: History, href: "/admin/click-audit" },
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
              "/reports",
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
    .filter((item) => {
      const href = item.href?.split("?")[0];
      return href && (path === href || path.startsWith(href + "/"));
    })
    .sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0))[0];
  if (role === "promoter" && path === "/promoter/slots")
    return [role, "websites"];
  return [
    role,
    selected?.id ||
      (role === "admin"
        ? "admin_overview"
        : role === "promoter"
          ? "promoter_dashboard"
          : "dashboard"),
  ];
}
