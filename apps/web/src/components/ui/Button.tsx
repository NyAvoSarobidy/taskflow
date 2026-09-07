import { clsx } from "clsx";

const variants = {
  primary: "bg-blue text-white hover:bg-blue-press",
  secondary: "bg-white border border-blue-edge text-ink hover:bg-blue-veil",
  ghost: "text-ink-soft hover:text-ink hover:bg-blue-veil",
  danger: "bg-blue-deep text-white hover:bg-ink",
};

const sizes = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
