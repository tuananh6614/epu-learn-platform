
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "premium-btn premium-btn-primary",
        "premium-secondary": "premium-btn premium-btn-secondary",
        "premium-outline": "border-2 border-primary/40 bg-transparent text-primary dark:text-white hover:bg-primary/10 rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg",
        "glass": "bg-white/20 dark:bg-slate-900/20 backdrop-blur-md border border-white/30 dark:border-slate-800/30 hover:bg-white/30 dark:hover:bg-slate-800/30 text-slate-900 dark:text-white rounded-xl shadow-md hover:shadow-lg",
        "hero-primary": "bg-white text-epu-primary hover:bg-white/95 dark:bg-white dark:text-epu-primary dark:hover:bg-white/95 shadow-lg font-medium rounded-xl",
        "hero-secondary": "bg-transparent border-2 border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10 shadow-md font-medium rounded-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-12 text-base rounded-xl px-8",
        "hero": "h-11 md:h-12 px-6 py-2.5 text-sm md:text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
