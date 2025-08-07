import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, type AuthContextType } from "@/contexts/AuthContext";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register } = useAuth() as AuthContextType;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "შეცდომა",
        description: "პაროლები არ ემთხვევა ერთმანეთს",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      toast({
        title: "შეცდომა",
        description: "პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (success) {
        toast({
          title: "რეგისტრაცია წარმატებით დასრულდა!",
          description: "მოგესალმებით HOMEVEND.ge-ზე!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "შეცდომა",
        description: "რეგისტრაცია ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto py-10 px-4 pt-24">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">რეგისტრაცია</CardTitle>
              <CardDescription className="text-center">
                შექმენით ანგარიში HOMEVEND.ge-ზე
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">
                    სახელი და გვარი
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="შეიყვანეთ სახელი და გვარი"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    ელ-ფოსტა
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="თქვენი ელ-ფოსტის მისამართი"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    პაროლი
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="შეიყვანეთ პაროლი"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    გაიმეორეთ პაროლი
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="გაიმეორეთ პაროლი"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "მიმდინარეობს..." : "რეგისტრაცია"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-muted-foreground">
                უკვე გაქვთ ანგარიში?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  შესვლა
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
