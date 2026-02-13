
import React, { useState, useMemo } from 'react';
import { X, Users, DollarSign, Calendar, Shield, TrendingUp, Search, ArrowDown, Settings, GitBranch, Terminal, Activity, Server, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MOCK_ALL_USERS, MOCK_TRANSACTIONS } from '../data';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimeRange = 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
type AdminTab = 'OVERVIEW' | 'USERS' | 'SYSTEM';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [timeRange, setTimeRange] = useState<TimeRange>('MONTH');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Logic Statistics ---
  const stats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // 1. Filter Transactions by Time
    const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
      const tDate = new Date(t.timestamp);
      switch (timeRange) {
        case 'DAY': return tDate >= startOfToday;
        case 'WEEK': return tDate >= startOfWeek;
        case 'MONTH': return tDate >= startOfMonth;
        case 'QUARTER': return tDate >= startOfQuarter;
        case 'YEAR': return tDate >= startOfYear;
        default: return true;
      }
    });

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    // 2. Calculate Revenue Per User
    const userStats = MOCK_ALL_USERS.map(user => {
      const userTrans = filteredTransactions.filter(t => t.userId === user.id);
      const revenue = userTrans.reduce((sum, t) => sum + t.amount, 0);
      const orderCount = userTrans.length;
      return {
        ...user,
        revenue,
        orderCount
      };
    });

    // 3. Sort & Filter Users
    const processedUsers = userStats
        .filter(u => 
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b.revenue - a.revenue); // Sort by revenue desc

    return {
      totalUsers: MOCK_ALL_USERS.length,
      activeUsers: MOCK_ALL_USERS.filter(u => new Date(u.joinDate).getFullYear() === 2023).length, // Mock logic
      totalRevenue,
      users: processedUsers
    };

  }, [timeRange, searchTerm]);

  const getTimeLabel = () => {
      switch(timeRange) {
          case 'DAY': return 'Hôm nay';
          case 'WEEK': return 'Tuần này';
          case 'MONTH': return 'Tháng này';
          case 'QUARTER': return 'Quý này';
          case 'YEAR': return 'Năm nay';
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-7xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom-5 border border-gray-200">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-[#131921] p-2 rounded-lg text-white shadow-lg">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h1 className="font-black text-gray-900 tracking-tight text-lg">Admin</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Control Center</p>
                    </div>
                </div>
            </div>
            
            <nav className="p-4 space-y-2 flex-1">
                {[
                    { id: 'OVERVIEW', label: 'Tổng quan', icon: Activity },
                    { id: 'USERS', label: 'Người dùng', icon: Users },
                    { id: 'SYSTEM', label: 'Cấu hình hệ thống', icon: Settings }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as AdminTab)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
                            activeTab === item.id 
                            ? 'bg-[#131921] text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon size={18} /> {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 bg-gray-50 m-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-green-600 uppercase">System Stable</span>
                </div>
                <p className="text-[10px] text-gray-400">v2.4.0 (Build 2024)</p>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shrink-0 h-16">
                 <h2 className="font-bold text-lg text-gray-800">
                    {activeTab === 'OVERVIEW' && 'Dashboard Overview'}
                    {activeTab === 'USERS' && 'User Management'}
                    {activeTab === 'SYSTEM' && 'System Settings & Deploy'}
                 </h2>
                 <div className="flex items-center gap-4">
                    {activeTab === 'OVERVIEW' && (
                        <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold border border-gray-200">
                            {(['DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'] as TimeRange[]).map(r => (
                                <button
                                    key={r}
                                    onClick={() => setTimeRange(r)}
                                    className={`px-3 py-1.5 rounded-md transition-all ${timeRange === r ? 'bg-white text-[#131921] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    )}
                    <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full text-gray-500">
                        <X size={20}/>
                    </button>
                 </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8fafc]">
                
                {/* ---------------- OVERVIEW TAB ---------------- */}
                {activeTab === 'OVERVIEW' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-[#131921] to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-6 opacity-10"><DollarSign size={100} /></div>
                                <p className="text-gray-400 font-medium mb-1">Tổng doanh thu ({getTimeLabel()})</p>
                                <h3 className="text-4xl font-black">${stats.totalRevenue.toLocaleString()}</h3>
                                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold">
                                    <TrendingUp size={16} /> +12.5% so với kỳ trước
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-6 opacity-5"><Users size={100} /></div>
                                <p className="text-gray-500 font-medium mb-1">Tổng người dùng</p>
                                <h3 className="text-4xl font-black text-gray-900">{stats.totalUsers}</h3>
                                <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm font-bold">
                                    <div className="flex -space-x-2">
                                        {MOCK_ALL_USERS.slice(0,3).map(u => (
                                            <img key={u.id} src={u.avatar} className="w-6 h-6 rounded-full border-2 border-white"/>
                                        ))}
                                    </div>
                                    User cơ sở
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-6 opacity-5"><Calendar size={100} /></div>
                                <p className="text-gray-500 font-medium mb-1">Active Users</p>
                                <h3 className="text-4xl font-black text-blue-600">{stats.activeUsers}</h3>
                                <p className="mt-4 text-xs text-gray-400">Đang online trên hệ thống</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ---------------- USERS TAB ---------------- */}
                {activeTab === 'USERS' && (
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Danh sách người dùng</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:border-[#febd69] outline-none w-64"
                                />
                            </div>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4 border-b border-gray-100">User</th>
                                    <th className="p-4 border-b border-gray-100">Role</th>
                                    <th className="p-4 border-b border-gray-100">Joined</th>
                                    <th className="p-4 border-b border-gray-100 text-right">Orders</th>
                                    <th className="p-4 border-b border-gray-100 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                                {stats.users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={user.avatar} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900">{user.fullName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.role || 'USER'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-right font-bold text-xs">{user.orderCount}</td>
                                        <td className="p-4 text-right font-bold text-[#b12704]">${user.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ---------------- SYSTEM TAB ---------------- */}
                {activeTab === 'SYSTEM' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        
                        {/* Repository Status Card */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <GitBranch className="text-[#febd69]"/> Source Control & Deployment
                            </h3>
                            
                            <div className="bg-[#1e293b] rounded-xl p-4 text-white font-mono text-sm mb-4 border border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                                        <Terminal size={14} />
                                        <span>origin/main</span>
                                    </div>
                                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold border border-green-500/30 flex items-center gap-1">
                                        <CheckCircle2 size={10} /> CONNECTED
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-purple-400">git</span> remote -v
                                </div>
                                <div className="text-gray-400 break-all pl-2 border-l-2 border-gray-600">
                                    https://github.com/Nhatlinh9898/verbose-octo-enigma.git
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Last Commit</p>
                                        <p className="text-xs text-gray-300">fe42a1: Update 3D Avatar Engine & Sketchfab Integration</p>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                        Pull & Deploy
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Build Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                                        <span className="font-bold text-gray-800">Passing (v2.4.1)</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Deployed 2 mins ago by Vercel</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Server Status</p>
                                    <div className="flex items-center gap-2">
                                        <Server size={14} className="text-blue-500"/>
                                        <span className="font-bold text-gray-800">US-East (Render)</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Uptime: 99.98%</p>
                                </div>
                            </div>
                        </div>

                        {/* Environment Variables Mock */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm opacity-70">
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Server className="text-gray-400"/> Environment Variables (Hidden)
                            </h3>
                            <div className="space-y-2">
                                {['REACT_APP_API_KEY', 'MONGO_URI', 'JWT_SECRET'].map(env => (
                                    <div key={env} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="font-mono text-xs text-gray-600 font-bold">{env}</span>
                                        <span className="text-xs text-gray-400">****************</span>
                                    </div>
                                ))}
                            </div>
                             <div className="mt-4 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
                                <AlertCircle size={14}/>
                                <span>Khu vực này bị hạn chế quyền truy cập. Vui lòng liên hệ Super Admin.</span>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
