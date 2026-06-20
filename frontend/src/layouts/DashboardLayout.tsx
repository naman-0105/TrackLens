import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface PageMeta {
  title: string;
  subtitle?: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Overview",
    subtitle: "A snapshot of activity across every tracked page.",
  },

  "/sessions": {
    title: "Sessions",
    subtitle: "Every visitor session, sortable and searchable.",
  },

  "/heatmap": {
    title: "Heatmap",
    subtitle: "Where visitors click on each page.",
  },
};

const resolveMeta = (pathname: string): PageMeta => {
  if (PAGE_META[pathname]) {
    return PAGE_META[pathname];
  }

  if (pathname.startsWith("/sessions/")) {
    return {
      title: "Session journey",

      subtitle: "Chronological events for a single session.",
    };
  }

  return {
    title: "Pulse Analytics",
  };
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { pathname } = useLocation();

  const meta = resolveMeta(pathname);

  return (
    <div className="flex min-h-screen overflow-hidden bg-canvas">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onNavigate={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      <div className="flex h-screen flex-1 flex-col overflow-hidden lg:pl-0">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen((current) => !current)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto px-5 py-6 sm:px-7">
          <Outlet
            context={{
              setSidebarCollapsed,
            }}
          />
        </main>
      </div>
    </div>
  );
}
