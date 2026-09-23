import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login, complete2FA, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.require2FA) {
        setTempToken(res.tempToken);
        setIs2FAStep(true);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please verify your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await complete2FA(tempToken, totpCode);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('2FA error:', err);
      setError(
        err.response?.data?.message || 'Invalid 6-digit code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIs2FAStep(false);
    setTotpCode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070913] flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mx-auto mb-4">
            {is2FAStep ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {is2FAStep ? 'Two-Factor Authentication' : 'Portfolio CMS'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {is2FAStep
              ? 'Enter the 6-digit code from your Google Authenticator app'
              : 'Sign in to manage your portfolio content'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!is2FAStep ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-600 pl-10 pr-4 py-2.5 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white placeholder-slate-600 pl-10 pr-4 py-2.5 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a2ff] text-slate-950 text-sm font-semibold py-2.5 px-4 hover:bg-[#0091e6] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                  Google Authenticator 6-Digit Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono rounded-xl bg-[#070913] border border-slate-800 text-white placeholder-slate-700 py-3 focus:outline-none focus:border-sky-500 transition-colors font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#00a2ff] text-slate-950 text-sm font-semibold py-2.5 px-4 hover:bg-[#0091e6] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Verify & Access Dashboard <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors py-1 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Password Login
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <Link
              to="/"
              className="text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors inline-flex items-center gap-1"
            >
              &larr; Back to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
