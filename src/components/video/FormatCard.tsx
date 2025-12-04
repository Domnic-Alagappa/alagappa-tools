import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormatCardProps {
  title: string;
  formats: string[];
}

export default function FormatCard({ title, formats }: FormatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {formats.map((format, idx) => (
            <li key={idx}>• {format}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

