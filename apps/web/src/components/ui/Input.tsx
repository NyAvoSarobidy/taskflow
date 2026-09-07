import { clsx } from "clsx";

export function Input({
  label,
  error,
  className,
  ...props
}: {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[14px] font-medium text-ink">{label}</label>
      )}
      <input
        className={clsx(
          "h-10 rounded-lg border border-blue-edge bg-white px-3 text-[14px] text-ink placeholder:text-ink-soft/60 focus-visible:outline-2 focus-visible:outline-blue",
          error && "border-ink",
          className
        )}
        {...props}
      />
      {error && <span className="text-[12.5px] text-ink-soft">{error}</span>}
    </div>
  );
}
