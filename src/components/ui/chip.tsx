import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "selected" | "outlined";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: React.ReactNode;
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant = "default", size = "md", removable, onRemove, leftIcon, selected, children, ...props }, ref) => {
    const variants = {
      default: selected
        ? "bg-primary text-text-inverse border-primary"
        : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary",
      selected: "bg-primary text-text-inverse border-primary",
      outlined: selected
        ? "bg-primary-light text-primary border-primary"
        : "bg-transparent text-text-secondary border-border hover:border-primary hover:text-primary",
    };

    const sizes = {
      sm: "px-2.5 py-1 text-xs gap-1",
      md: "px-3 py-1.5 text-sm gap-1.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border font-medium transition-all duration-200 whitespace-nowrap cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {removable && (
          <X
            className="h-3 w-3 shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          />
        )}
      </button>
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
export type { ChipProps };
