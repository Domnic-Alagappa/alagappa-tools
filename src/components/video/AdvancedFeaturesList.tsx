import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface Feature {
  label: string;
}

interface AdvancedFeaturesListProps {
  features: Feature[];
}

export default function AdvancedFeaturesList({ features }: AdvancedFeaturesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

