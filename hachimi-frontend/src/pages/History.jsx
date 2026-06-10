import React from 'react';

const History = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] font-sans">
      <header className="bg-white border-b border-[#e4e2e2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1A365D] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-sm">hub</span>
              </div>
              <span className="font-bold text-xl text-[#1A365D]">Medical Research Platform</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a className="text-[#404751] hover:text-[#1b1c1c] font-medium" href="#">Trang chủ</a>
              <a className="text-[#404751] hover:text-[#1b1c1c] font-medium" href="#">Dự đoán cặp</a>
              <a className="text-[#404751] hover:text-[#1b1c1c]" href="#">Top Thuốc</a>
              <a className="text-[#404751] hover:text-[#1b1c1c]" href="#">Tương tác</a>
              <a className="text-[#404751] hover:text-[#1b1c1c]" href="#">Đăng nhập / Đăng ký</a>
            </nav>
            <div className="hidden md:block relative">
              <input className="w-64 pl-4 pr-10 py-1.5 border border-[#c0c7d3] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#005e9f]" placeholder="Search in site" type="text"/>
              <span className="material-symbols-outlined absolute right-3 top-2 text-[#717783] text-sm">search</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <h1 className="text-[48px] leading-[1.2] font-bold text-[#1b1c1c] mb-4">Lịch sử của tôi</h1>
          <p className="text-lg text-[#404751] mb-8 max-w-2xl mx-auto">Xem lại các dự đoán trước đây của bạn, bao gồm thuốc, bệnh và đánh giá độ tin cậy.</p>
          <div className="flex justify-center gap-3">
            <button className="px-4 py-2 bg-[#e9e8e7] text-[#1b1c1c] rounded-md text-sm font-medium hover:bg-[#e4e2e2] transition-colors">Tất cả</button>
            <button className="px-4 py-2 bg-[#efeded] text-[#404751] rounded-md text-sm font-medium hover:bg-[#e9e8e7] transition-colors">Đang xử lý</button>
            <button className="px-4 py-2 bg-[#efeded] text-[#404751] rounded-md text-sm font-medium hover:bg-[#e9e8e7] transition-colors">Đã hoàn tất</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#e4e2e2]">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-6">
              <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Dự đoán gần đây</h2>
              <p className="text-lg text-[#404751]">Danh sách dưới đây được sắp xếp theo thời gian. Bạn có thể xóa từng mục bằng biểu tượng thùng rác ở cột Thao tác.</p>
            </div>
            <div className="md:col-span-6">
              <div className="bg-white rounded-xl p-6 border border-[#e4e2e2] shadow-sm flex gap-6 items-start">
                <div className="w-24 h-24 bg-[#efeded] rounded-lg shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#717783] text-3xl">table_chart</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#1b1c1c] mb-2">Bảng dữ liệu</h3>
                  <p className="text-[#404751] mb-4">Lịch sử dự đoán<br/>Bố cục bảng rộng, có khoảng đệm rõ ràng, ưu tiên khả năng đọc và thao tác nhanh.</p>
                  <div className="flex gap-2">
                    <span className="text-xs font-medium bg-[#efeded] px-2.5 py-1 rounded text-[#404751]">Bảng</span>
                    <span className="text-xs font-medium bg-[#efeded] px-2.5 py-1 rounded text-[#404751]">Dữ liệu</span>
                    <span className="text-xs font-medium bg-[#efeded] px-2.5 py-1 rounded text-[#404751]">Thao tác</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#e4e2e2]">
          <div className="text-center mb-12">
            <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Bộ lọc nhanh</h2>
            <p className="text-lg text-[#404751] max-w-2xl mx-auto">Thu hẹp kết quả theo thời gian và nội dung tìm kiếm (ví dụ: tên thuốc hoặc tên bệnh).</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-[#e4e2e2] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#efeded] h-48 flex items-center justify-center relative p-4">
                <span className="absolute top-4 left-4 text-xs font-medium bg-[#e9e8e7] px-2 py-1 rounded text-[#404751]">Lọc</span>
                <span className="text-[#717783] font-medium">Biểu tượng lịch</span>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-sm text-[#404751] mb-1">Khoảng thời gian</p>
                <h3 className="font-bold text-xl text-[#1b1c1c] mb-4">7 ngày / 30 ngày / 90 ngày</h3>
                <div className="flex gap-2 text-[#717783]">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e4e2e2] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#efeded] h-48 flex items-center justify-center relative p-4">
                <span className="absolute top-4 left-4 text-xs font-medium bg-[#e9e8e7] px-2 py-1 rounded text-[#404751]">Tìm</span>
                <span className="text-[#717783] font-medium">Biểu tượng thẻ tìm kiếm</span>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-sm text-[#404751] mb-1">Tìm kiếm</p>
                <h3 className="font-bold text-xl text-[#1b1c1c] mb-4">Nhập tên thuốc hoặc tên bệnh</h3>
                <div className="flex gap-2 text-[#717783]">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e4e2e2] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#efeded] h-48 flex items-center justify-center relative p-4">
                <span className="absolute top-4 left-4 text-xs font-medium bg-[#e9e8e7] px-2 py-1 rounded text-[#404751]">Chọn</span>
                <span className="text-[#717783] font-medium">Biểu tượng bộ lọc</span>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-sm text-[#404751] mb-1">Trạng thái</p>
                <h3 className="font-bold text-xl text-[#1b1c1c] mb-4">Tất cả / Hoàn tất</h3>
                <div className="flex gap-2 text-[#717783]">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#e4e2e2]">
          <div className="grid md:grid-cols-12 gap-12 items-start mb-12">
            <div className="md:col-span-6">
              <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Bảng Lịch sử Dự đoán</h2>
              <p className="text-lg text-[#404751]">Hàng và cột rõ ràng, tương phản đủ để người dùng đọc nhanh. Cột Thao tác chỉ hiển thị icon thùng rác.</p>
            </div>
            <div className="md:col-span-6">
              <div className="bg-white rounded-xl p-6 border border-[#e4e2e2] shadow-sm flex gap-6 items-start">
                <div className="w-24 h-24 bg-[#efeded] rounded-lg shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#717783] text-3xl">view_list</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#1b1c1c] mb-2">Bảng dữ liệu (wireframe)</h3>
                  <p className="text-[#404751] mb-4">Columns: Ngày tháng | Tên Thuốc | Tên Bệnh | Điểm số | Độ tin cậy | Thao tác....</p>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-[#717783] bg-[#efeded] p-1 rounded">delete</span>
                    <span className="text-xs font-medium bg-[#efeded] px-2.5 py-1.5 rounded text-[#404751] flex items-center">Bảng rộng</span>
                    <span className="text-xs font-medium bg-[#efeded] px-2.5 py-1.5 rounded text-[#404751] flex items-center">Phân tách hàng</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e4e2e2] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fbf9f8] text-[#404751] text-sm border-b border-[#e4e2e2]">
                    <th className="px-6 py-4 font-semibold">Ngày tháng</th>
                    <th className="px-6 py-4 font-semibold">Tên Thuốc</th>
                    <th className="px-6 py-4 font-semibold">Tên Bệnh</th>
                    <th className="px-6 py-4 font-semibold">Điểm số</th>
                    <th className="px-6 py-4 font-semibold">Độ tin cậy</th>
                    <th className="px-6 py-4 font-semibold text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e2e2]">
                  <tr className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#404751] whitespace-nowrap">2026-06-03 09:30</td>
                    <td className="px-6 py-4 font-medium text-[#1b1c1c]">Aspirin</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">Asthma</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">92.5%</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d2e4ff] text-[#001d36]">Cao</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#404751] whitespace-nowrap">2026-06-03 08:15</td>
                    <td className="px-6 py-4 font-medium text-[#1b1c1c]">Aspirin</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">Ibuprofen (Tương tác)</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">-</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e9e8e7] text-[#1b1c1c]">Có tương tác</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#404751] whitespace-nowrap">2026-06-02 15:45</td>
                    <td className="px-6 py-4 font-medium text-[#1b1c1c]">Top 5</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">Diabetes</td>
                    <td className="px-6 py-4 text-[#1b1c1c]">-</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e9e8e7] text-[#1b1c1c]">Hoàn thành</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#e4e2e2]">
          <div className="text-center mb-12">
            <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Phân trang</h2>
            <p className="text-lg text-[#404751]">Điều khiển phân trang chuẩn, đặt ở góc dưới bên phải của khu vực bảng.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-sm font-semibold text-[#1b1c1c] mb-2">Tổng số trang</label>
                <input className="w-full p-3 border border-[#c0c7d3] rounded-md text-sm focus:ring-[#005e9f] focus:border-[#005e9f]" placeholder="Trang 1 / 20" readOnly type="text" defaultValue="Trang 1 / 20"/>
                <p className="mt-2 text-xs text-[#404751]">Hiển thị số trang và tổng kết quả (nếu có).</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1b1c1c] mb-2">Điều hướng</label>
                <div className="w-full p-3 border border-[#c0c7d3] rounded-md text-sm bg-white flex items-center text-[#404751]">
                  <span className="text-[#717783] mr-2 cursor-not-allowed">« Prev</span> |
                  <span className="mx-2 font-medium text-[#005e9f] cursor-pointer">1</span>
                  <span className="mx-2 hover:text-[#1b1c1c] cursor-pointer">2</span>
                  <span className="mx-2 hover:text-[#1b1c1c] cursor-pointer">3</span>
                  <span className="mx-2">...</span>
                  <span className="mx-2 hover:text-[#1b1c1c] cursor-pointer">20</span> |
                  <span className="ml-2 hover:text-[#1b1c1c] cursor-pointer">Next »</span>
                </div>
                <p className="mt-2 text-xs text-[#404751]">Nút Prev/Next vô hiệu hóa khi không thể truy cập.</p>
              </div>
            </div>
            <div className="flex justify-center">
              <button className="bg-black text-white px-12 py-3 rounded-lg font-medium shadow-sm hover:bg-gray-800 transition-colors">
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#e4e2e2] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center gap-8 text-sm text-[#1b1c1c] font-medium text-center">
          <span>© 2026 Ứng dụng Dự đoán</span>
          <a className="hover:text-[#005e9f] transition-colors" href="#">Trợ giúp</a>
          <a className="hover:text-[#005e9f] transition-colors" href="#">Điều khoản</a>
          <a className="hover:text-[#005e9f] transition-colors" href="#">Bảo mật</a>
        </div>
      </footer>
    </div>
  );
};

export default History;