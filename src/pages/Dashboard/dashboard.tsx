// src/pages/Dashboard.tsx
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query"; // ✅ هوک جدید برای چندین درخواست همزمان
import api from "../../utils/api";
import CourseCard from "../../component/UI/courseCard";
import { Loader2, GraduationCap, BookOpen } from "lucide-react";
import type { Course, UserCourse } from "../../types/authtypes";

const Dashboard = () => {
  // ✅ اجرای دو درخواست به صورت موازی با useQueries
  const [enrollmentsQuery, coursesQuery] = useQueries({
    queries: [
      {
        // درخواست اول: دوره‌های ثبت‌نام شده کاربر
        queryKey: ["userCourses"],
        queryFn: async (): Promise<UserCourse[]> => {
          const res = await api.get("/users/courses");
          const rawData = res.data;
          
          if (Array.isArray(rawData)) {
            return rawData;
          } else if (rawData && typeof rawData === "object") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = rawData as any;
            return (
              data.data ||
              data.courses ||
              data.enrollments ||
              data.userCourses ||
              []
            );
          }
          return [];
        },
      },
      {
        // درخواست دوم: لیست تمام دوره‌ها
        queryKey: ["courses"],
        queryFn: async (): Promise<Course[]> => {
          const res = await api.get<Course[]>("/courses");
          return Array.isArray(res.data) ? res.data : [];
        },
      },
    ],
  });

  // استخراج داده‌ها و وضعیت‌ها
  const userCourses = enrollmentsQuery.data || [];
  const courses = coursesQuery.data || [];
  
  const isLoading = enrollmentsQuery.isLoading || coursesQuery.isLoading;
  const hasError = enrollmentsQuery.isError || coursesQuery.isError;
  
  const errorMessage =
    (enrollmentsQuery.error as { response?: { data?: { message?: string } } })
      ?.response?.data?.message ||
    (coursesQuery.error as { response?: { data?: { message?: string } } })
      ?.response?.data?.message ||
    "خطا در دریافت اطلاعات";

  // ✅ ساخت Map با useMemo (فقط وقتی courses تغییر کند)
  const coursesMap = useMemo(() => {
    const map = new Map<string, Course>();
    courses.forEach((course) => {
      map.set(String(course.id), course);
    });
    return map;
  }, [courses]);

  // --- وضعیت‌های رندر ---
  if (isLoading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-xl">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-100 rounded-full">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            داشبورد یادگیری من
          </h1>
          <p className="text-gray-600">مسیر پیشرفت شما در دوره‌های آموزشی</p>
        </div>
      </div>

      {userCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCourses.map((enrollment, index) => {
            // استخراج ایمن شناسه با چندین لایه fallback
            const rawId =
              enrollment.course_id ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (enrollment as any).id ||
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (enrollment as any).courseId;
            const courseIdStr = String(rawId || `fallback-${index}`);

            const course = coursesMap.get(courseIdStr);

            if (!course) {
              return (
                <div
                  key={courseIdStr}
                  className="bg-white p-6 rounded-xl border border-red-200 shadow-sm"
                >
                  <p className="text-red-600 font-bold">
                    دوره با شناسه {courseIdStr} یافت نشد.
                  </p>
                </div>
              );
            }

            return <CourseCard key={courseIdStr} course={course} enrollment={enrollment} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;