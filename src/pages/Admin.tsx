/**
 * Admin Console Page
 *
 * TEMPORARY: Admin role check disabled - any logged-in user can access.
 * TODO: Re-enable useAdminRole hook after fixing Firestore issues.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDocFromServer, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
// TEMPORARY: Admin role check disabled
// import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

// TEMP BUILD MODE: allow any logged-in user into admin without password/role checks.
// Set to false once Firestore rules + roles are fixed.
const TEMP_OPEN_ADMIN_CONSOLE = true;

// Helper function to fetch with retry
const fetchWithRetry = async <T,>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500,
): Promise<T> => {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (err) {
      if (i === maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  // TEMPORARY: Bypass admin check - any logged-in user is treated as admin
  const isAdmin = true;
  const adminLoading = false;
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(TEMP_OPEN_ADMIN_CONSOLE);
  const [setupRequired, setSetupRequired] = useState<boolean | null>(TEMP_OPEN_ADMIN_CONSOLE ? false : null);
  const [checkingSetup, setCheckingSetup] = useState(!TEMP_OPEN_ADMIN_CONSOLE);

  // Check if admin console password is set up
  useEffect(() => {
    // TEMP BUILD MODE: skip Firestore admin_settings checks entirely to prevent lockouts.
    if (TEMP_OPEN_ADMIN_CONSOLE) {
      setIsVerified(true);
      setSetupRequired(false);
      setCheckingSetup(false);
      return;
    }

    const checkAdminSetup = async () => {
      if (!user || !isAdmin) return;

      try {
        const settingsRef = doc(db, "admin_settings", "console");
        const settingsSnap = await fetchWithRetry(() => getDocFromServer(settingsRef));

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          setSetupRequired(!data.setupComplete);
        } else {
          // No settings document, setup required
          setSetupRequired(true);
        }
      } catch (err) {
        console.error("Error checking admin setup:", err);
        // If we can't read admin_settings, default to requiring setup (safer than assuming password exists).
        setSetupRequired(true);
        toast({
          title: "Error",
          description: "Failed to check admin settings",
          variant: "destructive",
        });
      } finally {
        setCheckingSetup(false);
      }
    };

    if (!adminLoading && isAdmin) {
      checkAdminSetup();
    }
  }, [user, isAdmin, adminLoading, toast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth", { state: { from: "/admin" } });
    }
  }, [user, authLoading, navigate]);

  // Simple hash function for password (in production, use bcrypt on server)
  const hashPassword = async (pwd: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // Handle password setup
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const passwordHash = await hashPassword(password);
      const settingsRef = doc(db, "admin_settings", "console");

      await setDoc(settingsRef, {
        passwordHash,
        setupComplete: true,
        updatedAt: serverTimestamp(),
      });

      setIsVerified(true);
      toast({
        title: "Admin console ready",
        description: "Password has been set successfully",
      });
    } catch (err) {
      console.error("Error setting up admin password:", err);
      toast({
        title: "Setup failed",
        description: "Could not save admin password. Check Firestore permissions.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const settingsRef = doc(db, "admin_settings", "console");
      const settingsSnap = await fetchWithRetry(() => getDocFromServer(settingsRef));

      if (!settingsSnap.exists()) {
        toast({
          title: "Error",
          description: "Admin settings not found",
          variant: "destructive",
        });
        return;
      }

      const storedHash = settingsSnap.data().passwordHash;
      const inputHash = await hashPassword(password);

      if (inputHash === storedHash) {
        setIsVerified(true);
        toast({
          title: "Access granted",
          description: "Welcome to the admin console",
        });
      } else {
        toast({
          title: "Access denied",
          description: "Incorrect password",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      toast({
        title: "Verification failed",
        description: "Could not verify password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || adminLoading || checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // Access denied - not an admin
  if (!isAdmin) {
    return (
      <>
        <SEO title="Access Denied | Jaipur Touch" description="Admin access required" />
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-serif">Access Denied</CardTitle>
              <CardDescription>You don't have permission to access the admin console.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground">
                Go to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Admin console (after verification)
  if (isVerified) {
    return (
      <>
        <SEO title="Admin Console | Jaipur Touch" description="Manage your store" />
        <div className="min-h-screen bg-background">
          <div className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  <h1 className="text-xl font-serif">Admin Console</h1>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate("/")}>
                  Exit to Site
                </Button>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/products')}
              >
                <CardHeader>
                  <CardTitle className="font-serif">Products</CardTitle>
                  <CardDescription>Manage categories and products</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/orders')}
              >
                <CardHeader>
                  <CardTitle className="font-serif">Orders</CardTitle>
                  <CardDescription>View and manage orders</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/customers')}
              >
                <CardHeader>
                  <CardTitle className="font-serif">Customers</CardTitle>
                  <CardDescription>View customer information</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/analytics')}
              >
                <CardHeader>
                  <CardTitle className="font-serif">Analytics</CardTitle>
                  <CardDescription>Store performance metrics</CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/settings')}
              >
                <CardHeader>
                  <CardTitle className="font-serif">Settings</CardTitle>
                  <CardDescription>Store configuration</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Password setup or verification form
  return (
    <>
      <SEO title="Admin Console | Jaipur Touch" description="Admin access" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-2xl font-serif">
              {setupRequired ? "Setup Admin Console" : "Admin Console"}
            </CardTitle>
            <CardDescription>
              {setupRequired
                ? "Create a password to secure your admin console"
                : "Enter your admin password to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={setupRequired ? handleSetup : handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{setupRequired ? "Create Password" : "Password"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {setupRequired && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    minLength={6}
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {setupRequired ? "Setting up..." : "Verifying..."}
                  </>
                ) : setupRequired ? (
                  "Setup Console"
                ) : (
                  "Enter Console"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Admin;
