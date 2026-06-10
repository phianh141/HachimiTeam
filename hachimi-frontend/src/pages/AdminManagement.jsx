import React from 'react';

const AdminManagement = () => {
  return (
    <div className="flex flex-col min-h-screen text-[#1b1c1c] bg-[#fbf9f8] font-sans">
      <header className="bg-[#fbf9f8] border-b border-[#c0c7d3] w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#005e9f] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <span className="text-[18px] font-bold text-[#1b1c1c]">Medical Research Platform</span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Trang chủ</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Dự đoán cặp</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Top Thuốc</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Tương tác</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white border border-[#c0c7d3] rounded-full px-4 py-2">
              <input className="bg-transparent border-none focus:ring-0 text-[16px] w-48 placeholder:text-[#717783] outline-none" placeholder="Tìm kiếm..." type="text"/>
              <span className="material-symbols-outlined text-[#717783]">search</span>
            </div>
            <button className="text-[#005e9f] font-semibold hover:bg-[#efeded] px-4 py-2 rounded-lg transition-colors">Đăng nhập</button>
            <button className="bg-[#005e9f] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#0077c8] transition-colors shadow-sm">Đăng ký</button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 max-w-[1200px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-[#c0c7d3] py-8 px-4 gap-2 h-[calc(100vh-80px)] sticky top-[80px]">
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#efeded] transition-colors" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-[14px]">Tổng quan</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#d2e4ff] text-[#001d36] font-bold transition-colors" href="#">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            <span className="font-semibold text-[14px]">Người dùng</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#efeded] transition-colors" href="#">
            <span className="material-symbols-outlined">support_agent</span>
            <span className="font-semibold text-[14px]">Hỗ trợ</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#efeded] transition-colors" href="#">
            <span className="material-symbols-outlined">vpn_key</span>
            <span className="font-semibold text-[14px]">Quyền truy cập</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#404751] hover:bg-[#efeded] transition-colors" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-semibold text-[14px]">Cài đặt</span>
          </a>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-12 py-8 flex flex-col gap-20">
          <section className="flex flex-col items-center text-center max-w-2xl mx-auto gap-6">
            <div>
              <h1 className="text-[48px] font-bold text-[#1b1c1c] mb-2 leading-tight">Quản lý Người dùng</h1>
              <p className="text-[18px] text-[#404751]">Quản lý tài khoản, vai trò và trạng thái hệ thống.</p>
            </div>
            <div className="w-full max-w-md bg-white border border-[#c0c7d3] rounded-full flex items-center px-4 py-3 shadow-sm">
              <input className="flex-1 bg-transparent border-none focus:ring-0 text-[16px] placeholder:text-[#717783] outline-none" placeholder="Tìm kiếm người dùng..." type="text"/>
              <span className="material-symbols-outlined text-[#717783]">search</span>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="px-6 py-3 border border-[#717783] text-[#1b1c1c] font-semibold text-[14px] rounded-lg hover:bg-[#efeded] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Xuất danh sách
              </button>
              <button className="px-6 py-3 bg-[#1b1c1c] text-[#fbf9f8] font-semibold text-[14px] rounded-lg shadow-md hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Thêm người dùng
              </button>
            </div>
          </section>
          
          <hr className="border-[#c0c7d3] border-t" />
          
          <section className="flex flex-col items-center gap-8 max-w-3xl mx-auto w-full">
            <div className="text-center">
              <h2 className="text-[24px] font-bold mb-2">Bộ lọc</h2>
              <p className="text-[16px] text-[#404751]">Tùy chọn nhanh để thu hẹp kết quả.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[14px] text-[#1b1c1c]">Vai trò</label>
                <div className="relative">
                  <select defaultValue="" className="w-full appearance-none bg-white border border-[#c0c7d3] rounded-lg px-4 py-3 pr-10 text-[16px] focus:border-[#005e9f] focus:ring-1 focus:ring-[#005e9f] outline-none">
                    <option disabled value="">Chọn vai trò</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Nhân viên</option>
                    <option value="guest">Khách</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#717783] pointer-events-none">expand_more</span>
                </div>
                <span className="text-[12px] text-[#717783]">VD: Admin, Nhân viên, Khách</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-[14px] text-[#1b1c1c]">Trạng thái</label>
                <div className="relative">
                  <select defaultValue="" className="w-full appearance-none bg-white border border-[#c0c7d3] rounded-lg px-4 py-3 pr-10 text-[16px] focus:border-[#005e9f] focus:ring-1 focus:ring-[#005e9f] outline-none">
                    <option disabled value="">Chọn trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="locked">Tạm khóa</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#717783] pointer-events-none">expand_more</span>
                </div>
                <span className="text-[12px] text-[#717783]">VD: Hoạt động, Tạm khóa</span>
              </div>
            </div>
            <div className="flex gap-4 w-full justify-center mt-4">
              <button className="px-8 py-3 border border-[#717783] text-[#1b1c1c] font-semibold text-[14px] rounded-lg hover:bg-[#efeded] transition-colors w-40">Đặt lại</button>
              <button className="px-8 py-3 bg-[#1b1c1c] text-[#fbf9f8] font-semibold text-[14px] rounded-lg shadow-md hover:bg-[#e4e2e2] hover:text-[#1b1c1c] transition-colors w-40">Áp dụng lọc</button>
            </div>
          </section>
          
          <hr className="border-[#c0c7d3] border-t" />
          
          <section className="flex flex-col items-center gap-8 w-full">
            <div className="text-center">
              <h2 className="text-[24px] font-bold mb-2">Tóm tắt</h2>
              <p className="text-[16px] text-[#404751]">Theo vai trò & trạng thái (mẫu hiển thị).</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-white border border-[#c0c7d3] rounded-xl p-6 flex flex-col gap-2 shadow-sm">
                <span className="text-[16px] text-[#404751]">Tổng người dùng</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-[36px] font-bold">1,248</span>
                  <span className="text-[#005e9f] font-semibold bg-[#d2e4ff] px-2 py-0.5 rounded-full text-sm">+6.2%</span>
                </div>
              </div>
              <div className="bg-white border border-[#c0c7d3] rounded-xl p-6 flex flex-col gap-2 shadow-sm border-l-4 border-l-[#005e9f]">
                <span className="text-[16px] text-[#404751]">Hoạt động</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-[36px] font-bold">1,090</span>
                  <span className="text-[#005e9f] font-semibold bg-[#d2e4ff] px-2 py-0.5 rounded-full text-sm">+3.1%</span>
                </div>
              </div>
              <div className="bg-white border border-[#c0c7d3] rounded-xl p-6 flex flex-col gap-2 shadow-sm border-l-4 border-l-[#ba1a1a]">
                <span className="text-[16px] text-[#404751]">Bị khóa</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-[36px] font-bold">58</span>
                  <span className="text-[#ba1a1a] font-semibold bg-[#ffdad6] px-2 py-0.5 rounded-full text-sm">-0.8%</span>
                </div>
              </div>
            </div>
          </section>
          
          <hr className="border-[#c0c7d3] border-t" />
          
          <section className="flex flex-col gap-6 w-full">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[24px] font-bold mb-2">Danh sách người dùng</h2>
                <p className="text-[16px] text-[#404751]">Bảng dữ liệu toàn chiều rộng với thao tác Sửa/Xóa.</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-[#c0c7d3] rounded-lg hover:bg-[#efeded] text-[#404751] transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
                <button className="p-2 border border-[#c0c7d3] rounded-lg hover:bg-[#efeded] text-[#404751] transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
              </div>
            </div>
            <div className="bg-white border border-[#c0c7d3] rounded-xl overflow-hidden shadow-sm overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#efeded] border-b border-[#c0c7d3] text-[#404751] font-semibold text-sm uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Tên người dùng</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Vai trò</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-[16px] divide-y divide-[#c0c7d3]">
                  <tr className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="p-4 text-[#404751] font-mono text-sm">USR-001</td>
                    <td className="p-4 font-semibold text-[#1b1c1c] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#d2e4ff] text-[#005e9f] flex items-center justify-center font-bold text-xs">NT</div>
                      Nguyễn Văn A
                    </td>
                    <td className="p-4 text-[#404751]">nguyenvana@medplatform.example</td>
                    <td className="p-4"><span className="bg-[#e4e2e2] text-[#404751] px-2 py-1 rounded-md text-xs font-semibold">Admin</span></td>
                    <td className="p-4"><span className="flex items-center gap-1 text-[#005e9f]"><span className="w-2 h-2 rounded-full bg-[#005e9f]"></span> Hoạt động</span></td>
                    <td className="p-4 text-right">
                      <button className="text-[#717783] hover:text-[#005e9f] transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f3] transition-colors">
                    <td className="p-4 text-[#404751] font-mono text-sm">USR-002</td>
                    <td className="p-4 font-semibold text-[#1b1c1c] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c0c7cf] text-[#555c63] flex items-center justify-center font-bold text-xs">TB</div>
                      Trần Thị B
                    </td>
                    <td className="p-4 text-[#404751]">tranthib@medplatform.example</td>
                    <td className="p-4"><span className="bg-[#e4e2e2] text-[#404751] px-2 py-1 rounded-md text-xs font-semibold">Nhân viên</span></td>
                    <td className="p-4"><span className="flex items-center gap-1 text-[#005e9f]"><span className="w-2 h-2 rounded-full bg-[#005e9f]"></span> Hoạt động</span></td>
                    <td className="p-4 text-right">
                      <button className="text-[#717783] hover:text-[#005e9f] transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#f5f3f3] transition-colors opacity-75">
                    <td className="p-4 text-[#404751] font-mono text-sm">USR-003</td>
                    <td className="p-4 font-semibold text-[#1b1c1c] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e4e2e2] text-[#404751] flex items-center justify-center font-bold text-xs">LC</div>
                      Lê Văn C
                    </td>
                    <td className="p-4 text-[#404751]">levanc@medplatform.example</td>
                    <td className="p-4"><span className="bg-[#e4e2e2] text-[#404751] px-2 py-1 rounded-md text-xs font-semibold">Khách</span></td>
                    <td className="p-4"><span className="flex items-center gap-1 text-[#ba1a1a]"><span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Tạm khóa</span></td>
                    <td className="p-4 text-right">
                      <button className="text-[#717783] hover:text-[#005e9f] transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="text-[#717783] hover:text-[#ba1a1a] transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 border-t border-[#c0c7d3] flex justify-between items-center bg-white">
                <span className="text-sm text-[#404751]">Hiển thị 1-3 của 1,248</span>
                <div className="flex gap-1">
                  <button className="p-1 border border-[#c0c7d3] rounded hover:bg-[#efeded] disabled:opacity-50"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                  <button className="p-1 border border-[#c0c7d3] rounded hover:bg-[#efeded]"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <footer className="bg-[#fbf9f8] border-t border-[#c0c7d3] mt-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8 w-full max-w-[1200px] mx-auto items-center">
          <div className="text-[16px] text-[#404751]">
            © 2026 Medical Research Platform. Bảo lưu mọi quyền.
          </div>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Chính sách quyền riêng tư</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">Điều khoản sử dụng</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="mailto:research@medplatform.example">research@medplatform.example</a>
            <a className="text-[#404751] font-semibold hover:text-[#005e9f] transition-colors" href="#">docs.medplatform.example</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminManagement;