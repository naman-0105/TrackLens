import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-5xl font-bold text-ink/15">404</p>

      <p className="font-display text-lg font-semibold text-ink">
        Page not found
      </p>

      <p className="max-w-sm text-sm text-ink-muted">
        The dashboard route you're looking for doesn't exist. Head back to the
        overview to keep exploring.
      </p>

      <Link to="/" className="btn-primary mt-2">
        Back to overview
      </Link>
    </div>
  );
}
