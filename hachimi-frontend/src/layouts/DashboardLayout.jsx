import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, Beaker, FileSearch, History, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xử lý đăng xuất tạm thời
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  // Danh sách các menu chức năng
  const menuItems = [
    { path: '/dashboard/predict-single', name: 'Dự đoán Cặp (F1)', icon: <Beaker size={20} /> },
    { path: '/dashboard/predict-top5', name: 'Top 5 Thuốc (F2)', icon: <Activity size={20} /> },
    { path: '/dashboard/interactions', name: 'Tương tác (F3)', icon: <FileSearch size={20} /> },
    { path: '/dashboard/history', name: 'Lịch sử', icon: <History size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Cột Menu bên trái (Sidebar) */}
      <aside className="w-64 bg-card border-r flex flex-col shadow-sm">
        <div className="h-16 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-primary">Hachimi DDA</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className={`w-full justify-start gap-3 mb-2 ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:text-primary'}`}
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
            <LogOut size={20} />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Khu vực nội dung chính bên phải */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center px-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Hệ thống dự đoán liên kết Thuốc - Bệnh</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 bg-secondary/10">
          {/* Outlet là nơi các file như PredictLink.jsx sẽ được nhúng vào */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;