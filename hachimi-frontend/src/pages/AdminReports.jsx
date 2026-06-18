import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminReports = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi lấy thống kê:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-[#FAFAFA] text-slate-900 text-base min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ==================== HEADER ==================== */}
      <header className="bg-white border-b border-slate-200 w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-8 py-5 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Medical Research Platform</span>
            </div>
            <nav className="hidden md:flex items-center gap-10">
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/">Trang chủ</Link>
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/admin/dashboard">Quản lý</Link>
              {/* Active Header Link */}
              <Link className="text-[#0052CC] border-b-2 border-[#0052CC] transition-colors text-lg font-bold pb-1" to="/admin/reports">Báo cáo</Link>
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden sm:block">
              <input
                className="pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base font-medium focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] w-72 transition-all"
                placeholder="Tìm kiếm báo cáo..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-[#0052CC] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700 hidden sm:block">{user.username}</span>
                </Link>
                <button onClick={logout} className="text-slate-500 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50" title="Đăng xuất">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-6 py-3 text-base font-bold text-slate-700 hover:text-[#0052CC] transition-colors">Đăng nhập</Link>
                <Link to="/register" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-base font-bold hover:bg-[#0052CC] transition-colors shadow-sm">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ==================== BODY CONTAINER ==================== */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        
        {/* ==================== SIDEBAR ==================== */}
        <aside className="w-72 bg-[#FAFAFA] border-r border-slate-200 hidden lg:flex flex-col py-8 shrink-0 h-[calc(100vh-89px)] sticky top-[89px]">
          <nav className="flex-1 px-6 space-y-3">
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/dashboard">
              <span className="material-symbols-outlined text-[26px]">dashboard</span>
              Tổng quan
            </Link>
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/users">
              <span className="material-symbols-outlined text-[26px]">group</span>
              Người dùng
            </Link>

            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/permissions">
              <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
              Quyền truy cập
            </Link>
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/settings">
              <span className="material-symbols-outlined text-[26px]">settings</span>
              Cài đặt
            </Link>
          </nav>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 px-8 lg:px-16 xl:px-24 py-12 flex flex-col gap-14 overflow-y-auto">
          
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8 w-full">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Báo cáo & Phân tích</h1>
              <p className="text-xl text-slate-600">Tổng hợp dữ liệu và xuất báo cáo hiệu suất hệ thống.</p>
            </div>
            
            <div className="flex gap-4 mt-2">
              <button className="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-[#0052CC] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Xuất tất cả (PDF)
              </button>
            </div>
          </section>

          <hr className="border-t border-slate-200" />

          {loading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-10 w-10 text-[#0052CC]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : stats ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full pb-10">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0052CC] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">group</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Tổng Người dùng</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_users}</span>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">medication</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Tổng số Thuốc</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_drugs}</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">coronavirus</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Tổng số Bệnh lý</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_diseases}</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">analytics</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Tổng lượt Dự đoán cặp</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_predictions}</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">compare_arrows</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Cặp Tương tác thuốc</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_interactions}</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[32px]">history</span>
                </div>
                <h3 className="text-lg font-bold text-slate-600 mb-2">Lịch sử Lọc của người dùng</h3>
                <span className="text-4xl font-black text-slate-900">{stats.total_history}</span>
              </div>
            </section>
          ) : (
            <div className="text-center py-20 text-rose-600 font-bold">Lỗi không thể tải dữ liệu thống kê.</div>
          )}
        </main>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">Medical Research Platform</h3>
              <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">Dự án phục vụ mục đích nghiên cứu và học tập.</p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 mb-2">Hachimi Team</h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">Dự án ứng dụng AI, Machine Learning và công nghệ Y sinh.</p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-bold text-slate-900 mb-2">Liên hệ</h4>
              <p className="text-sm text-slate-600">Email: hachimi.team@example.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminReports;
