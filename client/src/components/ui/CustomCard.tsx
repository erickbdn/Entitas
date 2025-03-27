import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Define CVA variant styles
const customCardVariants = cva("w-full border-0", {
  variants: {
    variant: {
      default: "bg-white shadow-lg text-black",
      transparent: "bg-transparent shadow-none text-white",
      widget: "bg-[--secondary-light-01] shadow-md backdrop-blur-3xl",
      dark: "bg-gray-900 text-white border-gray-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CustomCardProps extends React.ComponentProps<typeof Card>, VariantProps<typeof customCardVariants> {}

export function CustomCard({ className, variant, ...props }: CustomCardProps) {
  return <Card className={cn(customCardVariants({ variant }), className)} {...props} />;
}

// Custom CardContent with flexible class names instead of fixed padding variants
export function CustomCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />; // Default padding, but can be overridden
}

// Export other components
export { CardHeader, CardTitle };
