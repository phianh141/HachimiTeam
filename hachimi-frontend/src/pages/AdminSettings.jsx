import React from 'react';
import { Link } from 'react-router-dom';

const AdminSettings = () => {
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
            <Link to="/login" className="px-6 py-3 text-base font-bold text-slate-700 hover:text-[#0052CC] transition-colors">Đăng nhập</Link>
            <Link to="/register" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-base font-bold hover:bg-[#0052CC] transition-colors shadow-sm">Đăng ký</Link>
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
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/reports">
              <span className="material-symbols-outlined text-[26px]">analytics</span>
              Báo cáo
            </Link>
            {/* Active Tab */}
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#0052CC] text-white font-bold text-base shadow-md" to="/admin/settings">
              <span className="material-symbols-outlined text-[26px]">settings</span>
              Cài đặt
            </Link>
          </nav>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 px-8 lg:px-16 xl:px-24 py-12 flex flex-col gap-14 overflow-y-auto">
          
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8 w-full">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Cài đặt Hệ thống</h1>
              <p className="text-xl text-slate-600">Điều chỉnh thông số cấu hình và tùy chọn bảo trì.</p>
            </div>
          </section>

          <hr className="border-t border-slate-200" />

          {/* Settings Content */}
          <section className="flex flex-col gap-8 w-full pb-10 max-w-3xl">
            
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-slate-900 pb-4 border-b border-slate-200">Thông tin dự án</h3>
              
              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-900">Tên hệ thống</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                  defaultValue="Medical Research Platform"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-bold text-slate-900">Email liên hệ (Hỗ trợ)</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                  defaultValue="support@hachimi.team"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-slate-900 pb-4 border-b border-slate-200">Chế độ bảo trì</h3>
              
              <div className="flex items-center justify-between p-4 border border-rose-200 bg-rose-50 rounded-xl">
                <div>
                  <h4 className="font-bold text-rose-900 text-lg">Bật chế độ bảo trì</h4>
                  <p className="text-rose-700 text-sm mt-1">Ngăn người dùng mới truy cập hệ thống để tiến hành nâng cấp.</p>
                </div>
                {/* Toggle switch mock */}
                <div className="w-14 h-8 bg-slate-300 rounded-full p-1 cursor-pointer flex items-center">
                  <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button className="px-8 py-4 bg-[#0052CC] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                Lưu cài đặt
              </button>
            </div>

          </section>
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

export default AdminSettings;
