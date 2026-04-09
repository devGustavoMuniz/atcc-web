import { cn } from "@/lib/utils"

type StatusToggleProps = {
  checked: boolean
  className?: string
  disabled?: boolean
  ariaLabel?: string
  onPressedChange?: () => void
}

export function StatusToggle({
  checked,
  className,
  disabled = false,
  ariaLabel,
  onPressedChange,
}: StatusToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onPressedChange}
      className={cn(
        "relative inline-flex h-8 w-[4.75rem] shrink-0 items-center rounded-full border shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60",
        checked
          ? "border-primary/20 bg-primary text-primary-foreground"
          : "border-input bg-muted text-muted-foreground",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-y-0 flex items-center text-[11px] font-semibold uppercase tracking-[0.02em] transition-all",
          checked ? "left-3 pr-8" : "right-3 pl-8"
        )}
      >
        {checked ? "Sim" : "Nao"}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute top-1 size-6 rounded-full border bg-background shadow-sm transition-all",
          checked
            ? "right-1 border-primary/10"
            : "left-1 border-border"
        )}
      />
    </button>
  )
}
