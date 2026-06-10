import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] font-sans min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-[#fbf9f8] border-b border-[#c0c7d3] w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-6">
            <div className="text-[18px] font-bold text-[#1b1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005e9f]">medical_services</span>
              Medical Research Platform
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-[#404751] hover:text-[#005e9f] transition-colors text-[14px] font-semibold" href="#">Trang chủ</a>
              <a className="text-[#404751] hover:text-[#005e9f] transition-colors text-[14px] font-semibold" href="#">Quản lý</a>
              <a className="text-[#404751] hover:text-[#005e9f] transition-colors text-[14px] font-semibold" href="#">Báo cáo</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input className="pl-10 pr-4 py-2 rounded-xl border border-[#c0c7d3] bg-[#fbf9f8] text-[#1b1c1c] text-[16px] focus:outline-none focus:border-[#005e9f] focus:ring-1 focus:ring-[#005e9f] w-64 transition-all" placeholder="Tìm kiếm..." type="text"/>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717783]">search</span>
            </div>
            <button className="text-[#404751] hover:text-[#005e9f] transition-colors font-semibold text-[14px]">Đăng nhập</button>
            <button className="bg-[#1b1c1c] text-white px-4 py-2 rounded-lg font-semibold text-[14px] hover:bg-[#303031] transition-colors">Đăng ký</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#f5f3f3] border-r border-[#c0c7d3] hidden lg:flex flex-col py-6 shrink-0 h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="flex-1 px-4 space-y-2">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0077c8] text-[#fbfbff] font-semibold text-[14px]" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              Tổng quan
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors font-semibold text-[14px]" href="#">
              <span className="material-symbols-outlined">group</span>
              Người dùng
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors font-semibold text-[14px]" href="#">
              <span className="material-symbols-outlined">shopping_cart</span>
              Đơn hàng
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors font-semibold text-[14px]" href="#">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Quyền truy cập
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors font-semibold text-[14px]" href="#">
              <span className="material-symbols-outlined">settings</span>
              Cài đặt
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 lg:px-20 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-[36px] font-bold text-[#1b1c1c] mb-2">Tổng quan Admin</h1>
            <p className="text-[18px] text-[#404751]">Theo dõi nhanh các chỉ số quan trọng của hệ thống theo thời gian thực.</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <div className="bg-[#fbf9f8] rounded-xl border border-[#c0c7d3] p-6 hover:border-[#005e9f] transition-colors group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[14px] font-semibold text-[#404751]">Tổng người dùng</span>
                <span className="material-symbols-outlined text-[#717783] group-hover:text-[#005e9f] transition-colors">group</span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1c1c] mb-2">12,482</div>
              <div className="text-[14px] font-semibold text-[#005e9f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +8.2% tháng này
              </div>
            </div>
            
            <div className="bg-[#fbf9f8] rounded-xl border border-[#c0c7d3] p-6 hover:border-[#005e9f] transition-colors group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[14px] font-semibold text-[#404751]">Đang hoạt động</span>
                <span className="material-symbols-outlined text-[#717783] group-hover:text-[#005e9f] transition-colors">moving</span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1c1c] mb-2">3,216</div>
              <div className="text-[14px] font-semibold text-[#005e9f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +1.1% 24h
              </div>
            </div>
            
            <div className="bg-[#fbf9f8] rounded-xl border border-[#c0c7d3] p-6 hover:border-[#005e9f] transition-colors group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[14px] font-semibold text-[#404751]">Tổng số thuốc</span>
                <span className="material-symbols-outlined text-[#717783] group-hover:text-[#005e9f] transition-colors">medication</span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1c1c] mb-2">856</div>
              <div className="text-[14px] font-semibold text-[#005e9f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">add</span>
                +12 hôm nay
              </div>
            </div>
            
            <div className="bg-[#fbf9f8] rounded-xl border border-[#c0c7d3] p-6 hover:border-[#005e9f] transition-colors group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[14px] font-semibold text-[#404751]">Tổng số lượt dự đoán</span>
                <span className="material-symbols-outlined text-[#717783] group-hover:text-[#005e9f] transition-colors">analytics</span>
              </div>
              <div className="text-[32px] font-bold text-[#1b1c1c] mb-2">27,904</div>
              <div className="text-[14px] font-semibold text-[#005e9f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +3.7% 7 ngày
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[24px] font-bold text-[#1b1c1c]">Biểu đồ cột - Lượt dự đoán theo ngày</h2>
              <span className="text-[16px] text-[#717783]">Biểu đồ minh họa (placeholder)</span>
            </div>
            <div className="bg-[#fbf9f8] border border-[#c0c7d3] rounded-xl p-8 h-[400px] flex flex-col relative">
              <div className="absolute left-4 top-8 bottom-12 flex flex-col justify-between text-[14px] font-semibold text-[#717783] text-right w-12">
                <span>10k</span>
                <span>8k</span>
                <span>6k</span>
                <span>4k</span>
                <span>2k</span>
                <span>0</span>
              </div>
              <div className="absolute left-[-24px] top-1/2 -rotate-90 text-[14px] font-semibold text-[#717783]">Số lượt</div>
              
              <div className="ml-16 flex-1 border-b border-l border-[#c0c7d3] flex items-end justify-around pb-0 relative">
                <div className="absolute inset-0 flex flex-col justify-between z-0 opacity-20">
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                  <div className="border-t border-[#c0c7d3] w-full"></div>
                </div>
                
                <div className="w-12 bg-[#71717a] h-[30%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">3,000</div>
                </div>
                <div className="w-12 bg-[#71717a] h-[50%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">5,000</div>
                </div>
                <div className="w-12 bg-[#71717a] h-[45%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">4,500</div>
                </div>
                <div className="w-12 bg-[#71717a] h-[70%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">7,000</div>
                </div>
                <div className="w-12 bg-[#71717a] h-[65%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">6,500</div>
                </div>
                <div className="w-12 bg-[#005e9f] h-[90%] rounded-t-sm z-10 relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">9,000</div>
                </div>
                <div className="w-12 bg-[#71717a] h-[80%] rounded-t-sm z-10 hover:bg-[#005e9f] transition-colors relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#303031] text-[#f2f0f0] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">8,000</div>
                </div>
              </div>
              
              <div className="ml-16 mt-2 flex justify-around text-[14px] font-semibold text-[#717783]">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>
              <div className="text-center mt-2 text-[14px] font-semibold text-[#717783]">Ngày</div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#fbf9f8] border-t border-[#c0c7d3] mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8 w-full max-w-[1200px] mx-auto">
          <div>
            <span className="text-[14px] font-semibold text-[#1b1c1c]">© 2026 Medical Research Platform. Bảo lưu mọi quyền.</span>
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end text-[16px]">
            <a className="text-[#404751] hover:text-[#005e9f] transition-colors" href="#">Chính sách quyền riêng tư</a>
            <a className="text-[#404751] hover:text-[#005e9f] transition-colors" href="#">Điều khoản sử dụng</a>
            <a className="text-[#404751] hover:text-[#005e9f] transition-colors" href="mailto:research@medplatform.example">research@medplatform.example</a>
            <a className="text-[#404751] hover:text-[#005e9f] transition-colors" href="#">docs.medplatform.example</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;