// src/pages/AuthPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query'; // ✅ هوک جدید
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // ✅ Mutation برای ورود
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login({ email, password }),
    onSuccess: () => {
      navigate('/');
    },
  });

  // ✅ Mutation برای ثبت‌نام
  const registerMutation = useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => register({ name, email, password }),
    onSuccess: () => {
      navigate('/');
    },
  });

  // ✅ انتخاب mutation فعال بر اساس حالت فعلی
  const activeMutation = mode === 'login' ? loginMutation : registerMutation;

  // ✅ استخراج وضعیت از mutation
  const isLoading = activeMutation.isPending;
  const error = activeMutation.error;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'login') {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setPassword('');
    // ✅ پاک کردن خطا هنگام تغییر حالت
    loginMutation.reset();
    registerMutation.reset();
  };

  // ✅ استخراج پیام خطا از mutation
  const getErrorMessage = (): string => {
    if (!error) return '';
    
    const errorObj = error as { response?: { data?: { message?: string } } };
    return errorObj?.response?.data?.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-2">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'خوش آمدید!' : 'ایجاد حساب کاربری'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' ? 'برای ادامه وارد شوید' : 'با ما همراه شوید'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-l-lg text-sm">
            {getErrorMessage()}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          
          {/* Name Field (فقط برای ثبت‌نام) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                نام کامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition sm:text-sm"
                  placeholder="علی محمدی"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              آدرس ایمیل
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition sm:text-sm"
                placeholder="example@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                minLength={mode === 'register' ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition sm:text-sm"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                لطفاً صبر کنید...
              </>
            ) : mode === 'login' ? (
              'ورود به حساب'
            ) : (
              'ثبت‌نام و ورود'
            )}
          </button>
        </form>

        {/* Toggle Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          {mode === 'login' ? (
            <p className="text-sm text-gray-600">
              حساب کاربری ندارید؟{' '}
              <button 
                onClick={toggleMode} 
                disabled={isLoading}
                className="font-medium text-blue-600 hover:text-blue-500 transition disabled:opacity-50"
              >
                همین حالا ثبت‌نام کنید
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <button 
                onClick={toggleMode} 
                disabled={isLoading}
                className="font-medium text-blue-600 hover:text-blue-500 transition disabled:opacity-50"
              >
                وارد شوید
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;