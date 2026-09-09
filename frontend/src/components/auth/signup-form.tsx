import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { useSignup } from '../../hooks/use-auth';
import type { ApiResponse } from '../../types/api.types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';
import { ROLES } from '../../constants/roles.constant';

import { VALIDATION_MESSAGES } from '../../constants/validation-messages.constant';

const signupSchema = z.object({
  name: z.string().min(2, { message: VALIDATION_MESSAGES.NAME.MIN_LENGTH }),
  email: z.string().email({ message: VALIDATION_MESSAGES.EMAIL.INVALID }),
  password: z.string().min(6, { message: VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH }),
  role: z.nativeEnum(ROLES).optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  title?: string;
  description?: string;
  loginRoute?: string;
  defaultRole?: ROLES;
  redirectRoute?: string;
}

export function SignupForm({
  title = 'Create an account',
  description = 'Sign up to get started',
  loginRoute = '/login',
  defaultRole = ROLES.USER,
  redirectRoute,
}: SignupFormProps) {
  const signupMutation = useSignup({ redirectUrl: redirectRoute });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const onSubmit = (data: SignupValues) => {
    setErrorMsg(null);
    signupMutation.mutate(data, {
      onError: (err: AxiosError<ApiResponse<null>>) => {
        setErrorMsg(err?.response?.data?.message || 'Failed to sign up. Please try again.');
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
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="John Doe" {...register('name')} />
            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="john@example.com" {...register('email')} />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <span className="text-xs text-destructive">{errors.password.message}</span>}
          </div>
        </div>

        <input type="hidden" {...register('role')} value={defaultRole} />

        <div className="space-y-4">
          <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
          </Button>
          

        </div>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to={loginRoute} className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
