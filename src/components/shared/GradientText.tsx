import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary";
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
}

export function GradientText({
  className,
  variant = "primary",
  as: Tag = "span",
  children,
  ...props
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        variant === "primary" ? "gradient-text" : "gradient-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
