import React from 'react';
import { Link } from 'react-router-dom';

const Interactions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* ==================== HEADER ==================== */}
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
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/">Trang chủ</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-[#0052CC] text-lg font-bold border-b-2 border-[#0052CC] pb-1" to="/dashboard/interactions">Tương tác</Link>
              <Link className="text-slate-600 text-lg hover:text-[#0052CC] font-medium transition-colors" to="/login">Đăng nhập / Đăng ký</Link>
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
      
      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-grow">
        
        {/* ==================== BANNER ==================== */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 mt-8">
          <div className="relative h-[340px] lg:h-[380px] rounded-[2rem] overflow-hidden shadow-md flex items-center justify-center bg-slate-100 group">
            <img 
              alt="Banner Tương tác" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              src="/banner-tương tác.jpg" 
            />
            <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply transition-colors duration-500"></div>
            
            <div className="relative z-10 text-center px-6 max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-shadow-lg tracking-tight">
                Kiểm Tra Tương Tác Thuốc
              </h1>
              <p className="text-lg lg:text-xl text-blue-50 leading-relaxed drop-shadow-md">
                Hệ thống rà soát và cảnh báo tương tác tự động. Kết quả mang tính tham khảo, vui lòng trao đổi với bác sĩ/dược sĩ trước khi thay đổi phác đồ điều trị.
              </p>
            </div>
          </div>
        </div>
        
        {/* ==================== QUICK CHECK SECTION ==================== */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20 border-b border-slate-200">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Kiểm tra tương tác nhanh</h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">Chọn tối đa 10 loại thuốc để tra cứu và đánh giá các tương tác có khả năng xảy ra.</p>
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-[#0052CC] hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                Kiểm tra Tương tác
              </button>
            </div>
            
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Selected Drugs */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start">
                <img 
                  src="/thuốc đã chọn.png" 
                  alt="Thuốc đã chọn" 
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl shrink-0 object-cover bg-slate-50 border border-slate-100" 
                />
                <div className="flex-grow w-full">
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">Thuốc đã chọn (3/10)</h3>
                  <p className="text-base text-slate-500 mb-4">Xóa thuốc khỏi danh sách bằng nút "×"</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors">
                      Amlodipin <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors">
                      Metformin <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors">
                      Omeprazol <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Card 2: Add Drug */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-[#E6F7FF] flex items-center justify-center rounded-2xl border border-blue-100 text-[#0052CC]">
                  <span className="material-symbols-outlined text-4xl">add_circle</span>
                </div>
                <div className="flex-grow w-full">
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">Thêm thuốc</h3>
                  <p className="text-base text-slate-500 mb-4">Tìm kiếm theo tên hoạt chất hoặc biệt dược.</p>
                  <div className="relative w-full">
                    <input 
                      className="w-full p-4 border border-slate-300 rounded-2xl text-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] shadow-inner transition-all" 
                      placeholder='Ô combobox: "Thêm thuốc..."' 
                      type="text"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Tự động gợi ý</span>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Nhấn Enter để thêm</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Thao tác */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start opacity-50">
                <div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-slate-100 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400">
                  <span className="material-symbols-outlined text-4xl">touch_app</span>
                </div>
                <div className="flex-grow w-full">
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">Thao tác</h3>
                  <p className="text-base text-slate-500 mb-4">Nút chính: "Kiểm tra Tương tác"</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Chỉ hiển thị khi đã chọn thuốc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== LIST SECTION ==================== */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20 border-b border-slate-200">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Danh sách thuốc</h2>
              <p className="text-xl text-slate-600 leading-relaxed">Quản lý danh sách thuốc để thực hiện tra cứu tương tác trực quan.</p>
            </div>
            
            <div className="lg:col-span-7 bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-8">
                <label className="block text-xl font-bold text-slate-900 mb-4">Thuốc đã chọn (3/10)</label>
                <div className="w-full p-4 border border-slate-200 rounded-2xl bg-slate-50 min-h-[72px] flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-white text-slate-700 border border-slate-200 shadow-sm">
                    Amlodipin <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-white text-slate-700 border border-slate-200 shadow-sm">
                    Metformin <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-white text-slate-700 border border-slate-200 shadow-sm">
                    Omeprazol <span className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium">3 thẻ có nút xóa: × (Amlodipin, Metformin, Omeprazol)</p>
              </div>
              
              <div className="mb-8 relative">
                <label className="block text-xl font-bold text-slate-900 mb-4">Thêm thuốc...</label>
                <input 
                  className="w-full p-5 border border-slate-300 rounded-2xl text-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] shadow-inner transition-all" 
                  placeholder="Nhập tên thuốc để tìm kiếm" 
                  type="text"
                />
                <p className="mt-3 text-sm text-slate-500 font-medium">Cho phép chọn nhiều thuốc • Tối đa 10</p>
              </div>
              
              <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-[#0052CC] hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto">
                Kiểm tra Tương tác
              </button>
            </div>
          </div>
        </div>
        
        {/* ==================== DETAILED RESULTS SECTION ==================== */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Kết Quả Phân Tích</h2>
          <p className="text-xl text-slate-600 mb-16">Chi tiết các tương tác được phát hiện dựa trên danh sách thuốc đã chỉ định.</p>
          
          {/* Chart Section */}
          <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm mb-16 text-left hover:shadow-md transition-shadow">
            <h3 className="font-bold text-2xl text-slate-900 mb-2">Tổng quan mức độ tương tác</h3>
            <p className="text-base text-slate-500 mb-10">Thống kê số lượng theo nhóm cảnh báo</p>
            <div className="h-56 flex items-end justify-between gap-4 border-b border-slate-200 pb-2 relative">
              <div className="absolute w-full border-t border-slate-100 border-dashed top-0"></div>
              <div className="absolute w-full border-t border-slate-100 border-dashed top-1/2"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[80%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[40%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[20%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[45%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[30%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
              <div className="w-full bg-slate-300 rounded-t-lg h-[60%] hover:bg-[#0052CC] hover:shadow-lg transition-all cursor-pointer relative z-10"></div>
            </div>
            <div className="text-right mt-3 text-sm text-slate-500 font-medium">Biểu đồ phân bố nhóm tương tác</div>
          </div>
        </div>

        {/* Interaction Results Cards */}
        <div className="bg-slate-50 py-16 lg:py-20 border-t border-slate-200">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              
              <div className="lg:col-span-4 lg:sticky lg:top-32">
                <div className="bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-3xl">warning</span>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Phát hiện<br/><span className="text-rose-600">2 tương tác</span></h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Xem chi tiết từng tương tác theo cặp thuốc. Dữ liệu được tổng hợp và đối chiếu từ các nguồn y khoa uy tín.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-8 space-y-8">
                
                {/* Result Header Card CẬP NHẬT: Chữ cực to, in đậm và nổi bật hơn */}
                <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-md flex flex-col justify-center">
                  <h3 className="font-black text-4xl lg:text-5xl text-slate-900 mb-4 tracking-tight">
                    Bảng kết quả
                  </h3>
                  <p className="text-xl lg:text-2xl text-slate-600 font-medium">
                    Cột: <span className="text-[#0052CC]">Thuốc A</span> <span className="mx-2 text-slate-300">|</span> <span className="text-rose-600">Thuốc B</span> <span className="mx-2 text-slate-300">|</span> Mô tả tương tác <span className="mx-2 text-slate-300">|</span> Nguồn cấp
                  </p>
                </div>

                {/* Interaction 1 */}
                <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col sm:flex-row gap-8 items-start">
                  <img 
                    src="/bệnh lý.jpg" 
                    alt="Bệnh lý" 
                    className="w-24 h-24 rounded-2xl shrink-0 object-cover bg-slate-50 border border-slate-100 hidden sm:block" 
                  />
                  <div className="flex-grow w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-bold rounded-lg border border-rose-200">
                        Cảnh báo mức độ 1
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center text-xl text-slate-500 mb-4 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[#0052CC]">Amlodipin</span>
                      <span className="material-symbols-outlined text-xl mx-4 text-slate-400">sync_alt</span>
                      <span className="text-rose-600">Omeprazol</span>
                    </div>
                    
                    <h3 className="font-bold text-2xl text-slate-900 mb-3">Tăng nguy cơ tác dụng phụ</h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      Việc sử dụng chung hai loại thuốc này có thể dẫn đến một số ảnh hưởng nhất định. Khuyến cáo không nên tự ý thay đổi liều lượng nếu không có sự cho phép của bác sĩ.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">visibility</span> Theo dõi triệu chứng
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">do_not_disturb</span> Tránh tự ý thay đổi liều
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 border-t border-slate-100 pt-5">
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                      <span>Nguồn: Hướng dẫn lâm sàng Bộ Y Tế</span>
                    </div>
                  </div>
                </div>
                
                {/* Interaction 2 */}
                <div className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col sm:flex-row gap-8 items-start">
                  <img 
                    src="/bệnh lý.jpg" 
                    alt="Bệnh lý" 
                    className="w-24 h-24 rounded-2xl shrink-0 object-cover bg-slate-50 border border-slate-100 hidden sm:block" 
                  />
                  <div className="flex-grow w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-lg border border-amber-200">
                        Lưu ý theo dõi
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center text-xl text-slate-500 mb-4 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[#0052CC]">Metformin</span>
                      <span className="material-symbols-outlined text-xl mx-4 text-slate-400">sync_alt</span>
                      <span className="text-amber-600">Omeprazol</span>
                    </div>
                    
                    <h3 className="font-bold text-2xl text-slate-900 mb-3">Khả năng ảnh hưởng hấp thu</h3>
                    <p className="text-slate-600 text-lg leading-relaxed mb-6">
                      Sự kết hợp này có thể làm giảm sinh khả dụng hoặc thay đổi thời gian hấp thu của Metformin. Nên kiểm tra và điều chỉnh liều nếu cần thiết.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-[#0052CC] border border-blue-200">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">monitor_heart</span> Theo dõi đường huyết
                      </span>
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="material-symbols-outlined text-[18px] mr-1.5">medical_information</span> Tư vấn dược sĩ
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 border-t border-slate-100 pt-5">
                      <span className="material-symbols-outlined text-[18px]">database</span>
                      <span>Nguồn: Cơ sở dữ liệu Thuốc Quốc gia</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Medical Research Platform
              </h3>
              <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">
                Dự án phục vụ mục đích nghiên cứu và học tập, cung cấp hệ sinh thái tra cứu thông tin y khoa.
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Hachimi Team
              </h4>
              <p className="text-base text-slate-600 leading-relaxed max-w-sm mx-auto">
                Dự án ứng dụng AI, Machine Learning và công nghệ Y sinh tiên tiến nhất.
              </p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Liên hệ
              </h4>
              <p className="text-base text-slate-600">
                Email: hachimi.team@example.com
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Interactions;