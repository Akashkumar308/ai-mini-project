
import React, { useState } from 'react';
import { Bike, Mail, Lock, Building, MapPin, ArrowRight, ShieldCheck, UserPlus, LogIn, KeyRound, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onResetPassword: (email: string) => void;
  registeredUsers: User[];
}

type AuthMode = 'login' | 'register' | 'forgot';

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onResetPassword, registeredUsers }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (mode === 'register') {
      if (registeredUsers.some(u => u.email === email)) {
        setError('Email already registered. Please login.');
        return;
      }
      onRegister({ email, password, companyName, companyLocation });
      setSuccess('Registration successful! You can now login.');
      setMode('login');
      setPassword('');
    } else if (mode === 'login') {
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
      }
    } else if (mode === 'forgot') {
      if (registeredUsers.some(u => u.email === email)) {
        onResetPassword(email);
        setSuccess('Password reset link sent to your email.');
      } else {
        setError('Email not found in our records.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-[480px] w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Vyapar-style Header */}
        <div className="p-8 pb-4 text-center bg-white">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100">
              <Bike className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Bike Ledgers</h1>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {mode === 'login' && 'Business Login'}
            {mode === 'register' && 'Create Business Account'}
            {mode === 'forgot' && 'Reset Password'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-600 text-sm font-bold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field - Shared */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Website Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                  placeholder="admin@workshop.com"
                />
              </div>
            </div>

            {/* Password Field - Login/Register */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {/* Registration Specific Fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                      placeholder="e.g. Royal Moto Spares"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-slate-900 font-bold focus:border-indigo-600 outline-none transition-all placeholder:text-slate-300"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : mode === 'register' ? <UserPlus className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            {mode === 'login' ? 'Login to Workshop' : mode === 'register' ? 'Register Business' : 'Send Reset Link'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => { setMode('forgot'); clearMessages(); }} className="text-xs font-bold text-slate-400 hover:text-indigo-600 text-center transition-colors">
                  Forgot Password?
                </button>
                <button type="button" onClick={() => { setMode('register'); clearMessages(); }} className="text-xs font-black text-indigo-600 hover:underline text-center">
                  New Business? Register Here
                </button>
              </>
            )}
            {(mode === 'register' || mode === 'forgot') && (
              <button type="button" onClick={() => { setMode('login'); clearMessages(); }} className="text-xs font-black text-indigo-600 hover:underline text-center">
                Already have an account? Login
              </button>
            )}
          </div>
        </form>

        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Feature working as expected. Secure Storage Active.</p>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] text-slate-400 font-black uppercase tracking-widest">© 2025 Bike Ledgers • Professional Inventory Suite</p>
    </div>
  );
};

export default Login;
