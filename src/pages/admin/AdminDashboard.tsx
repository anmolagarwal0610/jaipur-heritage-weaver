import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts();

  const stats = [
    { 
      label: 'Categories', 
      value: categoriesLoading ? '...' : categories.length,
      icon: Layers,
      color: 'bg-blue-500/10 text-blue-600'
    },
    { 
      label: 'Products', 
      value: productsLoading ? '...' : products.length,
      icon: Package,
      color: 'bg-green-500/10 text-green-600'
    },
    { 
      label: 'Orders', 
      value: '0',
      icon: ShoppingCart,
      color: 'bg-orange-500/10 text-orange-600'
    },
    { 
      label: 'Revenue', 
      value: '₹0',
      icon: TrendingUp,
      color: 'bg-purple-500/10 text-purple-600'
    },
  ];

  const quickActions = [
    { 
      title: 'Products', 
      description: 'Manage categories and products',
      icon: Package,
      to: '/dashboard/admin/products'
    },
    { 
      title: 'Orders', 
      description: 'View and manage orders',
      icon: ShoppingCart,
      to: '/dashboard/admin/orders'
    },
    { 
      title: 'Customers', 
      description: 'View customer information',
      icon: Users,
      to: '/dashboard/admin/customers'
    },
    { 
      title: 'Analytics', 
      description: 'Store performance metrics',
      icon: BarChart3,
      to: '/dashboard/admin/analytics'
    },
    { 
      title: 'Settings', 
      description: 'Store configuration',
      icon: Settings,
      to: '/dashboard/admin/settings'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to your store admin console
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigate(action.to)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-base font-medium mt-3">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
