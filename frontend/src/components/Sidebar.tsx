import { NavLink } from "react-router-dom";

import { IconGrid, IconUsers, IconFlame } from "./Icons";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigate?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Overview",
    icon: IconGrid,
    end: true,
  },
  {
    to: "/sessions",
    label: "Sessions",
    icon: IconUsers,
  },
  {
    to: "/heatmap",
    label: "Heatmap",
    icon: IconFlame,
  },
];

export default function Sidebar({ open, collapsed, setCollapsed, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`shrink-0 fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar transition-all duration-300 lg:static lg:translate-x-0 ${
        collapsed ? "w-20" : "w-60"
      } ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-6">
        {!collapsed && (
          <p className="font-display text-base font-semibold text-sidebar-textActive">
            TrackLens
          </p>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-sidebar-textActive"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : "gap-3"
              } ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive"
              }`
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-text">Analytics Dashboard</p>
        )}
      </div>
    </aside>
  );
}
