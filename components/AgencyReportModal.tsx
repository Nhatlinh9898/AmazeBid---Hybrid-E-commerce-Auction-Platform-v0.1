import React, { useState } from 'react';
import { X, Download, Filter, TrendingUp, Users, Package, DollarSign, Calendar, ArrowUpDown, FileText, BarChart3, PieChart, Activity } from 'lucide-react';

interface AgencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReportData {
  id: string;
  resellerName: string;
  resellerLocation: string;
  totalSales: number;
  totalOrders: number;
  commissionEarned: number;
  growthRate: number;
  topProducts: string[];
  joinDate: string;
  lastOrderDate: string;
}

const AgencyReportModal: React.FC<AgencyReportModalProps> = ({ isOpen, onClose }) => {
  const [activeReport, setActiveReport] = useState<'overview' | 'sales' | 'performance' | 'products'>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [sortBy, setSortBy] = useState<'sales' | 'orders' | 'commission'>('sales');

  // Mock data for demonstration
  const reportData: ReportData[] = [
    {
      id: '1',
      resellerName: 'Đại lý Nguyễn Văn A',
      resellerLocation: 'TP.HCM - Quận 1',
      totalSales: 15420,
      totalOrders: 89,
      commissionEarned: 2313,
      growthRate: 15.2,
      topProducts: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'AirPods Pro'],
      joinDate: '2024-01-15',
      lastOrderDate: '2025-02-14'
    },
    {
      id: '2',
      resellerName: 'Đại lý Trần Thị B',
      resellerLocation: 'Hà Nội - Cầu Giấy',
      totalSales: 12350,
      totalOrders: 72,
      commissionEarned: 1852,
      growthRate: 12.8,
      topProducts: ['MacBook Air M2', 'iPad Pro', 'Apple Watch'],
      joinDate: '2024-02-20',
      lastOrderDate: '2025-02-13'
    },
    {
      id: '3',
      resellerName: 'Đại lý Lê Văn C',
      resellerLocation: 'Đà Nẵng - Hải Châu',
      totalSales: 8900,
      totalOrders: 56,
      commissionEarned: 1335,
      growthRate: 8.5,
      topProducts: ['Sony WH-1000XM5', 'JBL Flip 6', 'Kindle Paperwhite'],
      joinDate: '2024-03-10',
      lastOrderDate: '2025-02-12'
    },
    {
      id: '4',
      resellerName: 'Đại lý Phạm Thị D',
      resellerLocation: 'TP.HCM - Bình Thạnh',
      totalSales: 7650,
      totalOrders: 48,
      commissionEarned: 1147,
      growthRate: -2.3,
      topProducts: ['Xiaomi Redmi Note 13', 'Realme 12+', 'OPPO Reno 11'],
      joinDate: '2024-04-05',
      lastOrderDate: '2025-02-11'
    },
    {
      id: '5',
      resellerName: 'Đại lý Hoàng Văn E',
      resellerLocation: 'Cần Thơ - Ninh Kiều',
      totalSales: 5430,
      totalOrders: 35,
      commissionEarned: 814,
      growthRate: 5.7,
      topProducts: ['Lenovo IdeaPad', 'HP Pavilion', 'Dell Inspiron'],
      joinDate: '2024-05-12',
      lastOrderDate: '2025-02-10'
    }
  ];

  const totalStats = {
    totalResellers: reportData.length,
    totalSales: reportData.reduce((sum, r) => sum + r.totalSales, 0),
    totalOrders: reportData.reduce((sum, r) => sum + r.totalOrders, 0),
    totalCommission: reportData.reduce((sum, r) => sum + r.commissionEarned, 0),
    avgGrowthRate: reportData.reduce((sum, r) => sum + r.growthRate, 0) / reportData.length
  };

  const sortedData = [...reportData].sort((a, b) => {
    switch (sortBy) {
      case 'sales': return b.totalSales - a.totalSales;
      case 'orders': return b.totalOrders - a.totalOrders;
      case 'commission': return b.commissionEarned - a.commissionEarned;
      default: return 0;
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-7xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-gray-300">
        
        {/* Header */}
        <div className="bg-[#131921] p-6 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 p-3 rounded-2xl shadow-lg">
                    <BarChart3 size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Báo cáo <span className="text-green-400">Đại lý</span></h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Phân tích hiệu suất & Doanh thu</p>
                </div>
            </div>
            <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-all border-2 border-gray-600">
                <X size={24} className="text-gray-700"/>
            </button>
        </div>

        {/* Controls */}
        <div className="bg-white border-b-2 border-gray-300 p-4 flex justify-between items-center shrink-0">
            <div className="flex gap-2">
                {[
                    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
                    { id: 'sales', label: 'Doanh thu', icon: DollarSign },
                    { id: 'performance', label: 'Hiệu suất', icon: TrendingUp },
                    { id: 'products', label: 'Sản phẩm', icon: Package }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveReport(tab.id as any)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeReport === tab.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <tab.icon size={16}/>
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="flex gap-2">
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium"
                >
                    <option value="7d">7 ngày</option>
                    <option value="30d">30 ngày</option>
                    <option value="90d">90 ngày</option>
                    <option value="1y">1 năm</option>
                </select>
                
                <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50">
                    <Filter size={16}/> Lọc
                </button>
                
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                    <Download size={16}/> Export
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            
            {/* Overview Tab */}
            {activeReport === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Users size={20} className="opacity-80"/>
                                <span className="text-sm font-medium opacity-90">Tổng Đại lý</span>
                            </div>
                            <h3 className="text-2xl font-black">{totalStats.totalResellers}</h3>
                            <p className="text-xs opacity-80 mt-1">+2 tháng này</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={20} className="opacity-80"/>
                                <span className="text-sm font-medium opacity-90">Tổng Doanh thu</span>
                            </div>
                            <h3 className="text-2xl font-black">${totalStats.totalSales.toLocaleString()}</h3>
                            <p className="text-xs opacity-80 mt-1">+15.2% so với tháng trước</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Package size={20} className="opacity-80"/>
                                <span className="text-sm font-medium opacity-90">Tổng Đơn hàng</span>
                            </div>
                            <h3 className="text-2xl font-black">{totalStats.totalOrders}</h3>
                            <p className="text-xs opacity-80 mt-1">+8.7% so với tháng trước</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={20} className="opacity-80"/>
                                <span className="text-sm font-medium opacity-90">Hoa hồng</span>
                            </div>
                            <h3 className="text-2xl font-black">${totalStats.totalCommission.toLocaleString()}</h3>
                            <p className="text-xs opacity-80 mt-1">+12.3% so với tháng trước</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-4 text-white shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={20} className="opacity-80"/>
                                <span className="text-sm font-medium opacity-90">Tăng trưởng TB</span>
                            </div>
                            <h3 className="text-2xl font-black">{totalStats.avgGrowthRate.toFixed(1)}%</h3>
                            <p className="text-xs opacity-80 mt-1">+2.1% so với tháng trước</p>
                        </div>
                    </div>

                    {/* Performance Chart Placeholder */}
                    <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <PieChart className="text-purple-500"/> Biểu đồ hiệu suất
                        </h3>
                        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                            <p className="text-gray-500 font-medium">Biểu đồ đang được tải...</p>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <TrendingUp className="text-green-500"/> Top Đại lý xuất sắc
                            </h3>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-1 border-2 border-gray-300 rounded-lg text-sm font-medium"
                            >
                                <option value="sales">Theo Doanh thu</option>
                                <option value="orders">Theo Đơn hàng</option>
                                <option value="commission">Theo Hoa hồng</option>
                            </select>
                        </div>
                        
                        <div className="space-y-3">
                            {sortedData.slice(0, 10).map((reseller, index) => (
                                <div key={reseller.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-200 text-gray-600'
                                        }`}>
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{reseller.resellerName}</p>
                                            <p className="text-sm text-gray-600">{reseller.resellerLocation}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${reseller.totalSales.toLocaleString()}</p>
                                            <p className="text-xs text-gray-600">{reseller.totalOrders} đơn</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">${reseller.commissionEarned.toLocaleString()}</p>
                                            <p className={`text-xs font-bold ${reseller.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {reseller.growthRate >= 0 ? '+' : ''}{reseller.growthRate}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sales Tab */}
            {activeReport === 'sales' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <DollarSign className="text-green-500"/> Chi tiết Doanh thu
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left p-3 font-bold text-gray-900">Đại lý</th>
                                        <th className="text-right p-3 font-bold text-gray-900">Doanh thu</th>
                                        <th className="text-right p-3 font-bold text-gray-900">Đơn hàng</th>
                                        <th className="text-right p-3 font-bold text-gray-900">Giá trị TB</th>
                                        <th className="text-right p-3 font-bold text-gray-900">Hoa hồng</th>
                                        <th className="text-right p-3 font-bold text-gray-900">Tăng trưởng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.map((reseller) => (
                                        <tr key={reseller.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-3">
                                                <div>
                                                    <p className="font-bold text-gray-900">{reseller.resellerName}</p>
                                                    <p className="text-xs text-gray-600">{reseller.resellerLocation}</p>
                                                </div>
                                            </td>
                                            <td className="text-right p-3 font-bold text-gray-900">${reseller.totalSales.toLocaleString()}</td>
                                            <td className="text-right p-3 text-gray-700">{reseller.totalOrders}</td>
                                            <td className="text-right p-3 text-gray-700">${Math.round(reseller.totalSales / reseller.totalOrders)}</td>
                                            <td className="text-right p-3 font-bold text-green-600">${reseller.commissionEarned.toLocaleString()}</td>
                                            <td className="text-right p-3">
                                                <span className={`text-sm font-bold ${reseller.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {reseller.growthRate >= 0 ? '+' : ''}{reseller.growthRate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Performance Tab */}
            {activeReport === 'performance' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sortedData.map((reseller) => (
                            <div key={reseller.id} className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{reseller.resellerName}</h4>
                                        <p className="text-sm text-gray-600">{reseller.resellerLocation}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                                        reseller.growthRate >= 10 ? 'bg-green-100 text-green-700' :
                                        reseller.growthRate >= 0 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {reseller.growthRate >= 0 ? '+' : ''}{reseller.growthRate}%
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">Tổng doanh thu</p>
                                        <p className="font-bold text-lg text-gray-900">${reseller.totalSales.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600 font-medium">Tổng đơn hàng</p>
                                        <p className="font-bold text-lg text-gray-900">{reseller.totalOrders}</p>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-sm font-bold text-gray-900 mb-2">Sản phẩm bán chạy:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {reseller.topProducts.map((product, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                                {product}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="text-xs text-gray-600 border-t pt-3">
                                    <p>Ngày tham gia: {new Date(reseller.joinDate).toLocaleDateString('vi-VN')}</p>
                                    <p>Đơn hàng cuối: {new Date(reseller.lastOrderDate).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeReport === 'products' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Package className="text-orange-500"/> Phân tích Sản phẩm
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <p className="text-gray-500 font-medium">Biểu đồ phân tích sản phẩm đang được tải...</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900">Top sản phẩm bán chạy</h4>
                                {[
                                    { name: 'iPhone 15 Pro', sales: 45, revenue: 67500 },
                                    { name: 'Samsung Galaxy S24', sales: 38, revenue: 34200 },
                                    { name: 'MacBook Air M2', sales: 28, revenue: 44800 },
                                    { name: 'AirPods Pro', sales: 52, revenue: 15600 },
                                    { name: 'iPad Pro', sales: 22, revenue: 19800 }
                                ].map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-600">{product.sales} đơn</p>
                                        </div>
                                        <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AgencyReportModal;
