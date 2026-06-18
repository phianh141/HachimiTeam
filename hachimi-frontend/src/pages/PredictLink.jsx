import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PredictLink = () => {
  const { user, logout } = useAuth();
  
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const [selectedDiseaseName, setSelectedDiseaseName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Fetch all drugs and diseases for the datalist
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
        console.error('Lỗi khi tải dữ liệu cho autocomplete:', err);
      }
    };
    fetchData();
  }, []);

  const handlePredict = async () => {
    setError('');
    setResult(null);

    // Find IDs based on names
    const drug = drugs.find(d => d.drug_name === selectedDrugName);
    const disease = diseases.find(d => d.disease_name === selectedDiseaseName);

    if (!drug || !disease) {
      setError('Vui lòng chọn thuốc và bệnh hợp lệ từ danh sách gợi ý.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/predict/single', {
        drug_id: drug.drug_id,
        disease_id: disease.disease_id
      });
      setResult(response.data);
    } catch (err) {
      setError('Có lỗi xảy ra khi dự đoán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/Hachimi.jpg" 
                alt="Hachimi Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200" 
              />
              <span className="font-bold text-2xl text-[#1A365D]">Medical Research Platform</span>
            </div>
            
            <nav className="hidden md:flex space-x-10">
              <Link className="text-gray-900 text-lg font-medium" to="/">Trang chủ</Link>
              <Link className="text-[#0052CC] text-lg font-medium border-b-2 border-[#0052CC] pb-1" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-gray-600 text-lg hover:text-gray-900" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-gray-600 text-lg hover:text-gray-900" to="/dashboard/interactions">Tương tác</Link>
            </nav>
            
            <div className="flex items-center gap-8">
              <div className="hidden md:block relative">
                <input 
                  className="w-72 pl-5 pr-12 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0052CC]" 
                  placeholder="Search in site" 
                  type="text" 
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
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

      <main className="flex-grow">
        {/* BANNER */}
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 mt-8">
          <div className="relative h-[340px] lg:h-[380px] rounded-[2rem] overflow-hidden shadow-md flex items-center justify-center bg-slate-100 group">
            <img 
              alt="Banner Dự đoán cặp" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
              src="/banner-dự đoán cặp.png" 
            />
            <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply transition-colors duration-500"></div>
            
            <div className="relative z-10 text-center px-6 max-w-4xl">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-shadow-lg tracking-tight">
                Dự Đoán Cặp Thuốc - Bệnh
              </h1>
              <p className="text-lg lg:text-xl text-blue-50 leading-relaxed drop-shadow-md">
                Ứng dụng Trí tuệ nhân tạo (AI) để phân tích, đo lường điểm số liên kết và đánh giá độ tin cậy giữa một loại thuốc và một bệnh lý cụ thể.
              </p>
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="max-w-screen-2xl mx-auto px-8 py-24">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            {/* Left: Title & Desc */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">Nhập lựa chọn thuốc & bệnh</h1>
              <p className="text-xl text-gray-600 leading-relaxed">Chọn 2 giá trị để chạy dự đoán. Gợi ý tìm kiếm sẽ tự động lọc theo tên phổ biến.</p>
              
              {error && (
                <div className="mt-8 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
                  {error}
                </div>
              )}
            </div>
            
            {/* Right: Inputs */}
            <div className="space-y-8">
              {/* Thuốc Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Chọn Thuốc</label>
                <input 
                  list="drugs-list"
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC]" 
                  placeholder="Gõ để tìm kiếm..." 
                  value={selectedDrugName}
                  onChange={(e) => setSelectedDrugName(e.target.value)}
                />
                <datalist id="drugs-list">
                  {drugs.map(d => (
                    <option key={d.drug_id} value={d.drug_name} />
                  ))}
                </datalist>
                <p className="mt-2 text-sm text-gray-500">Tự động gợi ý (Autocomplete)</p>
              </div>
              
              {/* Bệnh Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Chọn Bệnh</label>
                <input 
                  list="diseases-list"
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC]" 
                  placeholder="Gõ để tìm kiếm..." 
                  value={selectedDiseaseName}
                  onChange={(e) => setSelectedDiseaseName(e.target.value)}
                />
                <datalist id="diseases-list">
                  {diseases.map(d => (
                    <option key={d.disease_id} value={d.disease_name} />
                  ))}
                </datalist>
              </div>
              
              <button 
                onClick={handlePredict}
                disabled={loading}
                className="bg-black text-white px-10 py-4 rounded-xl text-lg font-medium shadow-lg hover:bg-[#0052CC] transition-all w-full md:w-auto flex items-center justify-center"
              >
                {loading ? 'Đang phân tích...' : 'Chạy Dự Đoán'}
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="bg-[#F4F5F7] py-24">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="grid md:grid-cols-2 gap-20 items-start">
                {/* Left: Result Title */}
                <div>
                  <h2 className="text-5xl font-bold text-gray-900 mb-6">Kết quả dự đoán</h2>
                  <p className="text-xl text-gray-600">Xem cặp thuốc-bệnh, điểm số và mức độ tin cậy.</p>
                </div>
                
                {/* Right: Result Cards */}
                <div className="space-y-6">
                  {/* Card 1: Thuốc */}
                  <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                    <img alt="Pills" className="w-28 h-28 object-cover rounded-xl" src="/thuốc đã chọn.png" />
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-1">Thuốc đã chọn</h3>
                      <p className="text-base text-gray-500 mb-1">Tên thuốc</p>
                      <p className="text-xl font-medium text-gray-900">{result.drug_name}</p>
                    </div>
                  </div>

                  {/* Card 2: Bệnh */}
                  <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                    <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Bệnh đã chọn.png" />
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-1">Bệnh đã chọn</h3>
                      <p className="text-base text-gray-500 mb-1">Tên bệnh</p>
                      <p className="text-xl font-medium text-gray-900">{result.disease_name}</p>
                    </div>
                  </div>

                  {/* Card 3: Điểm */}
                  <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                    <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Điểm dự đoán.jpg" />
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-1">Điểm dự đoán</h3>
                      <p className="text-base text-gray-500 mb-1">Tỷ lệ phần trăm</p>
                      <p className="text-3xl font-bold text-gray-900">{(result.score * 100).toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Card 4: Độ tin cậy */}
                  <div className="bg-white rounded-2xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm">
                    <img alt="Medical" className="w-28 h-28 object-cover rounded-xl" src="/Độ tin cậy.jpg" />
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-1">Độ tin cậy</h3>
                      <p className="text-base text-gray-500 mb-2">Trạng thái</p>
                      <div>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border ${
                          result.confidence === 'High' ? 'bg-green-100 text-green-800 border-green-200' : 
                          result.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-rose-100 text-rose-800 border-rose-200'
                        }`}>
                          {result.confidence === 'High' ? 'Độ tin cậy cao' : result.confidence === 'Medium' ? 'Độ tin cậy trung bình' : 'Độ tin cậy thấp'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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

export default PredictLink;