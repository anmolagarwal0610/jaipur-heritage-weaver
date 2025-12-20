import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Truck,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { OrderStatus } from '@/lib/firebase-types';
import { format } from 'date-fns';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { order, loading, error } = useOrder(orderId);
  const { updateOrderStatus, updateTrackingNumber, addOrderNote } = useOrders();
  
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!orderId || !newStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({ title: 'Status updated successfully' });
      setNewStatus('');
    } catch (err) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!orderId || !trackingNumber) return;
    setUpdating(true);
    try {
      await updateTrackingNumber(orderId, trackingNumber);
      toast({ title: 'Tracking number updated' });
    } catch (err) {
      toast({ title: 'Failed to update tracking', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!orderId || !note.trim()) return;
    setUpdating(true);
    try {
      await addOrderNote(orderId, note.trim());
      toast({ title: 'Note added' });
      setNote('');
    } catch (err) {
      toast({ title: 'Failed to add note', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderDate = order.createdAt instanceof Date 
    ? order.createdAt 
    : (order.createdAt as any)?.toDate?.() || new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/admin/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-semibold text-foreground">
              Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {format(orderDate, 'PPpp')}
            </p>
          </div>
        </div>
        <Badge className={statusColors[order.status]}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" /> Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        {(item.size || item.color) && (
                          <p className="text-sm text-muted-foreground">
                            {[item.size, item.color].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{order.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>₹{order.shippingCost.toLocaleString()}</span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>₹{order.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No items</p>
              )}
            </CardContent>
          </Card>

          {/* Customer & Shipping */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{order.shippingAddress?.name || 'N/A'}</p>
                <p className="text-muted-foreground">{order.userEmail || 'N/A'}</p>
                {order.shippingAddress?.phone && (
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" /> Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {order.shippingAddress ? (
                  <div className="space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No address provided</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={!newStatus || updating}
                className="w-full"
              >
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="h-4 w-4" /> Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber || order.trackingNumber || ''}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleTrackingUpdate}
                disabled={!trackingNumber || updating}
                className="w-full"
              >
                Save Tracking
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.notes && (
                <div className="text-sm p-3 bg-muted rounded-lg whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {order.notes}
                </div>
              )}
              <div className="space-y-2">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddNote}
                  disabled={!note.trim() || updating}
                  className="w-full"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
