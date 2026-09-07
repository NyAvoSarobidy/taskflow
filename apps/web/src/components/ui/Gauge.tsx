export function Gauge({
  value,
  max,
  color = "blue",
  className,
}: {
  value: number;
  max: number;
  color?: "blue" | "blue-deep";
  className?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={`h-1.5 w-full rounded-full bg-line ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full rounded-full transition-all ${
          color === "blue-deep" ? "bg-blue-deep" : "bg-blue"
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
