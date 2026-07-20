import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-foreground text-background":
            variant === "default",
          "border-transparent bg-muted text-foreground":
            variant === "secondary",
          "border-border text-foreground bg-transparent":
            variant === "outline",
          "border-transparent bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black":
            variant === "success",
          "border-transparent bg-red-900/30 text-red-400 border-red-800/50":
            variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
