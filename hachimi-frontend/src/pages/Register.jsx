import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', {
        username: username,
        email: email,
        password: password
      });
      // Navigate to login on success
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900 selection:bg-[#0052CC] selection:text-white">
      
      {/* ==================== BÊN TRÁI: 2/3 (BANNER & TEXT) ==================== */}
      <div className="hidden lg:flex lg:w-2/3 relative bg-slate-900 items-center justify-center overflow-hidden">
        <img 
          src="/banner_regislogin.jpg" 
          alt="Hachimi Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-900/40 backdrop-blur-[4px]"></div>
        
        <div className="relative z-10 p-12 lg:p-24 w-full max-w-4xl text-left">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl border border-white/20 p-2">
            <img src="/Hachimi.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Mở khóa <br/><span className="text-emerald-400">Tiềm năng</span> Dữ liệu
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl font-medium mb-10">
            Tạo tài khoản để tham gia cộng đồng nghiên cứu, lưu trữ kết quả và trải nghiệm toàn bộ các mô hình AI dự đoán mạnh mẽ nhất.
          </p>

          {/* Các gạch đầu dòng tính năng */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">verified</span>
              <span className="text-xl text-slate-200 font-medium">Truy cập không giới hạn cơ sở dữ liệu y khoa</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-emerald-400 text-3xl">verified</span>
              <span className="text-xl text-slate-200 font-medium">Lưu trữ và theo dõi lịch sử tra cứu cá nhân</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* ==================== BÊN PHẢI: 1/3 (FORM ĐĂNG KÝ) ==================== */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 bg-white h-screen overflow-y-auto shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-10 relative">
        
        {/* Đã tăng max-w-md lên max-w-lg để form rộng rãi hơn */}
        <div className="max-w-lg w-full mx-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-4 mb-12">
            <img src="/Hachimi.jpg" alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
            <span className="font-bold text-2xl text-[#1A365D]">Hachimi Platform</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Tạo tài khoản</h2>
            <p className="text-lg text-slate-600">Điền thông tin bên dưới để bắt đầu.</p>
          </div>

          {/* Đã tăng space-y-5 lên space-y-7 */}
          <form className="space-y-7" onSubmit={handleRegister}>
            <div>
              {/* Đã tăng text-sm lên text-base */}
              <label className="block text-base font-bold text-slate-900 mb-3" htmlFor="username">Tên đăng nhập</label>
              <input 
                
                className="w-full p-5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] text-lg transition-all" 
                id="username" 
                type="text" 
                
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-900 mb-3" htmlFor="email">Email</label>
              <input 
                className="w-full p-5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] text-lg transition-all" 
                id="email" 
                type="email" 
                 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-900 mb-3" htmlFor="password">Mật khẩu</label>
              <div className="relative">
                <input 
                  className="w-full p-5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] text-lg transition-all pr-14" 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-3 font-medium">Ít nhất 8 ký tự</p>
            </div>

            {error && <div className="text-rose-600 font-medium text-base bg-rose-50 p-5 rounded-xl border border-rose-100">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              
              className="w-full py-5 mt-6 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-[#0052CC] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Tạo tài khoản'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-lg text-slate-600">Đã có tài khoản? </span>
            <Link to="/login" className="text-lg font-bold text-[#0052CC] hover:underline">
              Đăng nhập tại đây
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;