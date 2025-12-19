import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format, subDays, startOfDay, isAfter } from 'date-fns';

export default function Analytics() {
  const { orders, loading: ordersLoading, stats: orderStats } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30');

  const loading = ordersLoading || productsLoading || customersLoading;

  // Calculate date range
  const startDate = startOfDay(subDays(new Date(), parseInt(dateRange)));
  const filteredOrders = orders.filter(order => {
    const orderDate = order.createdAt instanceof Date 
      ? order.createdAt 
      : (order.createdAt as any)?.toDate?.() || new Date();
    return isAfter(orderDate, startDate);
  });

  // Stats cards data
  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `₹${orderStats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    { 
      label: 'Total Orders', 
      value: orderStats.total,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      label: 'Total Customers', 
      value: customers.length,
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    { 
      label: 'Total Products', 
      value: products.length,
      icon: Package,
      color: 'text-orange-600 bg-orange-100'
    },
  ];

  // Order status distribution for pie chart
  const statusData = [
    { name: 'Pending', value: orderStats.pending, color: '#EAB308' },
    { name: 'Processing', value: orderStats.processing, color: '#3B82F6' },
    { name: 'Shipped', value: orderStats.shipped, color: '#8B5CF6' },
    { name: 'Delivered', value: orderStats.delivered, color: '#22C55E' },
    { name: 'Cancelled', value: orderStats.cancelled, color: '#EF4444' },
  ].filter(s => s.value > 0);

  // Revenue by day for line chart
  const revenueByDay = Array.from({ length: parseInt(dateRange) }, (_, i) => {
    const date = subDays(new Date(), parseInt(dateRange) - 1 - i);
    const dayStart = startOfDay(date);
    const dayOrders = orders.filter(order => {
      const orderDate = order.createdAt instanceof Date 
        ? order.createdAt 
        : (order.createdAt as any)?.toDate?.() || new Date();
      return format(orderDate, 'yyyy-MM-dd') === format(dayStart, 'yyyy-MM-dd');
    });
    const revenue = dayOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    return {
      date: format(date, 'MMM d'),
      revenue,
      orders: dayOrders.length,
    };
  });

  // Top products by order count
  const productOrderCounts: Record<string, { name: string; count: number }> = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productOrderCounts[item.productId]) {
        productOrderCounts[item.productId] = { name: item.productName, count: 0 };
      }
      productOrderCounts[item.productId].count += item.quantity;
    });
  });
  const topProducts = Object.values(productOrderCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Store performance metrics and insights
          </p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as '7' | '30' | '90')}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" /> Revenue Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByDay.some(d => d.revenue > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No revenue data for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4" /> Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" /> Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Units Sold']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No product sales data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
