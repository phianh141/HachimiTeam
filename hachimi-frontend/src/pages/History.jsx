import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const History = () => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'high'
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/auth/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Lỗi khi tải lịch sử:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/auth/history/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      alert('Không thể xóa bản ghi. Vui lòng thử lại sau.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.disease_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'high' && item.confidence === 'High');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] font-sans">
      <header className="bg-white border-b border-[#e4e2e2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200" 
              />
              <span className="font-bold text-xl text-[#1A365D]">Medical Research Platform</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link className="text-[#404751] hover:text-[#0052CC] font-medium" to="/">Trang chủ</Link>
              <Link className="text-[#404751] hover:text-[#0052CC] font-medium" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-[#404751] hover:text-[#0052CC] font-medium" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-[#404751] hover:text-[#0052CC] font-medium" to="/dashboard/interactions">Tương tác</Link>
            </nav>
            <div className="flex items-center gap-6">
              <div className="hidden md:block relative">
                <input className="w-64 pl-4 pr-10 py-1.5 border border-[#c0c7d3] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0052CC]" placeholder="Search in site" type="text"/>
                <span className="material-symbols-outlined absolute right-3 top-1.5 text-[#717783] text-sm">search</span>
              </div>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-700 text-sm hidden sm:block">{user.username}</span>
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-rose-600 transition-colors p-1 rounded-md hover:bg-rose-50" title="Đăng xuất">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-[#0052CC] font-bold text-sm">Đăng nhập</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <h1 className="text-[48px] leading-[1.2] font-bold text-[#1b1c1c] mb-4">Lịch sử của tôi</h1>
          <p className="text-lg text-[#404751] mb-8 max-w-2xl mx-auto">Xem lại các dự đoán trước đây của bạn, bao gồm thuốc, bệnh và đánh giá độ tin cậy.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#e4e2e2]">
          <div className="text-center mb-12">
            <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Bộ lọc nhanh</h2>
            <p className="text-lg text-[#404751] max-w-2xl mx-auto">Thu hẹp kết quả tìm kiếm theo nội dung và trạng thái.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            <div className="bg-white rounded-xl border border-[#e4e2e2] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#efeded] h-24 flex items-center justify-center relative p-4">
                <span className="absolute top-4 left-4 text-xs font-medium bg-[#e9e8e7] px-2 py-1 rounded text-[#404751]">Tìm</span>
                <span className="material-symbols-outlined text-[#717783] text-4xl">search</span>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-sm text-[#404751] mb-2">Tìm kiếm tên thuốc/bệnh</p>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên thuốc hoặc tên bệnh..."
                  className="w-full p-3 border border-[#c0c7d3] rounded-md text-base focus:ring-[#0052CC] focus:border-[#0052CC]"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e4e2e2] shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#efeded] h-24 flex items-center justify-center relative p-4">
                <span className="absolute top-4 left-4 text-xs font-medium bg-[#e9e8e7] px-2 py-1 rounded text-[#404751]">Lọc</span>
                <span className="material-symbols-outlined text-[#717783] text-4xl">filter_list</span>
              </div>
              <div className="p-6 flex-grow">
                <p className="text-sm text-[#404751] mb-2">Trạng thái độ tin cậy</p>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-3 border border-[#c0c7d3] rounded-md text-base focus:ring-[#0052CC] focus:border-[#0052CC] bg-white"
                >
                  <option value="all">Tất cả</option>
                  <option value="high">Chỉ hiện Độ tin cậy Cao</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#e4e2e2]">
          <div className="grid md:grid-cols-12 gap-12 items-start mb-8">
            <div className="md:col-span-8">
              <h2 className="text-[36px] font-bold text-[#1b1c1c] mb-4">Bảng Lịch sử Dự đoán</h2>
              <p className="text-lg text-[#404751]">Danh sách các lượt dự đoán đã thực hiện.</p>
            </div>
          </div>

          <div className="bg-white border border-[#e4e2e2] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fbf9f8] text-[#404751] text-sm border-b border-[#e4e2e2]">
                    <th className="px-6 py-4 font-semibold">Thời gian</th>
                    <th className="px-6 py-4 font-semibold">Tên Thuốc</th>
                    <th className="px-6 py-4 font-semibold">Tên Bệnh</th>
                    <th className="px-6 py-4 font-semibold">Điểm số</th>
                    <th className="px-6 py-4 font-semibold">Độ tin cậy</th>
                    <th className="px-6 py-4 font-semibold text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e2e2]">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-[#404751]">Đang tải dữ liệu...</td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-[#404751]">Không có dữ liệu lịch sử nào.</td>
                    </tr>
                  ) : filteredHistory.map(item => (
                    <tr key={item.id} className="hover:bg-[#f5f3f3] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#404751] whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-[#1b1c1c]">{item.drug_name}</td>
                      <td className="px-6 py-4 text-[#1b1c1c]">{item.disease_name}</td>
                      <td className="px-6 py-4 font-bold text-[#0052CC]">{(item.score * 100).toFixed(2)}%</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.confidence === 'High' ? 'bg-[#d2e4ff] text-[#001d36]' :
                          item.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {item.confidence === 'High' ? 'Cao' : item.confidence === 'Medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="text-[#717783] hover:text-[#ba1a1a] transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {deletingId === item.id ? 'hourglass_empty' : 'delete'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#e4e2e2] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center gap-8 text-sm text-[#1b1c1c] font-medium text-center">
          <span>© 2026 Medical Research Platform</span>
          <a className="hover:text-[#0052CC] transition-colors" href="#">Trợ giúp</a>
          <a className="hover:text-[#0052CC] transition-colors" href="#">Điều khoản</a>
          <a className="hover:text-[#0052CC] transition-colors" href="#">Bảo mật</a>
        </div>
      </footer>
    </div>
  );
};

export default History;