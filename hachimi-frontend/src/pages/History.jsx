import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'high'
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

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

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const requestDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeletingId(id);
    setDeleteConfirmId(null);
    try {
      await api.delete(`/auth/history/${id}`);
      setHistory(prev => prev.filter(item => item.id !== id));
      showToast('Đã xóa lịch sử tra cứu thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      showToast('Không thể xóa bản ghi. Vui lòng thử lại sau.');
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
    <div className="flex flex-col gap-8 w-full animate-fadeIn">
      <h2 className="text-3xl font-bold text-slate-900 pb-4 border-b border-slate-200">Lịch sử hoạt động</h2>
      
      {/* Bộ lọc */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full relative">
          <label className="block text-sm font-bold text-slate-700 mb-2">Tìm kiếm</label>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên thuốc hoặc tên bệnh..."
            className="w-full pl-11 pr-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-all bg-white"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-[36px] text-slate-400">search</span>
        </div>
        
        <div className="w-full md:w-1/3 shrink-0">
          <label className="block text-sm font-bold text-slate-700 mb-2">Lọc theo độ tin cậy</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] transition-all bg-white cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="high">Chỉ hiện Độ tin cậy Cao</option>
          </select>
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-200">
                    <th className="px-8 py-5 font-bold">Thời gian</th>
                    <th className="px-8 py-5 font-bold">Tên Thuốc</th>
                    <th className="px-8 py-5 font-bold">Tên Bệnh</th>
                    <th className="px-8 py-5 font-bold">Điểm liên kết</th>
                    <th className="px-8 py-5 font-bold">Độ tin cậy</th>
                    <th className="px-8 py-5 font-bold text-center w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-16 text-center text-slate-500 font-medium">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052CC]"></div>
                          Đang tải dữ liệu...
                        </div>
                      </td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-16 text-center text-slate-500 font-medium">
                        <div className="flex flex-col items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">history</span>
                          <p>Không tìm thấy lịch sử dự đoán nào phù hợp.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredHistory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-900">{item.drug_name}</td>
                      <td className="px-8 py-5 font-medium text-slate-700">{item.disease_name}</td>
                      <td className="px-8 py-5">
                        <span className="text-lg font-bold text-[#0052CC]">{(item.score * 100).toFixed(2)}%</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold shadow-sm border ${
                          item.confidence === 'High' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.confidence === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {item.confidence === 'High' ? 'Cao' : item.confidence === 'Medium' ? 'Trung bình' : 'Thấp'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <button 
                          onClick={() => requestDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 mx-auto"
                          title="Xóa bản ghi"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl text-rose-600">delete_forever</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Xóa lịch sử</h3>
            <p className="text-slate-500 text-center mb-8">Bạn có chắc chắn muốn xóa bản ghi phân tích này không? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/30"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            <span className="font-medium text-lg">{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;