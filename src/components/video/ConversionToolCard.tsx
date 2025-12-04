import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ConversionToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  buttonLabel: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onButtonClick: () => void;
}

export default function ConversionToolCard({
  title,
  description,
  icon: Icon,
  iconClassName = "w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary",
  buttonLabel,
  buttonVariant = "default",
  onButtonClick,
}: ConversionToolCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(iconClassName)}>
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={buttonVariant}
          className="w-full"
          onClick={onButtonClick}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
}

