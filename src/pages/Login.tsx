import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { toast } = useToast();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation('auth');
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showEmailVerificationAlert, setShowEmailVerificationAlert] = useState(false);

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'check-email') {
      setShowEmailVerificationAlert(true);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: t('login.successTitle'),
          description: t('login.successDesc'),
        });
        
        // Redirect to dashboard after login
        navigate("/dashboard");
      } else {
        setError(t('login.invalidCredentials'));
      }
    } catch (err) {
      setError(t('login.loginError'));
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-48">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t('login.title')}</CardTitle>
              <CardDescription className="text-center">
                {t('login.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showEmailVerificationAlert && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    {t('login.emailVerificationAlert')}
                    <Link to="/resend-verification" className="ml-2 underline">
                      {t('login.resendVerification')}
                    </Link>
                  </AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    {error}
                    {error.includes('verification') && (
                      <div className="mt-2">
                        <Link to="/resend-verification" className="underline">
                          {t('login.newVerificationRequest')}
                        </Link>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">{t('login.testCredentials')}</p>
                <p className="text-xs">{t('login.testUser')} <span className="font-mono">user1@example.com</span> / <span className="font-mono">password123</span></p>
                <p className="text-xs">{t('login.testAdmin')} <span className="font-mono">admin@test.com</span> / <span className="font-mono">admin123456</span></p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('login.email')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('login.emailPlaceholder')}
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t('login.password')}
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('login.passwordPlaceholder')}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('login.logging') : t('login.loginButton')}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                {t('login.noAccount')}{" "}
                <Link to="/register" className="text-primary hover:underline">
                  {t('login.registerLink')}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
