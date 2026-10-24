// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { 
  BookOpen,  
  ArrowLeft, 
  Users, 
  Sparkles, 
  TrendingUp,
  Award,
  CheckCircle2,
  PlayCircle,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* 🎨 Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Badge / Tagline */}
          <div className="flex justify-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-blue-200 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">
                بیش از ۱۰,۰۰۰ دانشجوی فعال
              </span>
              <div className="flex -space-x-2 space-x-reverse">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                یادگیری
              </span>
              <span className="text-gray-900"> را </span>
              <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10 text-gray-900">متحول</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300/60 -z-0 rounded-sm"></span>
              </span>
              <span className="text-gray-900"> کنید</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              با <span className="font-bold text-gray-900">AwesomeCourses</span>، به بهترین دوره‌های آموزشی دسترسی پیدا کنید،
              مهارت‌های جدید کسب کنید و آینده شغلی خود را بسازید.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-400">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/auth" 
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    شروع رایگان
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <Link 
                  to="/courses" 
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <PlayCircle className="w-5 h-5 ml-2 text-blue-600" />
                  مشاهده دوره‌ها
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    ادامه یادگیری
                    <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <Link 
                  to="/courses" 
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <BookOpen className="w-5 h-5 ml-2 text-purple-600" />
                  کشف دوره‌های جدید
                </Link>
              </>
            )}
          </div>

          {/* ========== STATS BAR ========== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
            {[
              { value: '۵۰+', label: 'دوره آموزشی', icon: BookOpen, color: 'text-blue-600' },
              { value: '۱۰K+', label: 'دانشجوی فعال', icon: Users, color: 'text-purple-600' },
              { value: '۹۸٪', label: 'رضایت کاربران', icon: Award, color: 'text-green-600' },
              { value: '۲۴/۷', label: 'پشتیبانی آنلاین', icon: TrendingUp, color: 'text-pink-600' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="group p-4 md:p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-2 group-hover:scale-110 transition-transform`} />
                <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              چرا AwesomeCourses؟
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              همه چیز برای <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">موفقیت شما</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ما بهترین ابزارها و منابع را برای یادگیری مؤثر در اختیار شما قرار می‌دهیم
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Feature 1 */}
            <div className="group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity -translate-y-16 translate-x-16 group-hover:translate-x-8 group-hover:-translate-y-8 duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  دوره‌های تخصصی
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  از برنامه‌نویسی وب تا هوش مصنوعی، دوره‌های متنوعی برای هر سطحی از مهارت فراهم کرده‌ایم.
                </p>
                
                <ul className="space-y-2">
                  {['محتوای به‌روز', 'پروژه‌های عملی', 'مدرک معتبر'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity -translate-y-16 translate-x-16 group-hover:translate-x-8 group-hover:-translate-y-8 duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  پیشرفت هوشمند
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  با داشبورد تحلیلی ما، وضعیت یادگیری خود را لحظه‌به‌لحظه دنبال کنید و اهداف خود را دستیابی کنید.
                </p>
                
                <ul className="space-y-2">
                  {['داشبورد شخصی', 'آمار پیشرفت', 'یادآوری هوشمند'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 group-hover:opacity-20 transition-opacity -translate-y-16 translate-x-16 group-hover:translate-x-8 group-hover:-translate-y-8 duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  جامعه فعال
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  با هزاران یادگیرنده دیگر ارتباط برقرار کنید، تجربه به اشتراک بگذارید و با هم رشد کنید.
                </p>
                
                <ul className="space-y-2">
                  {['فروم تخصصی', 'گروه‌های مطالعاتی', 'جلسات آنلاین'].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== TESTIMONIAL SECTION ========== */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative text-center text-white">
              {/* Quote Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Star className="w-8 h-8 text-yellow-300 fill-current" />
              </div>

              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                "AwesomeCourses مسیر شغلی من را تغییر داد. با دوره‌های عالی و پشتیبانی فوق‌العاده، 
                توانستم مهارت‌های جدیدی یاد بگیرم و شغل رویایی‌ام را به دست بیاورم."
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  م
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">مریم احمدی</div>
                  <div className="text-white/80 text-sm">توسعه‌دهنده Frontend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">
            آماده شروع <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">سفر یادگیری</span> هستید؟
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            همین امروز به جمع هزاران دانشجوی موفق بپیوندید و آینده خود را بسازید
          </p>
          
          {!isAuthenticated && (
            <Link 
              to="/auth" 
              className="group inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              شروع رایگان — بدون نیاز به کارت اعتباری
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>

      {/* 🎨 CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>

    </div>
  );
};

export default LandingPage;