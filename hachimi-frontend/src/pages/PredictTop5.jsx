import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ==========================================
// 1. CÁC COMPONENT ĐƯỢC TÁCH NHỎ
// ==========================================

const Header = () => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div className="max-w-screen-2xl mx-auto px-6 py-4 lg:px-8 lg:py-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
          <span className="font-bold text-2xl text-[#1A365D] tracking-tight">Medical Research Platform</span>
        </div>
        
        <nav className="hidden md:flex space-x-10">
          <Link className="text-gray-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/">Trang chủ</Link>
          <Link className="text-gray-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/predict-single">Dự đoán cặp</Link>
          <Link className="text-[#0052CC] text-lg font-bold border-b-2 border-[#0052CC] pb-1" to="/dashboard/predict-top5">Top Thuốc</Link>
          <Link className="text-gray-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/interactions">Tương tác</Link>
          <Link className="text-gray-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/login">Đăng nhập / Đăng ký</Link>
        </nav>
        
        <div className="hidden md:block relative">
          <input 
            className="w-72 pl-5 pr-12 py-2.5 border border-slate-300 bg-slate-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:bg-white transition-all" 
            placeholder="Search in site..." 
            type="text" 
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        </div>
      </div>
    </div>
  </header>
);

const Banner = () => (
  <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 mt-8">
    <div className="relative h-[340px] lg:h-[380px] rounded-[2rem] overflow-hidden shadow-md flex items-center justify-center bg-slate-100 group">
      <img alt="Abstract Science Background" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" src="/banner top thuốc.jpg" />
      {/* Tăng độ đậm của overlay lên 60% để chữ trắng nổi bật hơn */}
      <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply transition-colors duration-500"></div>
      
      {/* Tiêu đề được lồng vào giữa Banner */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 text-shadow-lg tracking-tight">
          Top 5 Thuốc Đề Xuất
        </h1>
        <p className="text-lg lg:text-xl text-blue-50 leading-relaxed drop-shadow-md">
          Hệ thống gợi ý và xếp hạng các loại thuốc có tiềm năng điều trị cao nhất dựa trên dữ liệu bệnh lý đã chọn.
        </p>
      </div>
    </div>
  </div>
);

const SearchSection = ({ disease, setDisease }) => (
  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Tìm kiếm & Chọn bệnh</h2>
    <p className="text-xl text-slate-600 mb-12">Chọn bệnh lý để hệ thống tính toán và hiển thị top thuốc đề xuất.</p>
    
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-left w-full">
      {/* Bệnh Input */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <label className="block text-xl font-bold text-slate-900 mb-4" htmlFor="diseaseInput">Bệnh lý cần dự đoán</label>
        <input 
          id="diseaseInput"
          className="w-full p-5 border border-slate-300 rounded-2xl shadow-inner focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] text-xl transition-all" 
          placeholder="VD: Đái tháo đường, Viêm gan..." 
          type="text" 
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />
        <p className="mt-4 text-base text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">info</span> Bắt đầu nhập để nhận gợi ý
        </p>
      </div>
      
      {/* Thuốc Input (Disabled) */}
      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm">
        <label className="block text-xl font-bold text-slate-900 mb-4" htmlFor="topDrugInput">Phạm vi tìm kiếm</label>
        <input 
          id="topDrugInput"
          className="w-full p-5 border border-slate-200 rounded-2xl shadow-inner text-xl bg-slate-100 text-slate-400 cursor-not-allowed" 
          disabled 
          placeholder="Toàn bộ danh mục thuốc" 
          type="text" 
        />
        <p className="mt-4 text-base text-slate-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">lock</span> Mặc định tìm kiếm toàn diện
        </p>
      </div>
    </div>
    
    <div className="mt-14 flex justify-center">
      <button className="bg-slate-900 text-white px-14 py-5 rounded-2xl text-xl font-bold shadow-lg hover:bg-[#0052CC] hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto">
        Bắt đầu phân tích
      </button>
    </div>
  </div>
);

const ResultCard = () => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
    <div className="w-28 h-28 lg:w-32 lg:h-32 shrink-0 bg-slate-50 flex items-center justify-center rounded-2xl overflow-hidden border border-slate-100">
      <img alt="Chart" className="w-full h-full object-cover" src="/bảng dữ liệu.jpg" />
    </div>
    <div className="text-center sm:text-left">
      <h3 className="font-bold text-slate-900 text-2xl mb-2">Bảng dữ liệu phân tích</h3>
      <p className="text-sm font-medium text-[#0052CC] mb-3 bg-blue-50 inline-block px-3 py-1 rounded-md">Top 5 đề xuất</p>
      <p className="text-base text-slate-600 mb-5 leading-relaxed">
        Giao diện hiển thị dạng thẻ, hỗ trợ đọc nhanh các chỉ số liên kết và so sánh độ tin cậy giữa các loại thuốc.
      </p>
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 lg:gap-3">
        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">Hiệu suất cao</span>
        <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">So sánh trực quan</span>
      </div>
    </div>
  </div>
);

const RankingItem = ({ rank, name, score, confidence, circleClass }) => (
  <div className="bg-white rounded-3xl p-6 xl:p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center w-full">
    <div className={`w-20 h-20 rounded-2xl ${circleClass} flex items-center justify-center mb-6 shadow-md`}>
      <span className="text-4xl font-black font-mono">{rank}</span>
    </div>
    <div className="w-full text-center space-y-2">
      <h3 className="font-bold text-xl xl:text-2xl text-slate-900 truncate w-full mt-2" title={name}>{name}</h3>
      
      <div className="w-full h-px bg-slate-100 my-4"></div>
      
      <div className="flex justify-between items-center w-full">
        <span className="text-sm text-slate-500">Điểm liên kết</span>
        <span className="text-lg font-bold text-[#0052CC]">{score}%</span>
      </div>
      <div className="flex justify-between items-center w-full">
        <span className="text-sm text-slate-500">Độ tin cậy</span>
        <span className="text-sm font-medium text-slate-700">{confidence}</span>
      </div>
    </div>
  </div>
);

const Footer = () => (
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
);

// ==========================================
// 2. PAGE CHÍNH TRẢ VỀ TOÀN BỘ GIAO DIỆN
// ==========================================

const PredictTop5 = () => {
  const [disease, setDisease] = useState('');

  const medicines = [
    { rank: 1, name: "Aspirin", score: 92.4, confidence: "Rất Cao", circleClass: "bg-[#FFE58F] text-slate-900" },
    { rank: 2, name: "Metformin", score: 89.1, confidence: "Cao", circleClass: "bg-[#FFD6E7] text-slate-900" },
    { rank: 3, name: "Lisinopril", score: 86.7, confidence: "Khá", circleClass: "bg-[#B7EB8F] text-slate-900" },
    { rank: 4, name: "Atorvastatin", score: 83.3, confidence: "Trung bình", circleClass: "bg-[#E6F7FF] text-[#0052CC]" },
    { rank: 5, name: "Omeprazole", score: 80.9, confidence: "Thấp", circleClass: "bg-slate-100 text-slate-600" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-grow">
        {/* Banner bây giờ đã bao trùm luôn cả Tiêu đề trang */}
        <Banner />
        
        <SearchSection disease={disease} setDisease={setDisease} />

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="border-t border-slate-200"></div>
        </div>

        {/* Results Section */}
        <div className="py-16 lg:py-20">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
            
            {/* Top Result Row */}
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3">Kết quả đề xuất</h2>
                <p className="text-lg text-slate-600">Danh sách top 5 thuốc được AI xếp hạng theo điểm liên kết và độ tin cậy.</p>
              </div>
              <ResultCard />
            </div>
            {/* Bottom Ranking Row */}
            <div className="mt-20 lg:mt-28">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 relative inline-block">
                  Bảng Xếp Hạng Gợi Ý
                </h2>
              </div>
              
              {/* Dùng grid-cols-5 để 5 card dàn đều trên cùng 1 dòng ở màn hình Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
                {medicines.map((med) => (
                  <RankingItem 
                    key={med.rank}
                    rank={med.rank}
                    name={med.name}
                    score={med.score}
                    confidence={med.confidence}
                    circleClass={med.circleClass}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PredictTop5;