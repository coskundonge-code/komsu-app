import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export function Divider({ className, orientation = "horizontal", label, ...props }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-medium text-text-muted whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    );
  }

  if (orientation === "vertical") {
    return <div className={cn("w-px bg-border self-stretch", className)} {...props} />;
  }

  return <div className={cn("h-px w-full bg-border", className)} {...props} />;
}
