import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      if (err.response?.data?.detail) {
        setPasswordError(err.response.data.detail);
      } else {
        setPasswordError('Có lỗi xảy ra khi đổi mật khẩu.');
      }
    } finally {
      setLoading(false);
    }
  };

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
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/dictionary">Từ điển</Link>
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/dashboard/predict-single">Dự đoán</Link>
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

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-8 py-16">
        
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">Hồ sơ Cá nhân</h1>
          <p className="text-xl text-slate-600">Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm shrink-0">
            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl font-bold text-lg transition-all text-left ${activeTab === 'info' ? 'bg-[#0052CC] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <span className="material-symbols-outlined text-[24px]">person</span>
                Thông tin cá nhân
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl font-bold text-lg transition-all text-left ${activeTab === 'password' ? 'bg-[#0052CC] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <span className="material-symbols-outlined text-[24px]">lock</span>
                Đổi mật khẩu
              </button>
              <button 
                onClick={() => navigate('/dashboard/history')}
                className="flex items-center gap-4 w-full px-5 py-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold text-lg transition-all text-left"
              >
                <span className="material-symbols-outlined text-[24px]">history</span>
                Lịch sử hoạt động
              </button>
            </nav>
          </div>

          {/* Right Form Area */}
          <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-10 shadow-sm w-full">
            {activeTab === 'info' && user && (
              <>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">Thông tin cá nhân</h2>
                
                <form className="flex flex-col gap-8 max-w-2xl">
                  {/* Avatar upload */}
                  <div className="flex items-center gap-8">
                    <div className="w-28 h-28 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-black text-4xl shadow-md border-4 border-white ring-2 ring-slate-100">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <button type="button" className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors mb-2">
                        Đổi ảnh đại diện
                      </button>
                      <p className="text-sm text-slate-500">JPG, GIF hoặc PNG. Tối đa 5MB.</p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="font-bold text-slate-900">Họ và Tên / Username</label>
                      <input 
                        type="text" 
                        className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                        defaultValue={user.username}
                        readOnly
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="font-bold text-slate-900">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                        defaultValue={user.email}
                        readOnly
                      />
                      <p className="text-xs text-slate-500">Email được dùng để đăng nhập nên không thể thay đổi.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="font-bold text-slate-900">Quyền hạn</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all capitalize"
                      defaultValue={user.role}
                      readOnly
                    />
                  </div>

                  <div className="pt-6 mt-2 border-t border-slate-200 flex justify-end gap-4">
                    <button type="button" className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-[#0052CC] transition-colors cursor-not-allowed opacity-50">
                      Tính năng Đang phát triển
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h2 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">Đổi mật khẩu</h2>
                <form className="flex flex-col gap-8 max-w-xl" onSubmit={handlePasswordChange}>
                  
                  {passwordError && <div className="p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-medium">{passwordError}</div>}
                  {passwordSuccess && <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 font-medium">{passwordSuccess}</div>}

                  <div className="flex flex-col gap-3">
                    <label className="font-bold text-slate-900">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <label className="font-bold text-slate-900">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:border-[#0052CC] focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <p className="text-sm text-slate-500 mt-1">Phải có ít nhất 6 ký tự.</p>
                  </div>

                  <div className="pt-6 mt-2 border-t border-slate-200 flex justify-end gap-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-8 py-4 bg-[#0052CC] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {loading ? 'Đang lưu...' : 'Lưu mật khẩu mới'}
                    </button>
                  </div>
                </form>
              </>
            )}

            {!user && (
               <div className="text-center py-20 text-slate-500">
                 Vui lòng đăng nhập để xem thông tin hồ sơ.
               </div>
            )}
          </div>
        </div>
      </main>

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

export default Profile;
