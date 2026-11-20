import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Mail, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '../api';

export const VerifyEmailCard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage('Invalid or missing verification token.');
      return;
    }

    const runVerification = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setIsSuccess(true);
        setMessage(
          response.data?.message ||
            response.message ||
            'Your email address has been verified successfully!'
        );
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setIsSuccess(false);
        setMessage(
          err.response?.data?.message ||
            err.message ||
            'Verification link has expired or is invalid.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    runVerification();
  }, [location.search, navigate]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setIsResending(true);
    setResendStatus(null);
    try {
      const response = await authApi.resendVerification(resendEmail.trim());
      setResendStatus(
        response.data?.message ||
          response.message ||
          'Verification email has been resent successfully.'
      );
    } catch (err: any) {
      setResendStatus(
        err.response?.data?.message ||
          err.message ||
          'Failed to resend verification link.'
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border/80 shadow-xl backdrop-blur-sm bg-card/95 text-center">
      <CardHeader className="space-y-2 pb-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted">
          {isLoading ? (
            <Loader2 className="size-8 text-primary animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="size-8 text-destructive" />
          )}
        </div>

        <CardTitle className="text-2xl font-bold">
          {isLoading
            ? 'Verifying Email...'
            : isSuccess
            ? 'Email Verified'
            : 'Verification Failed'}
        </CardTitle>

        <CardDescription className="text-sm">
          {isLoading
            ? 'Please wait while we confirm your account credentials'
            : message}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isSuccess && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
            <span>Redirecting you to login in 3 seconds</span>
            <ArrowRight className="size-4 animate-pulse" />
          </div>
        )}

        {!isLoading && !isSuccess && (
          <div className="space-y-4 border-t border-border/50 pt-5 text-left">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Resend Verification Email
              </h4>
              <p className="text-xs text-muted-foreground">
                Enter your email address to receive a fresh verification link.
              </p>
            </div>

            {resendStatus && (
              <div className="rounded-lg bg-muted p-3 text-xs text-foreground font-medium">
                {resendStatus}
              </div>
            )}

            <form onSubmit={handleResend} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="resend-email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="resend-email"
                  type="email"
                  placeholder="alex@example.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  disabled={isResending}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                className="w-full text-xs font-semibold"
                disabled={isResending || !resendEmail}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 size-3.5" />
                    Resend Verification Link
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 pt-4">
        <Link
          to="/login"
          className="text-sm font-medium text-primary hover:underline hover:text-primary/80"
        >
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};
