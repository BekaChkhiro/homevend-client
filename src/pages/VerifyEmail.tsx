import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('ვერიფიკაციის ტოკენი არ მოიძებნა');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const data = await authApi.verifyEmail(token);

      if (data.success) {
        setVerificationStatus('success');
        toast({
          title: 'წარმატება!',
          description: 'თქვენი ელ.ფოსტა წარმატებით დადასტურდა',
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setErrorMessage(data.message || 'ვერიფიკაციის შეცდომა');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setErrorMessage(error?.response?.data?.message || 'ვერიფიკაციისას მოხდა შეცდომა');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ელ.ფოსტის დადასტურება</CardTitle>
          <CardDescription>
            {verificationStatus === 'loading' && 'თქვენი ელ.ფოსტა მოწმდება...'}
            {verificationStatus === 'success' && 'თქვენი ელ.ფოსტა დადასტურებულია'}
            {verificationStatus === 'error' && 'ვერიფიკაციის შეცდომა'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {verificationStatus === 'loading' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          <div className="text-center space-y-2">
            {verificationStatus === 'loading' && (
              <p className="text-gray-600">გთხოვთ დაელოდოთ...</p>
            )}
            
            {verificationStatus === 'success' && (
              <>
                <p className="text-gray-600">
                  თქვენი ანგარიში აქტიურია და შეგიძლიათ შეხვიდეთ სისტემაში.
                </p>
                <p className="text-sm text-gray-500">
                  3 წამში გადამისამართდებით შესვლის გვერდზე...
                </p>
              </>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <p className="text-red-600">{errorMessage}</p>
                <p className="text-sm text-gray-500">
                  ტოკენი შესაძლოა ვადაგასული იყოს ან უკვე გამოყენებული.
                </p>
              </>
            )}
          </div>

          <div className="space-y-3">
            {verificationStatus === 'success' && (
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                შესვლა
              </Button>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full"
                  variant="outline"
                >
                  შესვლის გვერდზე გადასვლა
                </Button>
                <Button 
                  onClick={() => navigate('/resend-verification')} 
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  ახალი ვერიფიკაციის ბმულის გაგზავნა
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;