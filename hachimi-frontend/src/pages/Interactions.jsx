import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Interactions = () => {
  const { user, logout } = useAuth();
  
  const [drugs, setDrugs] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const res = await api.get('/drugs');
        setDrugs(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách thuốc:', err);
      }
    };
    fetchDrugs();
  }, []);

  const handleAddDrug = () => {
    if (!currentInput.trim()) return;
    
    // Check if valid drug
    const drug = drugs.find(d => d.drug_name.toLowerCase() === currentInput.toLowerCase());
    if (!drug) {
      setError(`Thuốc "${currentInput}" không tồn tại trong hệ thống.`);
      return;
    }

    if (selectedDrugs.includes(drug.drug_name)) {
      setError(`Thuốc "${drug.drug_name}" đã được chọn.`);
      return;
    }

    if (selectedDrugs.length >= 10) {
      setError('Bạn chỉ có thể chọn tối đa 10 thuốc.');
      return;
    }

    setSelectedDrugs([...selectedDrugs, drug.drug_name]);
    setCurrentInput('');
    setError('');
    setResults(null);
  };

  const handleRemoveDrug = (drugName) => {
    setSelectedDrugs(selectedDrugs.filter(d => d !== drugName));
    setResults(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDrug();
    }
  };

  const handleCheck = async () => {
    if (selectedDrugs.length < 2) {
      setError('Vui lòng chọn ít nhất 2 loại thuốc để kiểm tra tương tác.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await api.post('/interactions/check', {
        drug_names: selectedDrugs
      });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Có lỗi xảy ra khi kiểm tra tương tác.');
    } finally {
      setLoading(false);
    }
  };

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
            </nav>
            
            <div className="flex items-center gap-8">
              <div className="hidden md:block relative">
                <input 
                  className="w-72 pl-5 pr-12 py-2.5 border border-slate-300 bg-slate-50 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:bg-white transition-all" 
                  placeholder="Search in site..." 
                  type="text" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              </div>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 bg-[#0052CC] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-700 hidden sm:block">{user.username}</span>
                  </Link>
                  <button onClick={logout} className="text-slate-500 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50" title="Đăng xuất">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-6 py-3 text-base font-bold text-slate-700 hover:text-[#0052CC] transition-colors">Đăng nhập</Link>
                  <Link to="/register" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-base font-bold hover:bg-[#0052CC] transition-colors shadow-sm">Đăng ký</Link>
                </>
              )}
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
              
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <button 
                onClick={handleCheck}
                disabled={loading || selectedDrugs.length < 2}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-[#0052CC] hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang phân tích...' : 'Kiểm tra Tương tác'}
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
                  <h3 className="font-bold text-2xl text-slate-900 mb-1">Thuốc đã chọn ({selectedDrugs.length}/10)</h3>
                  <p className="text-base text-slate-500 mb-4">Xóa thuốc khỏi danh sách bằng nút "×"</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedDrugs.length === 0 ? (
                      <span className="text-slate-400 italic">Chưa chọn thuốc nào.</span>
                    ) : (
                      selectedDrugs.map(drug => (
                        <span key={drug} className="inline-flex items-center px-4 py-2 rounded-xl text-base font-medium bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 transition-colors">
                          {drug} <span onClick={() => handleRemoveDrug(drug)} className="ml-2 text-slate-400 cursor-pointer hover:text-red-500 font-bold">×</span>
                        </span>
                      ))
                    )}
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
                  <div className="relative w-full flex gap-3">
                    <input 
                      list="drugs-list"
                      className="w-full p-4 border border-slate-300 rounded-2xl text-lg focus:ring-2 focus:ring-[#0052CC] focus:border-[#0052CC] shadow-inner transition-all" 
                      placeholder='Gõ để tìm kiếm...' 
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <datalist id="drugs-list">
                      {drugs.map(d => (
                        <option key={d.drug_id} value={d.drug_name} />
                      ))}
                    </datalist>
                    <button 
                      onClick={handleAddDrug}
                      className="bg-slate-100 text-slate-700 px-6 rounded-2xl font-bold hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                      Thêm
                    </button>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Tự động gợi ý</span>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">Nhấn Enter để thêm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== DETAILED RESULTS SECTION ==================== */}
        {results && (
          <>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center border-b border-slate-200">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Kết Quả Phân Tích</h2>
              <p className="text-xl text-slate-600 mb-8">Đã kiểm tra {results.total_pairs_checked} cặp tương tác từ {results.total_drugs} thuốc.</p>
            </div>

            <div className="bg-slate-50 py-16 lg:py-20 border-t border-slate-200">
              <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                  
                  <div className="lg:col-span-4 lg:sticky lg:top-32">
                    <div className="bg-white p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${results.interactions_found > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <span className="material-symbols-outlined text-3xl">{results.interactions_found > 0 ? 'warning' : 'check_circle'}</span>
                      </div>
                      <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        Phát hiện<br/>
                        <span className={results.interactions_found > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {results.interactions_found} tương tác
                        </span>
                      </h2>
                      <p className="text-lg text-slate-600 leading-relaxed">
                        {results.interactions_found > 0 
                          ? "Xem chi tiết từng tương tác theo cặp thuốc. Dữ liệu được tổng hợp và đối chiếu từ các nguồn y khoa uy tín." 
                          : "Không tìm thấy tương tác nào giữa các thuốc đã chọn dựa trên cơ sở dữ liệu hiện tại."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 space-y-8">
                    {results.interactions.map((interaction, idx) => (
                      <div key={idx} className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col sm:flex-row gap-8 items-start">
                        <img 
                          src="/bệnh lý.jpg" 
                          alt="Bệnh lý" 
                          className="w-24 h-24 rounded-2xl shrink-0 object-cover bg-slate-50 border border-slate-100 hidden sm:block" 
                        />
                        <div className="flex-grow w-full">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-rose-50 text-rose-700 text-sm font-bold rounded-lg border border-rose-200">
                              Cảnh báo tương tác
                            </span>
                          </div>
                          
                          <div className="inline-flex items-center text-xl text-slate-500 mb-4 font-bold bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[#0052CC]">{interaction.drug_a}</span>
                            <span className="material-symbols-outlined text-xl mx-4 text-slate-400">sync_alt</span>
                            <span className="text-rose-600">{interaction.drug_b}</span>
                          </div>
                          
                          <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            {interaction.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 border-t border-slate-100 pt-5">
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                            <span>Nguồn: {interaction.source}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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