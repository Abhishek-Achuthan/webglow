import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { useLogin } from '../../hooks/use-auth';
import type { ApiResponse } from '../../types/api.types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';

import { VALIDATION_MESSAGES } from '../../constants/validation-messages.constant';

const loginSchema = z.object({
  email: z.string().email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  password: z.string().min(6, { message: VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH }),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  title?: string;
  description?: string;
  signupRoute?: string;
  redirectRoute?: string;
}

export function LoginForm({
  title = 'Welcome back',
  description = 'Please enter your details',
  signupRoute = '/signup',
  redirectRoute,
}: LoginFormProps) {
  const loginMutation = useLogin({ redirectUrl: redirectRoute });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    setErrorMsg(null);
    loginMutation.mutate(data, {
      onError: (err: AxiosError<ApiResponse<null>>) => {
        setErrorMsg(err?.response?.data?.message || 'Failed to login. Please try again.');
      },
    });
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errorMsg && <div className="text-sm font-medium text-destructive">{errorMsg}</div>}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="athul@example.com" {...register('email')} />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
          </div>
        </div>



        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
          

        </div>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to={signupRoute} className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
