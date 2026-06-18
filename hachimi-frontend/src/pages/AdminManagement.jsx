import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminManagement = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Lỗi lấy danh sách user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;

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
              <Link className="text-[#0052CC] border-b-2 border-[#0052CC] transition-colors text-lg font-bold pb-1" to="/admin/dashboard">Quản lý</Link>
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/admin/reports">Báo cáo</Link>
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
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-base" to="/admin/dashboard">
              <span className="material-symbols-outlined text-[26px]">dashboard</span>
              Tổng quan
            </Link>
            {/* Active Tab */}
            <Link className="flex items-center gap-4 px-6 py-4 rounded-xl bg-[#0052CC] text-white font-bold text-base shadow-md" to="/admin/users">
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
          
          {/* 1. Header Section */}
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8 w-full">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Quản lý Người dùng</h1>
              <p className="text-xl text-slate-600">Quản lý tài khoản, vai trò và trạng thái hệ thống.</p>
            </div>
            
            <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-full flex items-center px-5 py-3 shadow-sm hover:shadow focus-within:ring-2 focus-within:ring-[#0052CC] focus-within:border-[#0052CC] transition-all">
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-base text-slate-900 placeholder:text-slate-400 outline-none" 
                placeholder="Tìm kiếm người dùng qua tên, email hoặc ID..." 
                type="text"
              />
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <button className="px-6 py-3.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Xuất danh sách
              </button>
              <button className="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-[#0052CC] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Thêm người dùng
              </button>
            </div>
          </section>

          <hr className="border-t border-slate-200" />

          {/* 2. Filters Section */}
          <section className="flex flex-col items-center gap-8 max-w-4xl mx-auto w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bộ lọc</h2>
              <p className="text-base text-slate-600">Tùy chọn nhanh để thu hẹp kết quả tìm kiếm.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="flex flex-col gap-2.5">
                <label className="font-bold text-slate-900">Vai trò</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-5 py-4 pr-12 text-base text-slate-700 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] shadow-sm cursor-pointer outline-none">
                    <option disabled selected value="">Chọn vai trò</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Nhân viên</option>
                    <option value="guest">Khách</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <span className="text-sm text-slate-500">VD: Admin, Nhân viên, Khách</span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <label className="font-bold text-slate-900">Trạng thái</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-5 py-4 pr-12 text-base text-slate-700 focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] shadow-sm cursor-pointer outline-none">
                    <option disabled selected value="">Chọn trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="locked">Tạm khóa</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <span className="text-sm text-slate-500">VD: Hoạt động, Tạm khóa</span>
              </div>
            </div>
            
            <div className="flex gap-4 w-full justify-center mt-2">
              <button className="px-8 py-3.5 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors w-40 shadow-sm">Đặt lại</button>
              <button className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-[#0052CC] transition-colors w-44">Áp dụng lọc</button>
            </div>
          </section>

          <hr className="border-t border-slate-200" />

          {/* 3. Summary Section */}
          <section className="flex flex-col items-center gap-8 w-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tóm tắt</h2>
              <p className="text-base text-slate-600">Thống kê nhanh theo vai trò & trạng thái.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-base font-bold text-slate-600">Tổng người dùng</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{totalUsers}</span>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#0052CC]">
                <span className="text-base font-bold text-slate-600">Hoạt động</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{activeUsers}</span>
                </div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-rose-500">
                <span className="text-base font-bold text-slate-600">Bị khóa</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{inactiveUsers}</span>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-t border-slate-200" />

          {/* 4. Data Table Section */}
          <section className="flex flex-col gap-6 w-full pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Danh sách người dùng</h2>
                <p className="text-base text-slate-600">Bảng dữ liệu chi tiết kèm các thao tác nhanh.</p>
              </div>
              <div className="flex gap-3">
                <button className="p-2.5 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="p-2.5 border border-slate-300 bg-white rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      <th className="p-5 w-24">ID</th>
                      <th className="p-5">Tên người dùng</th>
                      <th className="p-5">Email</th>
                      <th className="p-5 w-32">Vai trò</th>
                      <th className="p-5 w-40">Trạng thái</th>
                      <th className="p-5 text-right w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-slate-500">Đang tải dữ liệu...</td>
                      </tr>
                    ) : users.map(u => (
                      <tr key={u.user_id} className={`hover:bg-slate-50 transition-colors group ${!u.is_active ? 'opacity-80' : ''}`}>
                        <td className="p-5 text-slate-500 font-mono">USR-{u.user_id.toString().padStart(3, '0')}</td>
                        <td className="p-5 font-bold text-slate-900 flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border ${u.role === 'admin' ? 'bg-blue-100 text-[#0052CC] border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {u.username.substring(0, 2).toUpperCase()}
                          </div>
                          {u.username}
                        </td>
                        <td className="p-5 text-slate-600">{u.email}</td>
                        <td className="p-5">
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-5">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-2 text-[#0052CC] font-bold">
                              <span className="w-2 h-2 rounded-full bg-[#0052CC]"></span> Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-rose-600 font-bold">
                              <span className="w-2 h-2 rounded-full bg-rose-600"></span> Bị khóa
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <button className="text-slate-400 hover:text-[#0052CC] transition-colors p-1" title="Sửa"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                          {u.is_active ? (
                            <button className="text-slate-400 hover:text-rose-600 transition-colors p-1 ml-2" title="Khóa"><span className="material-symbols-outlined text-[20px]">lock</span></button>
                          ) : (
                            <button className="text-slate-400 hover:text-green-600 transition-colors p-1 ml-2" title="Mở khóa"><span className="material-symbols-outlined text-[20px]">lock_open</span></button>
                          )}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="p-5 border-t border-slate-200 flex flex-wrap justify-between items-center bg-slate-50 gap-4">
                <span className="text-sm font-medium text-slate-600">Hiển thị <span className="font-bold text-slate-900">{totalUsers}</span> của <span className="font-bold text-slate-900">{totalUsers}</span></span>
                <div className="flex gap-2">
                  <button className="p-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="p-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-100 disabled:opacity-50 text-slate-600 shadow-sm transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

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

export default AdminManagement;