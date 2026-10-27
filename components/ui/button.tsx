"use client";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import styles from "./controls.module.css";

// shadcn Base UI component, styled with the storefront's shared tokens.
const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      default: styles.primary, outline: styles.outline, secondary: styles.secondary,
      ghost: styles.ghost, destructive: styles.destructive, link: styles.link,
      campaign: styles.campaign, inverse: styles.inverse,
    },
    size: { default: styles.normal, sm: styles.small, lg: styles.large, icon: styles.icon },
  },
  defaultVariants: { variant: "default", size: "default" },
});
function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
