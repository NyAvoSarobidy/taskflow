import { clsx } from "clsx";

const variants = {
  default: "bg-blue-veil text-blue-deep",
  blue: "bg-blue text-white",
  outline: "border border-blue-edge text-ink-soft",
};

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-[99px] px-2.5 py-0.5 text-[12px] font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
