import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Percent,
  Star,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  MoreVertical,
  ChevronRight,
  X,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Boxes
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'coupons'
  | 'reviews'
  | 'messages'
  | 'settings'
  | 'reports'
  | 'profile';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  navigate: (route: string, params?: any) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  navigate,
  children,
}) => {
  const { admin, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders & Payments', icon: Package },
    { id: 'products' as AdminTab, label: 'Products Catalog', icon: ShoppingBag },
    { id: 'inventory' as AdminTab, label: 'Stock & Inventory', icon: Boxes },
    { id: 'categories' as AdminTab, label: 'Categories & Drops', icon: Layers },
    { id: 'coupons' as AdminTab, label: 'Coupons & Offers', icon: Percent },
    { id: 'reviews' as AdminTab, label: 'Client Reviews', icon: Star },
    { id: 'messages' as AdminTab, label: 'Concierge Messages', icon: MessageSquare },
    { id: 'reports' as AdminTab, label: 'Reports & CSV', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Site & bKash Settings', icon: Settings },
    { id: 'profile' as AdminTab, label: 'Admin Security', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0c0c10] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center ${
              mobileMenuOpen
                ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white/60'
                : 'text-zinc-300 hover:text-white hover:bg-white/10 active:bg-white active:text-zinc-950'
            }`}
            aria-label="3-dot admin menu"
            title="3-dot Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <span className="font-cinzel font-bold text-lg text-white">RICH PEOPLE ADMIN</span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0c0c10] border-r border-white/10 flex-col justify-between shrink-0 h-screen sticky top-0 p-5 overflow-y-auto">
        <div className="space-y-6">
          {/* Brand lockup */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="font-cinzel text-xl font-bold tracking-widest text-white">
                RICH PEOPLE
              </span>
              <span className="text-[10px] text-[#e11d48] font-mono tracking-widest block uppercase font-bold">
                Atelier Console
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-400">
              Live
            </span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors font-medium text-left ${
                    isActive
                      ? 'bg-[#831828] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User bar & Actions */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-zinc-400 text-[11px] block">Logged in as</span>
              <strong className="text-white truncate block">{admin?.username || 'Miljar'}</strong>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-zinc-400 hover:text-white p-1"
              title="Visit Storefront"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/admin');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs border border-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile 3-Dot All-White Menu Interface */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white text-zinc-900 overflow-y-auto flex flex-col justify-between p-6 animate-in fade-in duration-200">
          <div>
            <div className="flex justify-between items-center pb-5 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-zinc-900 text-white shadow-sm flex items-center justify-center" title="3-dot Menu Active">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-cinzel text-xl font-bold tracking-widest text-zinc-950 block">
                    RICH PEOPLE
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    Admin Atelier Console
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 hover:border-zinc-900 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors text-xs font-semibold"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-6 space-y-1.5 text-xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[#831828] text-white font-bold shadow-sm'
                        : 'text-zinc-800 hover:bg-zinc-100 border border-transparent hover:border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-zinc-200 space-y-3">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border border-zinc-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/admin');
              }}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Console</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
