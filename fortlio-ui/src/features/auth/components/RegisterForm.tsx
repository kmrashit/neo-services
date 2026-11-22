import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, User, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'candidate' | 'hr'>('candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading, error, successMessage } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {return;}

    const ok = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role,
    });

    if (ok) {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/80 shadow-xl backdrop-blur-sm bg-card/95">
      <CardHeader className="space-y-1 text-center pb-5">
        <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">
          Join Fortlio
        </CardTitle>
        <CardDescription className="text-sm">
          {role === 'candidate'
            ? 'Showcase skills, write blogs, and export PDF resumes'
            : 'Discover pre-screened talent with AI candidate insights'}
        </CardDescription>

        <div className="pt-2">
          <Tabs
            value={role}
            onValueChange={(val) => setRole(val as 'candidate' | 'hr')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="candidate" className="flex items-center gap-1.5">
                <User className="size-4" />
                Candidate
              </TabsTrigger>
              <TabsTrigger value="hr" className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                Recruiter / HR
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-muted-foreground">Redirecting you to login in 3 seconds...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive dark:border-destructive/30">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name">Full Name</Label>
            <Input
              id="reg-name"
              type="text"
              placeholder={role === 'candidate' ? 'Alex Mercer' : 'Sarah Jenkins'}
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading || !!successMessage}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email Address</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder={role === 'candidate' ? 'alex@example.com' : 'sarah@company.com'}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || !!successMessage}
              error={!!error}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <div className="relative">
              <Input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!successMessage}
                error={!!error}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must include letters and numbers.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full mt-2 font-semibold shadow-md bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading || !!successMessage || !fullName || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              `Create ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Account`
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 text-center border-t border-border/50 pt-5">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
