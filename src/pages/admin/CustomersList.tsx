import { useState } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Search, Mail, Phone, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomersList() {
  const { customers, loading, stats } = useCustomers();
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(customer => {
    if (search === '') return true;
    return (
      customer.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statCards = [
    { label: 'Total Customers', value: stats.total, icon: Users, color: 'text-blue-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: ShoppingBag, color: 'text-green-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View customer information and order history
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Table */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Customers Found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {customers.length === 0 
                  ? 'Customers will appear here when they sign up.'
                  : 'No customers match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead className="hidden sm:table-cell">Last Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.uid}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {customer.photoURL ? (
                              <img 
                                src={customer.photoURL} 
                                alt={customer.displayName || ''} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {(customer.displayName || customer.email || '?')[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{customer.displayName || 'No name'}</p>
                            <p className="text-sm text-muted-foreground md:hidden">{customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.orderCount} orders</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{customer.totalSpent.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {customer.lastOrderDate 
                          ? format(customer.lastOrderDate, 'MMM d, yyyy')
                          : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
