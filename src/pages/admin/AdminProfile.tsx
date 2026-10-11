import React, { useState } from 'react';
import { Lock, User, ShieldCheck, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminProfile: React.FC = () => {
  const { admin, changePassword, updateProfile } = useAdminAuth();
  const { success, error } = useToast();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const [email, setEmail] = useState(admin?.email || 'miljar@richpeople.fashion');
  const [savingProfile, setSavingProfile] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      error('New passwords do not match');
      return;
    }
    if (newPass.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    setChangingPass(true);
    const res = await changePassword(currentPass, newPass);
    setChangingPass(false);

    if (res.success) {
      success('Admin password updated successfully');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      error(res.error || 'Failed to update password');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfile({ email });
    setSavingProfile(false);
    if (res.success) {
      success('Admin email updated');
    } else {
      error('Failed to update email');
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="pb-4 border-b border-white/10">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#e11d48] font-bold">
          Credentials & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
          Admin Security Center
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your credentials, root password, and administrator notifications.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-200" />
          <span>Profile Identification</span>
        </h2>

        <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Username (Primary Admin)</label>
            <input
              type="text"
              value={admin?.username || 'Miljar'}
              disabled
              className="w-full px-3.5 py-2.5 rounded bg-zinc-950/80 border border-white/10 text-zinc-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Admin Notification Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-semibold uppercase tracking-wider"
          >
            {savingProfile ? 'Saving...' : 'Update Email'}
          </button>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.08] space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-bold text-white font-cinzel pb-2 border-b border-white/10 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-rose-400" />
          <span>Change Admin Password</span>
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Current Password *</label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="e.g. Miljar12"
              className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">New Secure Password *</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Confirm New Password *</label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={changingPass}
            className="px-6 py-2.5 bg-[#831828] hover:bg-[#991b1b] text-white font-bold rounded uppercase tracking-wider"
          >
            {changingPass ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
