import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Boxes,
  ArrowLeftRight,
  Armchair,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  Plus,
  PlusCircle,
  Search,
  Download,
  Filter,
  FilterX,
  Calendar,
  Pencil,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
  Send,
  Headset,
  TrendingUp,
  Users,
  Laptop,
  Monitor,
  Router as RouterIcon,
  Printer,
  Camera,
  Car,
  DoorOpen,
  Columns3,
  RefreshCw,
  ArrowDown,
  Inbox,
  type LucideProps,
} from 'lucide-react';

/**
 * Central icon registry.
 *
 * The rest of the app was built against Material Symbols string names
 * (e.g. icon="add", icon="dashboard"). Rather than touching every call
 * site, this component maps those exact names to bundled Lucide SVGs.
 * This removes the runtime dependency on a remote icon font (which is
 * what was silently failing and rendering raw text like "search" /
 * "add" instead of glyphs) — icons are now inlined in the JS bundle
 * and always render, online or offline.
 */
const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  // Sidebar / nav
  dashboard: LayoutDashboard,
  corporate_fare: Building2,
  inventory_2: Boxes,
  swap_horiz: ArrowLeftRight,
  event_seat: Armchair,
  build: Wrench,
  fact_check: ClipboardCheck,
  analytics: BarChart3,
  notifications: Bell,
  settings: Settings,
  logout: LogOut,
  menu: Menu,

  // Actions
  add: Plus,
  add_circle: PlusCircle,
  search: Search,
  download: Download,
  filter_list: Filter,
  filter_list_off: FilterX,
  calendar_today: Calendar,
  edit: Pencil,
  more_vert: MoreVertical,
  expand_more: ChevronDown,
  arrow_drop_down: ChevronDown,
  arrow_downward: ArrowDown,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  chevrons_down: ChevronsDown,
  send: Send,
  support_agent: Headset,
  refresh: RefreshCw,
  event: Calendar,

  // Status
  check_circle: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
  progress_activity: Loader2,
  assignment_late: AlertCircle,

  // Data / misc
  trending_up: TrendingUp,
  groups: Users,
  engineering: Users,
  view_column: Columns3,

  // Asset type glyphs (dashboard activity feed, assets table, reports)
  laptop_mac: Laptop,
  computer: Monitor,
  videocam: Camera,
  chair: Armchair,
  router: RouterIcon,
  print: Printer,
  photo_camera: Camera,
  directions_car: Car,
  meeting_room: DoorOpen,
  inbox: Inbox,
};

export interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  filled?: boolean;
}

/**
 * Usage: <Icon name="add" size={18} />
 * Falls back to a neutral dot if a name isn't registered, so a typo
 * never breaks the page — it just shows a harmless placeholder.
 */
export function Icon({ name, filled, strokeWidth, size = 20, className = '', ...props }: IconProps) {
  const Cmp = iconMap[name];
  if (!Cmp) {
    // Unknown icon name — render nothing rather than crash the page.
    return null;
  }
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth ?? (filled ? 2.25 : 2)}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      {...props}
    />
  );
}
