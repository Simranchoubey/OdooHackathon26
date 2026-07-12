"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Organization Setup", icon: "corporate_fare", href: "/organization-setup" },
  { label: "Assets", icon: "inventory_2", href: "/assets" },
  { label: "Allocation & Transfer", icon: "swap_horiz", href: "/allocation" },
  { label: "Resource Booking", icon: "event_seat", href: "/booking" },
  { label: "Maintenance", icon: "build", href: "/maintenance" },
  { label: "Audit", icon: "fact_check", href: "/audit" },
  { label: "Reports", icon: "analytics", href: "/reports" },
  { label: "Notifications", icon: "notifications", href: "/activity" },
];

const footerNavItems: NavItem[] = [
  { label: "Settings", icon: "settings", href: "#" },
  { label: "Logout", icon: "logout", href: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-low border-r border-border-subtle py-standard z-40 transition-all duration-300">
        {/* Brand */}
        <div className="px-container mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm text-[15px]">
            A
          </div>
          <div className="min-w-0">
            <div className="text-headline-md font-bold text-primary leading-tight">AssetFlow</div>
            <div className="text-[11px] text-text-secondary leading-tight truncate">
              Enterprise Resource Management
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg mx-2 transition-all duration-150 ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-text-secondary hover:bg-surface-container-high hover:text-text-primary"
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0"
                />
                <span className={`text-label-md ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Nav */}
        <div className="px-2 mt-auto space-y-0.5 border-t border-border-subtle pt-3">
          {footerNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:bg-surface-container-high hover:text-text-primary rounded-lg mx-2 transition-all duration-150"
            >
              <Icon name={item.icon} size={18} className="shrink-0" />
              <span className="text-label-md font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden flex justify-between items-center h-16 px-container w-full bg-surface-container-lowest border-b border-border-subtle sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
            A
          </div>
          <span className="text-headline-sm font-bold text-primary">AssetFlow</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Notifications"
            className="text-text-secondary hover:bg-surface-container-low hover:text-text-primary transition-colors p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="notifications" size={20} />
          </button>
          <button
            aria-label="Open menu"
            className="text-text-secondary hover:bg-surface-container-low hover:text-text-primary transition-colors p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </header>
    </>
  );
}
