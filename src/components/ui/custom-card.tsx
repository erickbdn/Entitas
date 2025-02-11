import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define CVA variant styles
const customCardVariants = cva("w-full max-w-sm border-0", {
  variants: {
    variant: {
      default: "bg-white shadow-lg text-black",
      transparent: "bg-transparent shadow-none text-white",
      dark: "bg-gray-900 text-white border-gray-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface CustomCardProps extends React.ComponentProps<typeof Card>, VariantProps<typeof customCardVariants> {}

export function CustomCard({ className, variant, ...props }: CustomCardProps) {
  return <Card className={cn(customCardVariants({ variant }), className)} {...props} />
}

// Export Card subcomponents so they can still be used
export { CardContent, CardHeader, CardTitle }
