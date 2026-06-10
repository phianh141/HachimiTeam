import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Microscope, Search, Link as LinkIcon, BarChart2, ShieldCheck, 
  ClipboardList, Lightbulb, Zap, TestTubes, AlertTriangle 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* TopNavBar */}
      <header className="bg-white w-full border-b border-slate-200 sticky top-0 z-50">
        <div className="flex justify-between items-center px-8 py-5 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Medical Research Platform</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-blue-600 text-lg font-bold border-b-2 border-blue-600 pb-1">Trang chủ</Link>
            <Link to="/dashboard/predict-single" className="text-slate-600 text-lg hover:text-blue-600 transition-colors font-medium">Dự đoán cặp</Link>
            <Link to="/dashboard/predict-top5" className="text-slate-600 text-lg hover:text-blue-600 transition-colors font-medium">Top Thuốc</Link>
            <Link to="/dashboard/interactions" className="text-slate-600 text-lg hover:text-blue-600 transition-colors font-medium">Tương tác</Link>
          </nav>

          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <input 
                type="text"
                placeholder="Search in site..." 
                className="pl-5 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>
            <div className="flex items-center gap-4">
              <Link to="/register" className="px-6 py-3 text-base font-bold text-slate-700 hover:text-blue-600 transition-colors">
                Đăng ký
              </Link>
              <Link to="/login" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-base font-bold hover:bg-slate-800 transition-colors shadow-sm">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-blue-600 relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              Hệ thống Dự đoán <br/> Liên kết Thuốc - Bệnh
            </h1>
            <p className="text-xl md:text-3xl text-blue-110 mb-10 max-w-2xl leading-relaxed">
              Nghiên cứu liên kết đa cơ chế giúp ưu tiên cặp thuốc-bệnh và hỗ trợ kiểm tra tương tác theo dữ liệu y sinh.
            </p>
          </div>
          
          <div className="relative h-[480px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-500/30">
            <img 
              src="/1.png" 
              alt="Medical AI Concept" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sub-hero Banner */}
      <div className="max-w-6xl mx-auto px-8 mt-[-50px] relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 text-center">
          <p className="text-xl font-medium text-slate-600 leading-relaxed">
            Gợi ý nhanh cặp thuốc-bệnh • Xếp hạng top thuốc • Phân tích tương tác — tất cả trong một giao diện thống nhất, thân thiện với nhà nghiên cứu.
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <section id="features" className="max-w-screen-2xl mx-auto px-8 py-28">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Tính năng chính</h2>
            <p className="text-slate-600 text-xl">Chọn một mục để bắt đầu truy vấn. Giao diện tối ưu để theo dõi tiến trình và kết quả.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="relative h-64 bg-slate-100 overflow-hidden">
              <span className="absolute top-5 left-5 z-10 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-slate-800 shadow-sm">Start</span>
              <img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Dự đoán cặp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Dự đoán cặp</h3>
              <p className="text-slate-600 text-lg mb-8 line-clamp-2">Tìm cặp thuốc-bệnh tiềm năng dựa trên các mô hình máy học chuyên sâu.</p>
              <div className="flex gap-4 text-slate-400">
                <LinkIcon className="w-6 h-6" />
                <BarChart2 className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="relative h-64 bg-orange-100 overflow-hidden">
              <span className="absolute top-5 left-5 z-10 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-slate-800 shadow-sm">Ranking</span>
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Top Thuốc" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Top Thuốc</h3>
              <p className="text-slate-600 text-lg mb-8 line-clamp-2">Xếp hạng các loại thuốc phù hợp và có tiềm năng điều trị cao nhất cho một loại bệnh.</p>
              <div className="flex gap-4 text-slate-400">
                <LinkIcon className="w-6 h-6" />
                <BarChart2 className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
            <div className="relative h-64 bg-blue-100 overflow-hidden">
              <span className="absolute top-5 left-5 z-10 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-slate-800 shadow-sm">Safety</span>
              <img src="https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Kiểm tra Tương tác" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Kiểm tra Tương tác</h3>
              <p className="text-slate-600 text-lg mb-8 line-clamp-2">Đánh giá nguy cơ và mức độ tương tác, phản ứng chéo giữa các loại thuốc với nhau.</p>
              <div className="flex gap-4 text-slate-400">
                <LinkIcon className="w-6 h-6" />
                <BarChart2 className="w-6 h-6" />
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/50 py-28 border-y border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Cách hoạt động</h2>
            <p className="text-slate-600 text-xl mb-10">Quy trình đơn giản gồm 3 bước — từ truy vấn đến kiểm tra kết quả.</p>
            <div className="hidden md:block w-full h-80 bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
              <img src="/3.jpg" alt="Quy trình" className="w-full h-full object-cover"/>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 shrink-0 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <ClipboardList className="text-emerald-600 w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">1) Nhập thông tin truy vấn</h4>
                <p className="text-base font-medium text-emerald-600 mb-3">Thuốc hoặc bệnh (hoặc cả hai)</p>
                <p className="text-slate-600 text-base leading-relaxed">Chọn mục "Dự đoán cặp / Top Thuốc / Tương tác", nhập mã định danh hoặc tên phổ biến để cấu hình phạm vi.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 shrink-0 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Lightbulb className="text-blue-600 w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">2) Chạy AI & nhận kết quả</h4>
                <p className="text-base font-medium text-blue-600 mb-3">Ưu tiên theo mức độ liên quan</p>
                <p className="text-slate-600 text-base leading-relaxed">Hệ thống tạo danh sách kết quả kèm điểm số (Score) và độ tin cậy để bạn đánh giá nhanh chóng.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 shrink-0 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Search className="text-orange-600 w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">3) Xem & kiểm tra tương tác</h4>
                <p className="text-base font-medium text-orange-600 mb-3">Định hướng thí nghiệm / ra quyết định</p>
                <p className="text-slate-600 text-base leading-relaxed">Lọc kết quả, mở chi tiết liên kết, sau đó đối chiếu tương tác thuốc nhằm giảm rủi ro trong lựa chọn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-screen-2xl mx-auto px-8 py-28">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="h-[600px] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            <img src="/2.png" alt="Nhà nghiên cứu" className="w-full h-full object-cover" />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight text-center md:text-left">Lợi ích cho nghiên cứu</h2>
            <p className="text-xl text-slate-600 mb-16 text-center md:text-left">Thiết kế tập trung vào tốc độ, khả năng kiểm tra và tính minh bạch.</p>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-16">
              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <Zap className="text-amber-600 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Truy vấn nhanh</h4>
                <p className="text-base text-slate-600">Thời gian trả kết quả tối ưu cho workflow, tiết kiệm thời gian xử lý.</p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <BarChart2 className="text-blue-600 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Đánh giá chính xác</h4>
                <p className="text-base text-slate-600">Hiển thị các chỉ số Score rõ ràng, hỗ trợ đánh giá bằng dữ liệu liên kết.</p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <TestTubes className="text-emerald-600 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Hỗ trợ ra quyết định</h4>
                <p className="text-base text-slate-600">Ưu tiên các cặp tiềm năng nhất để đưa vào thử nghiệm thực tế.</p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <AlertTriangle className="text-rose-600 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Kiểm tra tương tác</h4>
                <p className="text-base text-slate-600">Giảm rủi ro khi kết hợp thuốc bằng cảnh báo theo mức độ nguy hiểm.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
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

export default LandingPage;