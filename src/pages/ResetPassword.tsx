import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');


  useEffect(() => {
    if (!token) {
      setError('აღდგენის ტოკენი არ მოიძებნა');
      setTokenValid(false);
      return;
    }

    validateToken(token);
  }, [token]);

  const validateToken = async (token: string) => {
    try {
      const data = await authApi.validateResetToken(token);

      if (data.success) {
        setTokenValid(true);
        setUserEmail(data.data.email);
      } else {
        setTokenValid(false);
        setError(data.message || 'არასწორი ან ვადაგასული ტოკენი');
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      setTokenValid(false);
      setError(error?.response?.data?.message || 'ტოკენის შემოწმება ვერ მოხერხდა');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password !== confirmPassword) {
      setError('პაროლები არ ემთხვევა');
      return;
    }

    if (password.length < 8) {
      setError('პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს');
      return;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      setError('პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ და ერთ პატარა ასოს');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authApi.resetPassword(token!, password, confirmPassword);

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: 'წარმატება!',
          description: 'თქვენი პაროლი წარმატებით შეიცვალა',
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'პაროლის შეცვლა ვერ მოხერხდა');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error?.response?.data?.message || 'კავშირის შეცდომა. გთხოვთ სცადოთ მოგვიანებით.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold">არასწორი ბმული</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                პაროლის აღდგენის ბმული არასწორია ან ვადაგასულია.
                გთხოვთ მოითხოვოთ ახალი ბმული.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/forgot-password')} 
                className="w-full"
              >
                ახალი ბმულის მოთხოვნა
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="w-full"
              >
                შესვლის გვერდზე დაბრუნება
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">პაროლი შეცვლილია</CardTitle>
            <CardDescription>
              თქვენი პაროლი წარმატებით განახლდა
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              ახლა შეგიძლიათ შეხვიდეთ თქვენს ანგარიშზე ახალი პაროლით.
            </p>
            <p className="text-center text-sm text-gray-500">
              3 წამში გადამისამართდებით შესვლის გვერდზე...
            </p>
            
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full"
            >
              შესვლა
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ახალი პაროლის დაყენება</CardTitle>
          <CardDescription className="text-center">
            {userEmail && `შეიყვანეთ ახალი პაროლი ანგარიშისთვის: ${userEmail}`}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">ახალი პაროლი</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="მინიმუმ 8 სიმბოლო"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                მინიმუმ 8 სიმბოლო, უნდა შეიცავდეს დიდ და პატარა ასოებს
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">გაიმეორეთ პაროლი</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="გაიმეორეთ პაროლი"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  პაროლის შეცვლა...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  პაროლის შეცვლა
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              შესვლის გვერდზე დაბრუნება
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;