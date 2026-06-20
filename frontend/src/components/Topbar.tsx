interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-canvas/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-ink/5 lg:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="font-display text-xl font-semibold text-ink">
            {title}
          </h1>

          {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
