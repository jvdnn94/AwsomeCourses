// src/pages/AdminPanel.tsx
import { useState, useEffect } from "react";
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
  const [courses, setCourses] = useState<Course[]>([]);
  // ✅ مقدار اولیه loading را true می‌گذاریم تا نیازی به setLoading(true) در effect نباشد
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ✅ الگوی استاندارد React 19: تمام setStateها بعد از await
  useEffect(() => {
    let isMounted = true; // جلوگیری از setState بعد از unmount

    const fetchCourses = async () => {
      try {
        // ✅ هیچ setState قبل از await نیست!
        const res = await api.get<Course[]>("/courses");

        // ✅ تمام setStateها بعد از await و با چک isMounted
        if (!isMounted) return;

        if (Array.isArray(res.data)) {
          setCourses(res.data);
        } else {
          setCourses([]);
        }
        setError("");
      } catch (err: unknown) {
        if (!isMounted) return;

        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(
          errorObj?.response?.data?.message || "خطا در دریافت لیست دوره‌ها",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    // Cleanup function: جلوگیری از memory leak
    return () => {
      isMounted = false;
    };
  }, []);

  // هندلر حذف دوره
  const handleDelete = async (id: number, courseTitle: string) => {
    if (
      !window.confirm(
        `آیا از حذف دوره "${courseTitle}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`,
      )
    ) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj?.response?.data?.message || "خطا در حذف دوره";
      alert(`❌ ${errorMessage}`);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("لطفاً عنوان دوره را وارد کنید.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && currentCourseId) {
        await api.put(`/courses/${currentCourseId}`, { Title: title });
      } else {
        await api.post("/courses", { Title: title });
      }

      setTitle("");
      setCurrentCourseId(null);
      setIsEditing(false);
      setActiveTab("list");

      // رفرش لیست با الگوی React 19
      const res = await api.get<Course[]>("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj?.response?.data?.message || "خطا در ذخیره‌سازی";
      alert(`❌ ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  // هندلر "تلاش مجدد" - بدون setState قبل از await
  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await api.get<Course[]>("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(
        errorObj?.response?.data?.message || "خطا در دریافت لیست دوره‌ها",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
        <span className="text-gray-600">در حال بارگذاری پنل مدیریت...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
          <span className="font-bold">خطا:</span> {error}
          <button
            onClick={handleRetry}
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
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="حذف دوره"
                    >
                      <Trash2 size={18} />
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
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {submitting ? (
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
