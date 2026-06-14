'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, ArrowLeft, Lock, Mail, User, Shield, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

import { signupSchema, SignupInput } from '@/lib/schemas/auth';
import { signupAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';
import { cn } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'buyer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await signupAction(values);
      
      if (response.success) {
        toast.success('Registration successful! Please sign in with your credentials.');
        router.push('/login');
      } else {
        toast.error(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-background via-muted/50 to-background px-4 py-12 overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />

      <FadeIn className="w-full max-w-md">
        <div className="mb-6 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to ShopEasy
          </Link>
        </div>

        <Card className="border-border/60 shadow-xl shadow-foreground/5 bg-card/80 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-indigo-500 to-primary bg-clip-text text-transparent">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign up to start shopping or list products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    disabled={isLoading}
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    disabled={isLoading}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    disabled={isLoading}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Select Your Account Role
                </label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {/* Buyer Option */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setValue('role', 'buyer')}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer',
                      selectedRole === 'buyer'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <ShoppingBag className="h-6 w-6 mb-1.5" />
                    <span className="text-sm font-semibold">Buyer</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Shop & checkout</span>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setValue('role', 'admin')}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center cursor-pointer',
                      selectedRole === 'admin'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Shield className="h-6 w-6 mb-1.5" />
                    <span className="text-sm font-semibold">Seller / Admin</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Manage inventory</span>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-xs text-destructive mt-1 font-medium">{errors.role.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </FadeIn>
    </div>
  );
}
