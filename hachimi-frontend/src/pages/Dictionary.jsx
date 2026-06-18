import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dictionary = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('drugs');
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drugsRes, diseasesRes] = await Promise.all([
          api.get('/drugs'),
          api.get('/diseases')
        ]);
        setDrugs(drugsRes.data);
        setDiseases(diseasesRes.data);
      } catch (err) {
        console.error('Lỗi khi tải từ điển:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredDrugs = drugs.filter(d => d.drug_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDiseases = diseases.filter(d => d.disease_name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-[#FAFAFA] text-slate-900 text-base min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ==================== HEADER ==================== */}
      <header className="bg-white border-b border-slate-200 w-full sticky top-0 z-50">
        <div className="flex justify-between items-center px-8 py-5 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Medical Research Platform</span>
            </div>
            <nav className="hidden md:flex items-center gap-10">
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/">Trang chủ</Link>
              <Link className="text-[#0052CC] border-b-2 border-[#0052CC] transition-colors text-lg font-bold pb-1" to="/dictionary">Từ điển</Link>
              <Link className="text-slate-600 hover:text-[#0052CC] transition-colors text-lg font-bold" to="/dashboard/predict-single">Dự đoán</Link>
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden sm:block">
              <input
                className="pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base font-medium focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] w-72 transition-all"
                placeholder="Tìm kiếm..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
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
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 flex flex-col items-center max-w-screen-2xl mx-auto w-full px-8 py-16">
        
        {/* Title */}
        <div className="text-center max-w-3xl mb-14">
          <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">Từ điển Y sinh</h1>
          <p className="text-xl text-slate-600">Tra cứu thông tin chi tiết về các loại thuốc và bệnh lý có trong cơ sở dữ liệu hệ thống.</p>
        </div>

        {/* Search & Tabs */}
        <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col gap-8 mb-12">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 border-b border-slate-200 pb-4">
            <button 
              className={`px-8 py-3 text-lg font-bold rounded-xl transition-all ${activeTab === 'drugs' ? 'bg-[#0052CC] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
              onClick={() => setActiveTab('drugs')}
            >
              <span className="flex items-center gap-2"><span className="material-symbols-outlined">medication</span> Danh mục Thuốc</span>
            </button>
            <button 
              className={`px-8 py-3 text-lg font-bold rounded-xl transition-all ${activeTab === 'diseases' ? 'bg-[#0052CC] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
              onClick={() => setActiveTab('diseases')}
            >
              <span className="flex items-center gap-2"><span className="material-symbols-outlined">coronavirus</span> Danh mục Bệnh</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input 
                className="w-full pl-14 pr-6 py-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-lg font-medium focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 transition-all" 
                placeholder={`Tìm kiếm ${activeTab === 'drugs' ? 'thuốc' : 'bệnh'} theo tên...`}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-[28px]">search</span>
            </div>
            <button className="px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl shadow-md hover:bg-[#0052CC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span> Lọc
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="w-full max-w-5xl">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Kết quả ({activeTab === 'drugs' ? 'Thuốc' : 'Bệnh'})</h2>
            <span className="text-base font-medium text-slate-500">
              Hiển thị {activeTab === 'drugs' ? filteredDrugs.length : filteredDiseases.length} kết quả
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin h-10 w-10 text-[#0052CC]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === 'drugs' ? (
                // Drug Cards
                filteredDrugs.length > 0 ? filteredDrugs.map(drug => (
                  <div key={drug.drug_id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#0052CC] transition-all group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[32px]">medication</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#0052CC] transition-colors">{drug.drug_name}</h3>
                        <p className="text-sm text-slate-500 mb-3 font-mono">ID: {drug.drug_id}</p>
                        <p className="text-base text-slate-600 line-clamp-2">{drug.description || 'Chưa có mô tả chi tiết.'}</p>
                      </div>
                    </div>
                  </div>
                )) : <div className="col-span-2 text-center text-slate-500 py-10">Không tìm thấy thuốc nào.</div>
              ) : (
                // Disease Cards
                filteredDiseases.length > 0 ? filteredDiseases.map(disease => (
                  <div key={disease.disease_id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#0052CC] transition-all group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[32px]">coronavirus</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#0052CC] transition-colors">{disease.disease_name}</h3>
                        <p className="text-sm text-slate-500 mb-3 font-mono">ID: {disease.disease_id}</p>
                        <p className="text-base text-slate-600 line-clamp-2">{disease.description || 'Chưa có mô tả chi tiết.'}</p>
                      </div>
                    </div>
                  </div>
                )) : <div className="col-span-2 text-center text-slate-500 py-10">Không tìm thấy bệnh nào.</div>
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-12 gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0052CC] text-white font-bold shadow-md">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors">2</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors">3</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900">
                Medical Research Platform
              </h3>
              <p className="mt-2 text-base text-slate-600 leading-relaxed max-w-sm mx-auto md:mx-0">
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

export default Dictionary;
