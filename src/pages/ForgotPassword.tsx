import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authApi.forgotPassword(email);

      if (data.success) {
        setIsSuccess(true);
        toast({
          title: 'წარმატება!',
          description: 'პაროლის აღდგენის ინსტრუქცია გაგზავნილია თქვენს ელ.ფოსტაზე',
        });
      } else {
        setError(data.message || 'შეცდომა მოხდა. გთხოვთ სცადოთ მოგვიანებით.');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error?.response?.data?.message || 'კავშირის შეცდომა. გთხოვთ სცადოთ მოგვიანებით.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">შეტყობინება გაგზავნილია</CardTitle>
            <CardDescription>
              პაროლის აღდგენის ინსტრუქცია გაგზავნილია მითითებულ ელ.ფოსტაზე
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                შეამოწმეთ თქვენი ელ.ფოსტა და მიჰყევით ინსტრუქციას პაროლის აღსადგენად.
                ბმული აქტიური იქნება 1 საათის განმავლობაში.
              </AlertDescription>
            </Alert>
            
            <div className="text-center text-sm text-gray-600">
              <p>თუ ელ.ფოსტა არ მიიღეთ რამდენიმე წუთში:</p>
              <ul className="mt-2 space-y-1">
                <li>• შეამოწმეთ სპამის საქაღალდე</li>
                <li>• დარწმუნდით, რომ სწორი მისამართი მიუთითეთ</li>
                <li>• სცადეთ ხელახლა რამდენიმე წუთში</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                შესვლის გვერდზე დაბრუნება
              </Button>
              <Button 
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }} 
                variant="outline"
                className="w-full"
              >
                ხელახლა გაგზავნა
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">პაროლის აღდგენა</CardTitle>
          <CardDescription className="text-center">
            შეიყვანეთ თქვენი ელ.ფოსტა და გამოგიგზავნით ინსტრუქციას
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">ელ.ფოსტა</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  გაგზავნა...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  აღდგენის ბმულის გაგზავნა
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              უკან დაბრუნება
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>არ გაქვთ ანგარიში?</p>
            <Button
              variant="link"
              onClick={() => navigate('/register')}
              className="text-primary hover:underline"
            >
              დარეგისტრირდით
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;