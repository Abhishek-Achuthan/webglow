import { cn } from "@/lib/utils"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button-variants"


export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  noVibrate?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  noVibrate = false,
  onPointerDown,
  ...props
}: ButtonProps) {
  const handlePointerDown: ButtonProps["onPointerDown"] = (e) => {
    if (!noVibrate && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50) // 50ms haptic feedback
    }
    if (onPointerDown) {
      onPointerDown(e)
    }
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onPointerDown={handlePointerDown}
      {...props}
    />
  )
}

export { Button }
