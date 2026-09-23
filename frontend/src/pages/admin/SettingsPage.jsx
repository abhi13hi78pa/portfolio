import React, { useState, useEffect } from 'react';
import {
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Shield,
  ShieldCheck,
  ShieldAlert,
  QrCode,
  Copy,
  Check,
} from 'lucide-react';
import { settingsApi, authApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const SettingsPage = () => {
  const { admin, reloadAdmin } = useAuth();

  const [settingsForm, setSettingsForm] = useState({
    pageTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    faviconUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [settingsMessage, setSettingsMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 2FA Setup State
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [setupCode, setSetupCode] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [twoFactorMessage, setTwoFactorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Disable 2FA State
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableError, setDisableError] = useState('');
  const [disabling, setDisabling] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        setSettingsForm({
          pageTitle: data.pageTitle || '',
          metaDescription: data.metaDescription || '',
          ogTitle: data.ogTitle || '',
          ogDescription: data.ogDescription || '',
          faviconUrl: data.faviconUrl || '',
        });
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      await settingsApi.updateSettings(settingsForm);
      setSettingsMessage('SEO and site settings saved successfully!');
      setTimeout(() => setSettingsMessage(''), 4000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage('Admin password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  // 2FA Setup Flow
  const handleStart2FASetup = async () => {
    setSetupLoading(true);
    setSetupError('');
    try {
      const data = await authApi.generate2FA();
      setQrCodeData(data);
      setShow2FASetup(true);
    } catch (err) {
      console.error('Error generating 2FA:', err);
      alert('Failed to initiate 2FA setup');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleConfirm2FA = async (e) => {
    e.preventDefault();
    setSetupLoading(true);
    setSetupError('');
    try {
      await authApi.enable2FA({ code: setupCode });
      setShow2FASetup(false);
      setSetupCode('');
      setTwoFactorMessage('Google Authenticator 2FA activated successfully!');
      await reloadAdmin();
      setTimeout(() => setTwoFactorMessage(''), 5000);
    } catch (err) {
      setSetupError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleDisable2FA = async (e) => {
    e.preventDefault();
    setDisabling(true);
    setDisableError('');
    try {
      await authApi.disable2FA({ password: disablePassword });
      setShowDisableModal(false);
      setDisablePassword('');
      setTwoFactorMessage('Google Authenticator 2FA has been disabled.');
      await reloadAdmin();
      setTimeout(() => setTwoFactorMessage(''), 5000);
    } catch (err) {
      setDisableError(err.response?.data?.message || 'Failed to disable 2FA. Check your password.');
    } finally {
      setDisabling(false);
    }
  };

  const handleCopySecret = () => {
    if (qrCodeData?.secret) {
      navigator.clipboard.writeText(qrCodeData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    );
  }

  const is2FAEnabled = Boolean(admin?.twoFactorEnabled);

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Settings & Security
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage Google Authenticator 2FA, password, and site SEO metadata.
        </p>
      </div>

      {/* Two-Factor Authentication (Google Authenticator) Card */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                is2FAEnabled
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : 'bg-slate-900 text-sky-400 border border-slate-800'
              }`}
            >
              {is2FAEnabled ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Google Authenticator (2FA)</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    is2FAEnabled
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {is2FAEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {is2FAEnabled
                  ? 'Your account requires a 6-digit TOTP code from Google Authenticator on login.'
                  : 'Add an extra layer of security using Google Authenticator, Authy, or 1Password.'}
              </p>
            </div>
          </div>

          <div>
            {is2FAEnabled ? (
              <button
                onClick={() => setShowDisableModal(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-900/60 hover:bg-rose-900/80 transition-colors"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                onClick={handleStart2FASetup}
                disabled={setupLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
              >
                {setupLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                Set Up Google Authenticator
              </button>
            )}
          </div>
        </div>

        {twoFactorMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{twoFactorMessage}</span>
          </div>
        )}
      </div>

      {/* 2FA Setup Modal */}
      {show2FASetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-sky-400" />
              Scan with Google Authenticator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Open your <strong>Google Authenticator</strong> app on your mobile device, tap <strong>+</strong>, and choose <strong>Scan a QR code</strong>.
            </p>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white mb-4">
              {qrCodeData?.qrCodeUrl && (
                <img
                  src={qrCodeData.qrCodeUrl}
                  alt="2FA QR Code"
                  className="w-48 h-48"
                />
              )}
            </div>

            {/* Manual Entry Key */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Or Enter Code Manually
              </label>
              <div className="flex items-center gap-2 bg-[#070913] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300">
                <span className="truncate flex-1 tracking-wider">{qrCodeData?.secret}</span>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="text-slate-400 hover:text-white"
                  title="Copy secret key"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {setupError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{setupError}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleConfirm2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Enter 6-Digit Code from App
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={setupCode}
                  onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  className="w-full text-center tracking-[0.5em] text-xl font-mono rounded-xl bg-[#070913] border border-slate-800 text-white py-2 focus:outline-none focus:border-sky-500 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShow2FASetup(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={setupLoading || setupCode.length !== 6}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] disabled:opacity-50"
                >
                  {setupLoading ? 'Verifying...' : 'Activate 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0d1322] border border-[#1b253b] rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Disable Two-Factor Authentication
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Please enter your current admin password to confirm disabling Google Authenticator.
            </p>

            {disableError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{disableError}</span>
              </div>
            )}

            <form onSubmit={handleDisable2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={disabling}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50"
                >
                  {disabling ? 'Disabling...' : 'Confirm Disable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO Settings Card */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Globe className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white">SEO & Social Meta</h2>
        </div>

        {settingsMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{settingsMessage}</span>
          </div>
        )}

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Browser Title
            </label>
            <input
              type="text"
              value={settingsForm.pageTitle}
              onChange={(e) => setSettingsForm({ ...settingsForm, pageTitle: e.target.value })}
              placeholder="e.g. John Doe | Full Stack Engineer"
              className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Meta Description
            </label>
            <textarea
              value={settingsForm.metaDescription}
              onChange={(e) => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
              rows={3}
              placeholder="Brief description for Google search results..."
              className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Open Graph Title
              </label>
              <input
                type="text"
                value={settingsForm.ogTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, ogTitle: e.target.value })}
                placeholder="Title shown when sharing on LinkedIn/Twitter"
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Open Graph Description
              </label>
              <input
                type="text"
                value={settingsForm.ogDescription}
                onChange={(e) => setSettingsForm({ ...settingsForm, ogDescription: e.target.value })}
                placeholder="Description preview on social platforms"
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/10"
          >
            {savingSettings ? 'Saving...' : 'Save SEO Settings'}
          </button>
        </form>
      </div>

      {/* Admin Security / Password Change */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <Lock className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white">Change Admin Password</h2>
        </div>

        {passwordMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordMessage}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full rounded-xl bg-[#070913] border border-slate-800 text-sm text-white px-3.5 py-2 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#141d33] border border-[#1e2a47] text-white hover:bg-[#1a2644] disabled:opacity-50 cursor-pointer"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
