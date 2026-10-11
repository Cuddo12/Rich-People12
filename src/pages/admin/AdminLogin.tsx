import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminLoginProps {
  navigate: (route: string, params?: any) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate }) => {
  const [username, setUsername] = useState('1234');
  const [password, setPassword] = useState('224455');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAdminAuth();
  const { success } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      success('Authenticated successfully. Welcome to Rich People Control Panel.');
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#111116] rounded-2xl border border-white/10 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-[#831828]/20 text-rose-400 border border-[#831828]/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/30">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-cinzel font-bold text-white tracking-wider">
            Rich People Command Portal
          </h1>
          <p className="text-xs text-zinc-400">
            Secure administrative control & payment verification
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Admin Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. Miljar)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                required
              />
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-950 border border-white/15 text-white focus:outline-none focus:border-white/40"
                required
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#831828] hover:bg-[#991b1b] text-white text-xs font-bold uppercase tracking-[0.18em] rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
