import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { Button, Input } from '../components/ui/Inputs';
import { Container } from '../components/ui/Layouts';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const user = await authService.getUser();
      if (user) {
        navigate('/admin');
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = authService.getClient().auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/admin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.signInWithOtp(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.verifyOtp(email, otp);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please check your email again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-zinc-950">
      <Container className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-zinc-400">Build your professional portfolio in minutes.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOtp}>
              <div className="mb-6">
                 <Input 
                   label="Email Address" 
                   type="email" 
                   placeholder="you@example.com" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
                 <div className="text-xs text-zinc-500 mt-2 p-2 bg-zinc-950 rounded border border-zinc-800">
                   <p className="font-semibold text-zinc-400 mb-1">How it works:</p>
                   We will send a <strong>6-digit verification code</strong> to your email. No password required.
                 </div>
              </div>
              <Button className="w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'} <ArrowRight size={16} />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                  <Mail size={24} />
                </div>
                <p className="text-white text-sm">Code sent to <span className="font-bold">{email}</span></p>
                <button type="button" onClick={() => setStep('email')} className="text-xs text-zinc-500 hover:text-zinc-300 underline mt-1">Change email</button>
              </div>

              <div className="mb-6">
                 <Input 
                   label="Verification Code" 
                   type="text" 
                   placeholder="123456" 
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   className="text-center tracking-widest text-xl"
                   required
                   maxLength={6}
                 />
              </div>
              <Button className="w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'} <CheckCircle size={16} />
              </Button>
            </form>
          )}
        </div>
      </Container>
    </main>
  );
};

export default Auth;