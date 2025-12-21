/**
 * MOBILE RESPONSIVENESS GUIDELINES:
 * - All pages should be responsive and work on mobile (375px+)
 * - Use responsive classes (sm:, md:, lg:, xl:)
 * - Ensure touch targets are at least 44x44px
 * - Test on mobile viewport before deploying
 */

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { 
  User, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle
} from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/firebase-types';

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-blue-600', label: 'Confirmed' },
  processing: { icon: Package, color: 'text-purple-600', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-indigo-600', label: 'Shipped' },
  delivered: { icon: CheckCircle, color: 'text-green-600', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', label: 'Cancelled' }
};

const Dashboard = () => {
  const { user, userProfile, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrdersLoading(false);
        return;
      }
      
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        // If index doesn't exist, try without ordering
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
          console.log('Composite index required. Trying without order...');
          try {
            const ordersRef = collection(db, 'orders');
            const q = query(
              ordersRef,
              where('userId', '==', user.uid)
            );
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Order[];
            // Sort client-side
            ordersData.sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() || 0;
              const bTime = b.createdAt?.toMillis?.() || 0;
              return bTime - aTime;
            });
            setOrders(ordersData);
          } catch (fallbackError) {
            console.error('Fallback query also failed:', fallbackError);
          }
        }
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <SEO 
        title="My Account"
        description="Manage your Jaipur Touch account, view order history, and update your profile."
      />

      <div className="min-h-screen bg-background py-8 sm:py-12">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                Welcome, {userProfile?.displayName || user.displayName || 'User'}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account and view orders
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2 w-fit"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground">
                        {userProfile?.displayName || user.displayName || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-foreground">
                        {userProfile?.phone || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">
                        {userProfile?.address ? (
                          <>
                            {userProfile.address.street}<br />
                            {userProfile.address.city}, {userProfile.address.state} {userProfile.address.pincode}
                          </>
                        ) : (
                          'Not set'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Contact us via WhatsApp to update your profile information.
                </p>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-serif text-xl mb-6">Order History</h2>
                
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/shop">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const status = statusConfig[order.status];
                      const StatusIcon = status.icon;
                      
                      return (
                        <div 
                          key={order.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1.5 ${status.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{status.label}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                            <span className="text-sm text-muted-foreground">Total</span>
                            <span className="font-medium text-foreground">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
