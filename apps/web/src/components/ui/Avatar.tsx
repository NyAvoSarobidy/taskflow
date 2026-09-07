import { clsx } from "clsx";

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizes = {
    sm: "h-7 w-7 text-[11px]",
    md: "h-9 w-9 text-[13px]",
    lg: "h-11 w-11 text-[15px]",
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-[99px] bg-blue-deep font-semibold text-white",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
