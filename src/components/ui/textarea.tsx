import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-lg border-2 border-gray-200 bg-surface px-3 py-2 text-base placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-[#d1fae5] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 resize-vertical",
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

Textarea.displayName = "Textarea";

export { Textarea };
