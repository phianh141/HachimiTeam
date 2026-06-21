import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    total_drugs: 0,
    total_predictions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê:', err);
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
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/">Trang chủ</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/interactions">Tương tác</Link>
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden sm:block">
              <input
                className="pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base font-medium focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] w-72 transition-all"
                placeholder="Tìm kiếm..."
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
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#0052CC] text-white font-bold text-base shadow-md" to="/admin/dashboard">
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
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/reports">
              <span className="material-symbols-outlined text-[26px]">analytics</span>
              Báo cáo
            </Link>
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/settings">
              <span className="material-symbols-outlined text-[26px]">settings</span>
              Cài đặt
            </Link>
          </nav>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 px-8 lg:px-16 xl:px-20 py-12 overflow-y-auto">

          {/* Header Title */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Tổng quan Admin</h1>
            <p className="text-xl text-slate-600">Theo dõi nhanh các chỉ số quan trọng của hệ thống theo thời gian thực.</p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">

            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#0052CC] hover:shadow-md transition-all group cursor-default">
              <div className="flex justify-between items-start mb-6">
                <span className="text-base font-bold text-slate-600">Tổng người dùng</span>
                <span className="material-symbols-outlined text-[28px] text-slate-400 group-hover:text-[#0052CC] transition-colors">group</span>
              </div>
              <div className="text-[40px] font-black text-slate-900 mb-4 tracking-tight">
                {loading ? "..." : stats.total_users.toLocaleString()}
              </div>
              <div className="text-base font-bold text-slate-400 flex items-center gap-2">
                Cập nhật theo thời gian thực
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#0052CC] hover:shadow-md transition-all group cursor-default">
              <div className="flex justify-between items-start mb-6">
                <span className="text-base font-bold text-slate-600">Đang hoạt động</span>
                <span className="material-symbols-outlined text-[28px] text-slate-400 group-hover:text-[#0052CC] transition-colors">moving</span>
              </div>
              <div className="text-[40px] font-black text-slate-900 mb-4 tracking-tight">
                {loading ? "..." : stats.active_users.toLocaleString()}
              </div>
              <div className="text-base font-bold text-slate-400 flex items-center gap-2">
                Tài khoản không bị khóa
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#0052CC] hover:shadow-md transition-all group cursor-default">
              <div className="flex justify-between items-start mb-6">
                <span className="text-base font-bold text-slate-600">Tổng số thuốc</span>
                <span className="material-symbols-outlined text-[28px] text-slate-400 group-hover:text-[#0052CC] transition-colors">medication</span>
              </div>
              <div className="text-[40px] font-black text-slate-900 mb-4 tracking-tight">
                {loading ? "..." : stats.total_drugs.toLocaleString()}
              </div>
              <div className="text-base font-bold text-slate-400 flex items-center gap-2">
                Dữ liệu có trong hệ thống
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 hover:border-[#0052CC] hover:shadow-md transition-all group cursor-default">
              <div className="flex justify-between items-start mb-6">
                <span className="text-base font-bold text-slate-600">Tổng số lượt dự đoán</span>
                <span className="material-symbols-outlined text-[28px] text-slate-400 group-hover:text-[#0052CC] transition-colors">analytics</span>
              </div>
              <div className="text-[40px] font-black text-slate-900 mb-4 tracking-tight">
                {loading ? "..." : stats.total_predictions.toLocaleString()}
              </div>
              <div className="text-base font-bold text-slate-400 flex items-center gap-2">
                Kết quả đã phân tích
              </div>
            </div>

          </div>

          {/* Chart Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <h2 className="text-3xl font-bold text-slate-900">Biểu đồ cột - Lượt dự đoán theo ngày</h2>
              <span className="text-base text-slate-500 font-medium">Biểu đồ minh họa (placeholder)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 h-[450px] flex flex-col relative shadow-sm">
              {/* Y Axis Labels */}
              <div className="absolute left-6 top-10 bottom-16 flex flex-col justify-between text-sm font-bold text-slate-500 text-right w-12">
                <span>10k</span>
                <span>8k</span>
                <span>6k</span>
                <span>4k</span>
                <span>2k</span>
                <span>0</span>
              </div>
              {/* Y Axis Title */}
              <div className="absolute left-[-20px] top-1/2 -rotate-90 text-sm font-bold text-slate-400 uppercase tracking-wider">Số lượt</div>

              {/* Chart Grid and Bars */}
              <div className="ml-20 flex-1 border-b border-l border-slate-200 flex items-end justify-around pb-0 relative">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between z-0 opacity-40">
                  <div className="border-t border-slate-300 w-full"></div>
                  <div className="border-t border-slate-300 w-full"></div>
                  <div className="border-t border-slate-300 w-full"></div>
                  <div className="border-t border-slate-300 w-full"></div>
                  <div className="border-t border-slate-300 w-full"></div>
                  <div className="border-t border-slate-300 w-full"></div>
                </div>

                {/* Bars */}
                <div className="w-10 sm:w-16 bg-slate-500 h-[30%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">3,000</div>
                </div>
                <div className="w-10 sm:w-16 bg-slate-500 h-[50%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">5,000</div>
                </div>
                <div className="w-10 sm:w-16 bg-slate-500 h-[45%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">4,500</div>
                </div>
                <div className="w-10 sm:w-16 bg-slate-500 h-[70%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">7,000</div>
                </div>
                <div className="w-10 sm:w-16 bg-slate-500 h-[65%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">6,500</div>
                </div>

                <div className="w-10 sm:w-16 bg-slate-500 h-[90%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">9,000</div>
                </div>

                <div className="w-10 sm:w-16 bg-slate-500 h-[80%] rounded-t-lg z-10 hover:bg-[#0052CC] transition-colors relative group">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">8,000</div>
                </div>
              </div>

              {/* X Axis Labels */}
              <div className="ml-20 mt-4 flex justify-around text-sm font-bold text-slate-500">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>
              {/* X Axis Title */}
              <div className="text-center mt-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Ngày</div>
            </div>
          </div>

        </main>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Medical Research Platform
              </h3>
              <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">
                Dự án phục vụ mục đích nghiên cứu và học tập.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 mb-2">
                Hachimi Team
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Dự án ứng dụng AI, Machine Learning và công nghệ Y sinh.
              </p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-bold text-slate-900 mb-2">
                Liên hệ
              </h4>
              <p className="text-sm text-slate-600">
                Email: hachimi.team@example.com
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;