import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    { className, size = "md", variant = "primary", ...props },
    ref
  ) => {
    const sizes = {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-3",
    };

    const variants = {
      primary: "border-[#a7dbb8] border-t-[#00833e]",
      secondary: "border-gray-200 border-t-gray-600",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-block animate-spin rounded-full",
          sizes[size],
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
