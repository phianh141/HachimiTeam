import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuth = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng thử đăng nhập lại.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Lưu tạm token để API interceptor (trong api.js) có thể đính kèm vào header
        localStorage.setItem('access_token', token);
        
        // Gọi API để lấy thông tin user đầy đủ (bao gồm role)
        const response = await api.get('/auth/me');
        const user = response.data;
        
        // Cập nhật AuthContext state
        login(user, token);
        
        // Điều hướng thông minh dựa vào phân quyền
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard/predict-single');
        }
      } catch (err) {
        console.error('Lỗi xác thực OAuth:', err);
        setError('Xác thực thất bại, kết nối có vấn đề. Vui lòng thử lại.');
        localStorage.removeItem('access_token');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="text-center p-10 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-md w-full border border-slate-100/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10">
          {error ? (
            <div className="text-rose-600 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight text-slate-900">Lỗi Đăng Nhập</h2>
              <p className="text-slate-600 font-medium leading-relaxed">{error}</p>
              <p className="text-sm text-slate-400 mt-4">Đang chuyển hướng về trang đăng nhập...</p>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                {/* Outer spinning ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0052CC] border-r-[#0052CC]/30 opacity-70 animate-spin"></div>
                {/* Inner icon */}
                <svg className="w-10 h-10 text-[#0052CC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Đang xác thực...</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed px-4">
                Hệ thống đang thiết lập kết nối bảo mật. Vui lòng đợi trong giây lát.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
