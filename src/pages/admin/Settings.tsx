import { Card, CardContent } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Store configuration and preferences
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SettingsIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Settings Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            This section will include store information, shipping settings, 
            payment configuration, and other preferences.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
