// src/pages/AdminPanel.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ هوک‌های جدید
import api from "../../utils/api";
import type { Course } from "../../types/authtypes";
import {
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  BookOpen,
  List,
  Calendar,
} from "lucide-react";

const AdminPanel = () => {
  // ✅ دریافت نمونه QueryClient برای مدیریت کش
  const queryClient = useQueryClient();

  // Stateهای مدیریت نمایش و فرم (بدون تغییر)
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");

  // ✅ ۱. دریافت داده‌ها با useQuery (جایگزین useState + useEffect)
  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch, // ✅ تابعی برای رفرش دستی (جایگزین handleRetry)
  } = useQuery({
    queryKey: ["courses"], // شناسه یکتا برای کش
    queryFn: async () => {
      const res = await api.get<Course[]>("/courses");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // ✅ ۲. مدیریت حذف با useMutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/courses/${id}`),
    onSuccess: () => {
      // ✅ جادوی TanStack Query: بعد از حذف موفق، کش را نامعتبر کن تا داده جدید بگیرد
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: unknown) => {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${errorObj?.response?.data?.message || "خطا در حذف دوره"}`);
    },
  });

  // ✅ ۳. مدیریت ایجاد/ویرایش با useMutation
  const saveMutation = useMutation({
    mutationFn: async ({ id, title }: { id: number | null; title: string }) => {
      if (id) {
        return api.put(`/courses/${id}`, { Title: title });
      } else {
        return api.post("/courses", { Title: title });
      }
    },
    onSuccess: () => {
      // ✅ بعد از ذخیره موفق، کش را نامعتبر کن
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      
      // ریست کردن فرم و بازگشت به تب لیست
      setTitle("");
      setCurrentCourseId(null);
      setIsEditing(false);
      setActiveTab("list");
    },
    onError: (err: unknown) => {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(`❌ ${errorObj?.response?.data?.message || "خطا در ذخیره‌سازی"}`);
    },
  });

  // --- هندلرها ---

  const handleDelete = (id: number, courseTitle: string) => {
    if (
      !window.confirm(
        `آیا از حذف دوره "${courseTitle}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`
      )
    ) {
      return;
    }
    // ✅ اجرای Mutation به جای await api.delete
    deleteMutation.mutate(id);
  };

  const handleEditClick = (course: Course) => {
    setCurrentCourseId(course.id);
    setTitle(course.Title);
    setIsEditing(true);
    setActiveTab("form");
  };

  const handleCreateClick = () => {
    setCurrentCourseId(null);
    setTitle("");
    setIsEditing(false);
    setActiveTab("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("لطفاً عنوان دوره را وارد کنید.");
      return;
    }
    // ✅ اجرای Mutation به جای منطق دستی try/catch
    saveMutation.mutate({ id: currentCourseId, title });
  };

  // --- رندر ---

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <span className="text-gray-600">در حال بارگذاری پنل مدیریت...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            پنل مدیریت دوره‌ها
          </h1>
          <p className="text-gray-600 mt-1">
            مدیریت، ایجاد و ویرایش محتوای آموزشی پلتفرم
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => {
              setActiveTab("list");
              setIsEditing(false);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <List size={18} />
            لیست دوره‌ها
          </button>
          <button
            onClick={handleCreateClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "form"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Plus size={18} />
            {isEditing ? "ویرایش دوره" : "دوره جدید"}
          </button>
        </div>
      </div>

      {/* ✅ نمایش خطا با قابلیت رفرش از طریق useQuery */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <span className="font-bold">خطا:</span>{" "}
          {error instanceof Error ? error.message : "خطای ناشناخته"}
          <button
            onClick={() => refetch()} // ✅ استفاده از refetch داخلی
            className="mr-auto text-sm underline hover:text-red-900"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {activeTab === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                هنوز هیچ دوره‌ای در سیستم ثبت نشده است.
              </p>
              <button
                onClick={handleCreateClick}
                className="mt-4 text-blue-600 font-medium hover:underline"
              >
                اولین دوره را بسازید
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="ویرایش دوره"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.Title)}
                      disabled={deleteMutation.isPending} // ✅ غیرفعال شدن خودکار حین حذف
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="حذف دوره"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 flex-grow">
                  {course.Title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                  <Calendar size={14} />
                  <span>
                    {new Date(course.created_at).toLocaleDateString("fa-IR")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {isEditing ? (
                  <Edit3 size={20} className="text-blue-600" />
                ) : (
                  <Plus size={20} className="text-green-600" />
                )}
                {isEditing ? "ویرایش اطلاعات دوره" : "ایجاد دوره جدید"}
              </h2>
              <button
                onClick={() => setActiveTab("list")}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition"
                title="بازگشت به لیست"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  عنوان دوره <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: آموزش جامع React.js از مقدماتی تا پیشرفته"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 placeholder-gray-400"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending} // ✅ غیرفعال شدن خودکار حین ارسال
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {isEditing ? "ذخیره تغییرات" : "ایجاد دوره"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;