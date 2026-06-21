import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import NetworkGraph from '../components/NetworkGraph';

const PredictLink = () => {
  const { user, logout } = useAuth();
  
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  
  const [selectedDrugName, setSelectedDrugName] = useState('');
  const [selectedDiseaseName, setSelectedDiseaseName] = useState('');
  
  const [isSearchingDrug, setIsSearchingDrug] = useState(false);
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  
  const [isSearchingDisease, setIsSearchingDisease] = useState(false);
  const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Cập nhật dropdown khi gõ (Autocomplete động)
  useEffect(() => {
    if (selectedDrugName.length >= 2) {
      setIsSearchingDrug(true);
      api.get(`/drugs/search?name=${selectedDrugName}`)
         .then(res => {
           setDrugs(res.data);
           if (res.data.length === 1 && res.data[0].drug_name === selectedDrugName) {
             setShowDrugDropdown(false);
           } else {
             setShowDrugDropdown(true);
           }
         })
         .catch(() => {})
         .finally(() => setIsSearchingDrug(false));
    } else {
      setShowDrugDropdown(false);
    }
  }, [selectedDrugName]);

  useEffect(() => {
    if (selectedDiseaseName.length >= 2) {
      setIsSearchingDisease(true);
      api.get(`/diseases/search?name=${selectedDiseaseName}`)
         .then(res => {
           setDiseases(res.data);
           if (res.data.length === 1 && res.data[0].disease_name === selectedDiseaseName) {
             setShowDiseaseDropdown(false);
           } else {
             setShowDiseaseDropdown(true);
           }
         })
         .catch(() => {})
         .finally(() => setIsSearchingDisease(false));
    } else {
      setShowDiseaseDropdown(false);
    }
  }, [selectedDiseaseName]);

  const handlePredict = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      // Find IDs based on names by calling search API directly
      const drugRes = await api.get(`/drugs/search?name=${selectedDrugName}`);
      const drug = drugRes.data.find(d => d.drug_name.toLowerCase() === selectedDrugName.toLowerCase());
      
      const diseaseRes = await api.get(`/diseases/search?name=${selectedDiseaseName}`);
      const disease = diseaseRes.data.find(d => d.disease_name.toLowerCase() === selectedDiseaseName.toLowerCase());

      if (!drug || !disease) {
        setError('Vui lòng chọn thuốc và bệnh hợp lệ từ danh sách gợi ý.');
        setLoading(false);
        return;
      }

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
              <Link className="text-blue-600 text-lg font-bold border-b-2 border-blue-600 pb-1" to="/dashboard/predict-single">Dự đoán cặp</Link>
              <Link className="text-gray-600 text-lg hover:text-blue-600 transition-colors font-medium" to="/dashboard/predict-top5">Top Thuốc</Link>
              <Link className="text-gray-600 text-lg hover:text-blue-600 transition-colors font-medium" to="/dashboard/interactions">Tương tác</Link>
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
              <p className="text-xl text-gray-600 leading-relaxed">Chọn 2 giá trị để chạy dự đoán. Gợi ý tìm kiếm sẽ tự động lọc theo tên.</p>
              
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
                <div className="relative">
                  <input 
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC] transition-all" 
                    placeholder="Gõ để tìm kiếm..." 
                    value={selectedDrugName}
                    onChange={(e) => setSelectedDrugName(e.target.value)}
                    onFocus={() => { if (selectedDrugName.length >= 2) setShowDrugDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDrugDropdown(false), 200)}
                  />
                  {isSearchingDrug && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052CC]"></div>
                    </div>
                  )}
                </div>
                {showDrugDropdown && drugs.length > 0 && (
                  <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {drugs.map(d => (
                      <li 
                        key={d.drug_id} 
                        className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-gray-700 font-medium border-b border-slate-50 last:border-b-0 transition-colors"
                        onMouseDown={() => {
                          setSelectedDrugName(d.drug_name);
                          setShowDrugDropdown(false);
                        }}
                      >
                        {d.drug_name}
                      </li>
                    ))}
                  </ul>
                )}
                {showDrugDropdown && drugs.length === 0 && selectedDrugName.length >= 2 && !isSearchingDrug && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 text-center text-gray-500">
                    Không tìm thấy thuốc phù hợp
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">Tự động gợi ý từ hệ thống</p>
              </div>
              
              {/* Bệnh Input */}
              <div className="relative">
                <label className="block text-lg font-semibold text-gray-900 mb-2">Chọn Bệnh</label>
                <div className="relative">
                  <input 
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-sm text-lg focus:ring-[#0052CC] focus:border-[#0052CC] transition-all" 
                    placeholder="Gõ để tìm kiếm..." 
                    value={selectedDiseaseName}
                    onChange={(e) => setSelectedDiseaseName(e.target.value)}
                    onFocus={() => { if (selectedDiseaseName.length >= 2) setShowDiseaseDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDiseaseDropdown(false), 200)}
                  />
                  {isSearchingDisease && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0052CC]"></div>
                    </div>
                  )}
                </div>
                {showDiseaseDropdown && diseases.length > 0 && (
                  <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {diseases.map(d => (
                      <li 
                        key={d.disease_id} 
                        className="px-5 py-3 hover:bg-slate-50 cursor-pointer text-gray-700 font-medium border-b border-slate-50 last:border-b-0 transition-colors"
                        onMouseDown={() => {
                          setSelectedDiseaseName(d.disease_name);
                          setShowDiseaseDropdown(false);
                        }}
                      >
                        {d.disease_name}
                      </li>
                    ))}
                  </ul>
                )}
                {showDiseaseDropdown && diseases.length === 0 && selectedDiseaseName.length >= 2 && !isSearchingDisease && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4 text-center text-gray-500">
                    Không tìm thấy bệnh lý phù hợp
                  </div>
                )}
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
              {/* Title Section */}
              <div className="mb-12">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">Kết quả dự đoán</h2>
                <p className="text-xl text-gray-600">Xem cặp thuốc-bệnh, điểm số và mức độ tin cậy.</p>
              </div>
              
              <div className="grid lg:grid-cols-12 gap-10 items-stretch">
                {/* Left: Huge Drug Card (col-span-8) */}
                <div className="lg:col-span-8 flex">
                  <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center w-full relative group">
                    <div className="absolute top-8 left-8 bg-blue-50 text-[#0052CC] font-bold px-5 py-2.5 rounded-xl border border-blue-100 text-lg">
                      Thuốc đã chọn
                    </div>
                    <img 
                      alt="Pills" 
                      className="w-80 h-80 object-contain rounded-3xl mb-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-md bg-slate-50 border border-slate-100 p-4" 
                      src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${result.drug_name}/PNG`} 
                      onError={(e) => { e.target.onerror = null; e.target.src = "/thuốc đã chọn.png"; }}
                    />
                    <h3 className="font-bold text-4xl text-gray-900 mb-3">{result.drug_name}</h3>
                    <p className="text-xl text-gray-500">Tên hoạt chất hóa học</p>
                  </div>
                </div>

                {/* Right: 3 Cards List (col-span-4) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Card 2: Bệnh */}
                  <div className="bg-white rounded-3xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex-1 text-left">
                    <img alt="Medical" className="w-20 h-20 object-cover rounded-2xl shadow-sm shrink-0" src="/Bệnh đã chọn.png" />
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">Bệnh đã chọn</h3>
                      <p className="text-sm text-gray-500 mb-1">Tên bệnh lý</p>
                      <p className="text-lg font-bold text-[#0052CC]">{result.disease_name}</p>
                    </div>
                  </div>

                  {/* Card 3: Điểm */}
                  <div className="bg-white rounded-3xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex-1 text-left">
                    <img alt="Medical" className="w-20 h-20 object-cover rounded-2xl shadow-sm shrink-0" src="/Điểm dự đoán.jpg" />
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">Điểm dự đoán</h3>
                      <p className="text-sm text-gray-500 mb-1">Tỷ lệ phần trăm</p>
                      <p className="text-2xl font-black text-emerald-600">{(result.score * 100).toFixed(2)}%</p>
                    </div>
                  </div>

                  {/* Card 4: Độ tin cậy */}
                  <div className="bg-white rounded-3xl p-6 flex items-center gap-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex-1 text-left">
                    <img alt="Medical" className="w-20 h-20 object-cover rounded-2xl shadow-sm shrink-0" src="/Độ tin cậy.jpg" />
                    <div className="flex flex-col justify-center">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">Độ tin cậy</h3>
                      <p className="text-sm text-gray-500 mb-2">Trạng thái phân tích</p>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${
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

              {/* Chart Section */}
              <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Biểu đồ liên kết Thuốc - Bệnh</h3>
                <NetworkGraph 
                  elements={[
                    { data: { id: result.drug_name, label: result.drug_name, type: 'center' } },
                    { data: { id: result.disease_name, label: result.disease_name, type: 'disease' } },
                    { data: { source: result.drug_name, target: result.disease_name, label: `${(result.score * 100).toFixed(2)}%` } }
                  ]}
                  height="400px"
                />
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