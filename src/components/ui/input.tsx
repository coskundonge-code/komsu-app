import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, type = "text", ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
            error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-100",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-sm font-medium text-red-600">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-sm text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
