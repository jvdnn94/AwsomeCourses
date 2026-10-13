// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';

import { BookOpen, GraduationCap, ArrowLeft, Users} from 'lucide-react';
import { useAuth } from '../../context/authContext';


const LandingPage = () => {
  const { isAuthenticated } = useAuth();
   

 

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center space-y-8 animate-fade-in-up">
      
      {/* آیکون اصلی */}
      <div className="bg-blue-100 p-6 rounded-full shadow-inner">
        <GraduationCap className="w-16 h-16 text-blue-600" />
      </div>

       

      {/* عنوان و توضیح */}
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          به AwesomeCourses خوش آمدید
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          پلتفرم یادگیری آنلاین ما، دسترسی آسان به بهترین دوره‌های آموزشی را برای شما فراهم می‌کند.
          مهارت‌های جدید کسب کنید، پیشرفت خود را دنبال نمایید و در جامعه‌ای از یادگیرندگان عضو شوید.
        </p>
      </div>

      {/* دکمه‌های اقدام (Call to Action) */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        
        {/* اگر کاربر لاگین نیست */}
        {!isAuthenticated ? (
          <>
            <Link 
              to="/auth" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              شروع کنید / ورود
              <ArrowLeft className="mr-2 w-5 h-5 rotate-180" />
            </Link>
            
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm"
            >
              مشاهده دوره‌ها
              <BookOpen className="mr-2 w-5 h-5" />
            </Link>
          </>
        ) : (
          /* اگر کاربر لاگین است */
          <>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              رفتن به داشبورد من
              <Users className="mr-2 w-5 h-5" />
            </Link>
            
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              مرور دوره‌های جدید
              <BookOpen className="mr-2 w-5 h-5" />
            </Link>
          </>
        )}
      </div>

      {/* ویژگی‌های کوتاه (اختیاری برای زیبایی بیشتر) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl w-full">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-blue-600 mb-3"><BookOpen size={32}/></div>
          <h3 className="font-bold text-gray-800 mb-2">دوره‌های متنوع</h3>
          <p className="text-sm text-gray-600">از برنامه‌نویسی تا طراحی، هر آنچه نیاز دارید.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-green-600 mb-3"><GraduationCap size={32}/></div>
          <h3 className="font-bold text-gray-800 mb-2">پیشرفت مستمر</h3>
          <p className="text-sm text-gray-600">وضعیت یادگیری خود را لحظه‌به‌لحظه ببینید.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-purple-600 mb-3"><Users size={32}/></div>
          <h3 className="font-bold text-gray-800 mb-2">جامعه فعال</h3>
          <p className="text-sm text-gray-600">با هزاران دانشجو دیگر هم‌قدم شوید.</p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;