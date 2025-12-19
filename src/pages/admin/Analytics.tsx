import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Store performance metrics and insights
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This section will display sales charts, revenue metrics, 
            top products, and customer insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
