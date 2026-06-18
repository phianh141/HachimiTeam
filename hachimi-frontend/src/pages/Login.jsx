import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });
      // Save token and user info via context
      login(response.data.user, response.data.access_token);
      
      // Navigate based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard/predict-single');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối.');
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
            Medical <br/><span className="text-blue-400">Research</span> Platform
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-2xl font-medium">
            Hệ thống ứng dụng Trí tuệ nhân tạo (AI) giúp tối ưu hóa việc phân tích, dự đoán cặp Thuốc - Bệnh và rà soát tương tác y khoa chuyên sâu.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-slate-400 text-sm font-medium">
            <span>© 2026 Hachimi Team</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span>Bảo mật dữ liệu cấp cao</span>
          </div>
        </div>
      </div>

      {/* ==================== BÊN PHẢI: 1/3 (FORM ĐĂNG NHẬP) ==================== */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center px-10 sm:px-16 lg:px-20 py-12 bg-white h-screen overflow-y-auto shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-10 relative">
        
        <div className="max-w-lg w-full mx-auto">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-4 mb-12">
            <img src="/Hachimi.jpg" alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
            <span className="font-bold text-2xl text-[#1A365D]">Hachimi Platform</span>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Đăng nhập</h2>
            <p className="text-lg text-slate-600">Chào mừng bạn quay lại hệ thống.</p>
          </div>

          <form className="space-y-8" onSubmit={handleLogin}>
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
              <div className="flex justify-between items-center mb-3">
                <label className="block text-base font-bold text-slate-900" htmlFor="password">Mật khẩu</label>
                <a href="#" className="text-base font-bold text-[#0052CC] hover:underline">Quên mật khẩu?</a>
              </div>
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
            </div>

            {error && <div className="text-rose-600 font-medium text-base bg-rose-50 p-5 rounded-xl border border-rose-100">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 mt-4 bg-slate-900 text-white rounded-2xl font-bold text-xl hover:bg-[#0052CC] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <div className="flex items-center my-10">
            <hr className="flex-grow border-slate-200" />
            <span className="px-5 text-slate-500 text-base font-medium">Hoặc tiếp tục với</span>
            <hr className="flex-grow border-slate-200" />
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <button type="button" className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border border-slate-300 rounded-2xl font-bold text-slate-700 text-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border border-slate-300 rounded-2xl font-bold text-slate-700 text-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div className="mt-12 text-center">
            <span className="text-lg text-slate-600">Chưa có tài khoản? </span>
            <Link to="/register" className="text-lg font-bold text-[#0052CC] hover:underline">
              Đăng ký ngay
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;