import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PredictLink = () => {
  const [drug, setDrug] = useState('Aspirin');
  const [disease, setDisease] = useState('Migraine');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
              <span className="font-bold text-2xl text-[#1A365D]">Medical Research Platform</span>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <Link className="text-gray-900 text-lg font-medium" to="/">Trang chủ</Link>
              <Link className="text-[#0052CC] text-lg font-medium border-b-2 border-[#0052CC] pb-1" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-gray-600 text-lg hover:text-gray-900" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-gray-600 text-lg hover:text-gray-900" to="/dashboard/interactions">Tương tác</Link>
              <Link className="text-gray-600 text-lg hover:text-gray-900" to="/login">Đăng nhập / Đăng ký</Link>
            </nav>
            
            <div className="hidden md:block relative">
              <input 
                className="w-72 pl-5 pr-12 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0052CC]" 
                placeholder="Search in site" 
                type="text" 
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* BANNER (Đã được làm to, thêm chữ và hiệu ứng) */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 mt-8">
          <div className="relative h-[340px] lg:h-[380px] rounded-[2rem] overflow-hidden shadow-md flex items-center justify-center bg-slate-100 group">
            <img 
              alt="Banner Dự đoán cặp" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              src="/banner-dự đoán cặp.png" 
            />
            <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply transition-colors duration-500"></div>
            
            <div className="relative z-10 text-center px-6 max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-shadow-lg tracking-tight">
                Dự Đoán Cặp Thuốc - Bệnh
              </h1>
              <p className="text-lg lg:text-xl text-blue-50 leading-relaxed drop-shadow-md">
                Ứng dụng Trí tuệ nhân tạo (AI) để phân tích, đo lường điểm số liên kết và đánh giá độ tin cậy giữa một loại thuốc và một bệnh lý cụ thể.
              </p>
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="max-w-screen-2xl mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            {/* Left: Title & Desc */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Nhập lựa chọn thuốc & bệnh</h1>
              <p className="text-xl text-gray-600 leading-relaxed">Chọn 2 giá trị để chạy dự đoán. Gợi ý tìm kiếm sẽ tự động lọc theo tên phổ biến.</p>
            </div>
            
            {/* Right: Inputs */}
            <div className="space-y-8">
              {/* Thuốc Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Chọn Thuốc</label>
                <input 
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC]" 
                  placeholder="Ví dụ: Metformin, Amoxicillin..." 
                  readOnly 
                  type="text" 
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">Tự động gợi ý (Autocomplete)</p>
              </div>
              
              {/* Bệnh Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Chọn Bệnh</label>
                <input 
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC]" 
                  placeholder="Ví dụ: Đái tháo đường type 2, Viêm tai giữa..." 
                  readOnly 
                  type="text" 
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">Tự động gợi ý (Autocomplete)</p>
              </div>
              
              <button className="bg-black text-white px-10 py-4 rounded-xl text-lg font-medium shadow-lg hover:bg-gray-800 transition-colors w-full md:w-auto">
                Chạy Dự Đoán
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="bg-[#F4F5F7] py-24">
          <div className="max-w-screen-2xl mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-20 items-start">
              {/* Left: Result Title */}
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6">Kết quả dự đoán</h2>
                <p className="text-xl text-gray-600">Xem cặp thuốc-bệnh, điểm số và mức độ tin cậy.</p>
              </div>
              
              {/* Right: Result Cards */}
              <div className="space-y-6">
                {/* Card 1: Thuốc */}
                <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                  <img alt="Pills" className="w-28 h-28 object-cover rounded-xl" src="/thuốc đã chọn.png" />
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">Thuốc đã chọn</h3>
                    <p className="text-base text-gray-500 mb-1">Tên thuốc</p>
                    <p className="text-xl font-medium text-gray-900">{drug}</p>
                  </div>
                </div>

                {/* Card 2: Bệnh */}
                <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                  <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Bệnh đã chọn.png" />
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">Bệnh đã chọn</h3>
                    <p className="text-base text-gray-500 mb-1">Tên bệnh</p>
                    <p className="text-xl font-medium text-gray-900">{disease}</p>
                  </div>
                </div>

                {/* Card 3: Điểm */}
                <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                  <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Điểm dự đoán.jpg" />
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">Điểm dự đoán</h3>
                    <p className="text-base text-gray-500 mb-1">Tỷ lệ phần trăm</p>
                    <p className="text-3xl font-bold text-gray-900">85.2%</p>
                  </div>
                </div>

                {/* Card 4: Độ tin cậy */}
                <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                  <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Độ tin cậy.jpg" />
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-1">Độ tin cậy</h3>
                    <p className="text-base text-gray-500 mb-2">Trạng thái</p>
                    <div>
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                        Độ tin cậy cao
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Medical Research Platform
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">
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

export default PredictLink;