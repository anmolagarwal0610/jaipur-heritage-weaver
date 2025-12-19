import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CustomersList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View customer information and order history
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Customers Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This section will display registered customers with their profiles, 
            order history, and contact information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
