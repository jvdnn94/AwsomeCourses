// src/pages/CoursesList.tsx
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // ✅ هوک‌های جدید
import type { Course } from '../../types/authtypes';
import { BookOpen, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/authContext';

const CoursesList = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient(); // ✅ برای پاک کردن کش بعد از ثبت‌نام

  // ✅ ۱. دریافت لیست دوره‌ها با useQuery
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get<Course[]>('/courses');
      return response.data;
    },
  });

  // ✅ ۲. ثبت‌نام در دوره با useMutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: number) => api.post(`/users/courses/${courseId}`),
    onSuccess: () => {
      alert('✅ با موفقیت در دوره ثبت‌نام کردید!');
      // ✅ بعد از ثبت‌نام موفق، کش دوره‌های کاربر را نامعتبر کن
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
    },
    onError: (err: unknown) => {
      const errorObj = err as { response?: { data?: { message?: string }; status?: number } };
      const serverMessage = errorObj?.response?.data?.message || '';
      const statusCode = errorObj?.response?.status;

      if (
        serverMessage.includes('قبلاً') ||
        serverMessage.includes('already') ||
        statusCode === 409 ||
        statusCode === 400
      ) {
        alert('⚠️ شما قبلاً در این دوره ثبت‌نام کرده‌اید.');
      } else {
        alert(serverMessage || '❌ خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.');
      }
    },
  });

  // ✅ هندلر ثبت‌نام ساده‌تر
  const handleEnroll = (courseId: number) => {
    if (!isAuthenticated) return;
    enrollMutation.mutate(courseId);
  };

  // ✅ تشخیص اینکه کدام دکمه در حال لودینگ است
  const isEnrolling = (courseId: number) =>
    enrollMutation.isPending && enrollMutation.variables === courseId;

  // --- رندر ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 ml-2" />
        <span className="text-gray-600">در حال بارگذاری دوره‌ها...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-red-50 border border-red-200 p-6 rounded-xl text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-medium">
          {error instanceof Error ? error.message : 'خطا در دریافت لیست دوره‌ها'}
        </p>
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
            const enrollingThisCourse = isEnrolling(course.id);

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
                      disabled={enrollingThisCourse}
                      className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrollingThisCourse ? (
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