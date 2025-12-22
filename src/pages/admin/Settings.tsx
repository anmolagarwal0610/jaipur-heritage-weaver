import { useState } from 'react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Store, 
  Truck, 
  Home,
  Loader2,
  Save,
  MessageCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useStoreSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    freeShippingThreshold: 0,
    defaultShippingCost: 0,
    maxRockstarCategories: 6,
    maxFeaturedProducts: 4,
    whatsappEnabled: true,
    whatsappNumber: '',
  });
  const [initialized, setInitialized] = useState(false);

  // Initialize form data when settings load
  if (!initialized && settings && !loading) {
    setFormData({
      storeName: settings.storeName || '',
      storeEmail: settings.storeEmail || '',
      storePhone: settings.storePhone || '',
      freeShippingThreshold: settings.freeShippingThreshold || 0,
      defaultShippingCost: settings.defaultShippingCost || 0,
      maxRockstarCategories: settings.maxRockstarCategories || 6,
      maxFeaturedProducts: settings.maxFeaturedProducts || 4,
      whatsappEnabled: settings.whatsappEnabled !== false,
      whatsappNumber: settings.whatsappNumber || '',
    });
    setInitialized(true);
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(formData);
      toast({ title: 'Settings saved successfully' });
    } catch (err) {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Store configuration and preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4" /> Store Information
            </CardTitle>
            <CardDescription>
              Basic store details displayed to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  placeholder="Enter store name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={formData.storeEmail}
                  onChange={(e) => handleChange('storeEmail', e.target.value)}
                  placeholder="store@example.com"
                />
              </div>
            </div>
            <div className="space-y-2 sm:w-1/2">
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={formData.storePhone}
                onChange={(e) => handleChange('storePhone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </CardContent>
        </Card>

        {/* Homepage Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Home className="h-4 w-4" /> Homepage Settings
            </CardTitle>
            <CardDescription>
              Control how content appears on your homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxRockstar">Max Rockstar Categories</Label>
                <Input
                  id="maxRockstar"
                  type="number"
                  min={1}
                  max={12}
                  value={formData.maxRockstarCategories}
                  onChange={(e) => handleChange('maxRockstarCategories', parseInt(e.target.value) || 6)}
                />
                <p className="text-xs text-muted-foreground">
                  Number of featured categories on homepage (1-12)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFeatured">Featured Products per Category</Label>
                <Input
                  id="maxFeatured"
                  type="number"
                  min={1}
                  max={12}
                  value={formData.maxFeaturedProducts}
                  onChange={(e) => handleChange('maxFeaturedProducts', parseInt(e.target.value) || 4)}
                />
                <p className="text-xs text-muted-foreground">
                  Default number of featured products shown (1-12)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4" /> Shipping Settings
            </CardTitle>
            <CardDescription>
              Configure shipping costs and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="freeShipping">Free Shipping Threshold (₹)</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  min={0}
                  value={formData.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Orders above this amount get free shipping
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Default Shipping Cost (₹)</Label>
                <Input
                  id="shippingCost"
                  type="number"
                  min={0}
                  value={formData.defaultShippingCost}
                  onChange={(e) => handleChange('defaultShippingCost', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Shipping cost for orders below threshold
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4" /> WhatsApp Settings
            </CardTitle>
            <CardDescription>
              Configure the WhatsApp chat button on your store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable WhatsApp Chat Button</Label>
                <p className="text-sm text-muted-foreground">
                  Show floating WhatsApp button on all pages
                </p>
              </div>
              <Switch
                checked={formData.whatsappEnabled}
                onCheckedChange={(checked) => handleChange('whatsappEnabled', checked)}
              />
            </div>
            {formData.whatsappEnabled && (
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                <Input
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="919887238849"
                />
                <p className="text-xs text-muted-foreground">
                  Enter with country code, no + or spaces (e.g., 919887238849)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
