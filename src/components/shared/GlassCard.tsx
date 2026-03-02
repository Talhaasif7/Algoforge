import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ className, hover = false, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn("glass-card p-6", hover && "glass-card-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}
