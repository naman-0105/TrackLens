import type { ComponentType, SVGProps } from "react";

type Accent = "brand" | "teal" | "heat" | "ink";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: Accent;
}

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
}: SummaryCardProps) {
  const accentClasses = {
    brand: "bg-brand-light text-brand",

    teal: "bg-teal-light text-teal",

    heat: "bg-heat/10 text-heat",

    ink: "bg-ink/5 text-ink",
  };

  return (
    <div className="card flex items-center gap-4 p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2 ${
          accentClasses[accent]
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-sm text-ink-muted">{label}</p>

        <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
