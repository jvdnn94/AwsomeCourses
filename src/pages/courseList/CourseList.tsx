// src/pages/CoursesList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../types/authtypes';
import { BookOpen, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/authContext';

const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [enrollingIds, setEnrollingIds] = useState<number[]>([]);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get<Course[]>('/courses');
        setCourses(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || 'خطا در دریافت لیست دوره‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: number) => {
    if (!isAuthenticated) return;

    // اضافه کردن به لیست در حال پردازش برای غیرفعال کردن دکمه
    setEnrollingIds(prev => [...prev, courseId]);

    try {
      await api.post(`/users/courses/${courseId}`);
      alert('✅ با موفقیت در دوره ثبت‌نام کردید!');
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // دریافت پیام خطا از سرور (اگر وجود داشته باشد)
      const serverMessage = err.response?.data?.message || '';
      const statusCode = err.response?.status;

      // یا کد خطا 400 (Conflict) باشد، پیام اختصاصی نمایش میدهد
      if (serverMessage.includes('قبلاً') || serverMessage.includes('already') || statusCode === 400) {
        alert('⚠️ شما قبلاً در این دوره ثبت‌نام کرده‌اید.');
      } else {
        // در غیر این صورت، پیام خود سرور یا یک پیام عمومی را نشان بده
        alert(serverMessage || '❌ خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      // حذف از لیست در حال پردازش (چه موفق باشد چه ناموفق)
      setEnrollingIds(prev => prev.filter(id => id !== courseId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 ml-2" />
        <span className="text-gray-600">در حال بارگذاری دوره‌ها...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-red-50 border border-red-200 p-6 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">کتابخانه دوره‌ها</h1>
          <p className="text-gray-600">
            {isAuthenticated 
              ? 'دوره مورد نظر خود را انتخاب کنید و روی "افزودن به دوره‌های من" کلیک کنید.'
              : 'برای مشاهده جزئیات و ثبت‌نام، ابتدا وارد شوید.'}
          </p>
        </div>
        {!isAuthenticated && (
           <Link to="/auth" className="text-blue-600 hover:underline font-medium">
             ورود / ثبت‌نام
           </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">هنوز دوره‌ای وجود ندارد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolling = enrollingIds.includes(course.id);

            return (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {course.Title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      تاریخ ایجاد: {new Date(course.created_at).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>

                <div className="flex-grow"></div>

                <div className="pt-4 border-t border-gray-100">
                  {isAuthenticated ? (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={isEnrolling}
                      className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          در حال افزودن...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          افزودن به دوره‌های من
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="block w-full bg-gray-100 text-gray-600 text-center py-2.5 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      برای ثبت‌نام، وارد شوید
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesList;