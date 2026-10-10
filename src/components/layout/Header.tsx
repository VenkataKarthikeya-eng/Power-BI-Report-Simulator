'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BarChart3, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Sliders,
  Home,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

import { OnboardingWizard } from '@/components/guided/OnboardingWizard';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check current authenticated user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/studio', label: 'Studio Editor', icon: Sliders },
    { href: '/studio?demo=true', label: 'Explore Demo', icon: BarChart3 },
  ];

  // Helper to extract initials
  const getInitials = (user: User) => {
    const name = user.user_metadata?.full_name;
    if (name && typeof name === 'string') {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const fullName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#e5322d] focus:ring-offset-2 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-lg bg-[#e5322d] flex items-center justify-center text-white shadow-sm group-hover:bg-[#cc241f] transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                  Power BI <span className="text-[#e5322d]">Report Simulator</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-none">
                  Interactive Analytics Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href.includes('?') && pathname === '/studio');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#e5322d] ${
                      isActive
                        ? 'text-[#e5322d] bg-red-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#e5322d]"
                title="Open Power BI Report Simulator Tour Guide"
              >
                <Sparkles className="w-4 h-4 text-[#e5322d]" />
                <span>Tour Guide</span>
              </button>
            </nav>
          </div>

          {/* Right Action & Profile Area */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              /* Authenticated User Menu */
              <div className="relative ml-2 pl-3 border-l border-slate-200" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#e5322d]"
                  aria-expanded={isProfileOpen}
                  aria-label="User account menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#e5322d] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {getInitials(user)}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {fullName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">{fullName}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Authenticated
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/studio"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Sliders className="w-4 h-4 text-slate-400" />
                        <span>My Report Studio</span>
                      </Link>
                      <Link
                        href="/share/demo"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                        <span>Sample Share Page</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Visitors */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#e5322d]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#e5322d] hover:bg-[#cc241f] rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#e5322d] focus:ring-offset-2"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#e5322d]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <Icon className="w-5 h-5 text-slate-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsWizardOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg text-left"
            >
              <Sparkles className="w-5 h-5 text-[#e5322d]" />
              <span>Tour Guide</span>
            </button>
            <div className="pt-3 border-t border-slate-200 space-y-2 px-1">
              {!loading && user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-50 rounded-lg">
                    <p className="text-xs font-bold text-slate-900">{fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-center py-2 px-4 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2 px-4 text-sm font-semibold text-white bg-[#e5322d] hover:bg-[#cc241f] rounded-lg"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tour Guide Modal */}
      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        autoPrompt={false}
      />
    </header>
  );
}
