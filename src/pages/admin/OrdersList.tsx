import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export default function OrdersList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage customer orders
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Orders Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This section will display all customer orders with status tracking, 
            order details, and management options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
