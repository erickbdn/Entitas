import { CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard, CustomCardContent } from "@/components/ui/CustomCard";
import { cn } from "@/lib/utils";

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string; // New prop to control CustomCardContent
}

export function DashboardWidget({ title, children, className, titleClassName, contentClassName }: DashboardWidgetProps) {
  return (
    <CustomCard variant="widget" className={cn("relative h-full", className)}>
      {/* Title overlays on top but remains flexible */}
      <CardHeader className="absolute top-0 left-0 w-full">
        <CardTitle className={cn("text-lg font-semibold", titleClassName)}>
          {title}
        </CardTitle>
      </CardHeader>

      {/* Content takes full space */}
      <CustomCardContent className={cn("h-full w-full flex items-stretch", contentClassName)}>
        {children}
      </CustomCardContent>
    </CustomCard>
  );
}



