import { IconChevronLeft, IconChevronRight } from "./Icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalCount,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-border px-1 pt-4">
      <p className="text-sm text-ink-muted">
        Page <span className="font-medium text-ink">{page}</span> of{" "}
        <span className="font-medium text-ink">{totalPages}</span> &middot;{" "}
        <span className="font-medium text-ink">{totalCount}</span> sessions
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
