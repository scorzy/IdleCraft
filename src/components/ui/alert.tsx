import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:text-foreground grid gap-1 grid-flow-row items-center",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        primary: "border-primary/50 text-primary dark:border-primary [&>svg]:text-primary bg-primary/10",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }),'alert', className)}
    {...props}
  />
)))
Alert.displayName = "Alert"

const AlertTitle = React.memo(React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
)))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.memo(React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed mt-1", className)}
    {...props}
  />
)))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
