
import React, { useState } from 'react';
import { X, Briefcase, Search, Download, TrendingUp, Users, Package, DollarSign, ArrowRight, Filter, ShoppingBag } from 'lucide-react';
import { Product, ItemType, OrderStatus } from '../types';

interface AgencyHubProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onImportProduct: (product: Product) => void;
  currentUserId: string;
}

const AgencyHub: React.FC<AgencyHubProps> = ({ isOpen, onClose, products, onImportProduct, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'MY_AGENCY'>('MARKETPLACE');
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc các sản phẩm cho phép bán lại và không phải của chính mình
  const wholesaleProducts = products.filter(p => 
    p.allowResell && 
    p.sellerId !== currentUserId && 
    p.status === OrderStatus.AVAILABLE &&
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Giả lập thống kê đại lý của user hiện tại
  const myAgencyStats = {
      totalResellers: 15,
      totalSalesFromResellers: 12500,
      activeProducts: products.filter(p => p.sellerId === currentUserId && p.allowResell).length
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-gray-300">
        
        {/* Header */}
        <div className="bg-[#131921] p-6 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                    <Briefcase size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight">Agency <span className="text-purple-400">Network</span></h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hệ thống phân phối & Dropship toàn cầu</p>
                </div>
            </div>
            <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-all border-2 border-gray-600"><X size={24} className="text-gray-700"/></button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b-2 border-gray-300 px-6 pt-4 flex gap-6 shrink-0">
            <button 
                onClick={() => setActiveTab('MARKETPLACE')}
                className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-4 transition-all ${
                    activeTab === 'MARKETPLACE' 
                    ? 'border-purple-600 text-purple-700' 
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
            >
                <Search size={18}/> Tìm nguồn hàng
            </button>
            <button 
                onClick={() => setActiveTab('MY_AGENCY')}
                className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-4 transition-all ${
                    activeTab === 'MY_AGENCY' 
                    ? 'border-purple-600 text-purple-700' 
                    : 'border-transparent text-gray-700 hover:text-gray-900'
                }`}
            >
                <Users size={18}/> Quản lý đại lý của tôi
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            
            {/* TAB: MARKETPLACE */}
            {activeTab === 'MARKETPLACE' && (
                <div className="animate-in slide-in-from-right-4">
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1 bg-white p-2 rounded-xl border-2 border-gray-300 flex items-center gap-3 shadow-sm">
                            <Search className="text-gray-500 ml-2" size={20}/>
                            <input 
                                placeholder="Tìm sản phẩm để bán..." 
                                className="flex-1 outline-none text-sm font-medium text-gray-900"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-bold text-gray-700 flex items-center gap-2 hover:bg-gray-50">
                            <Filter size={18}/> Bộ lọc
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wholesaleProducts.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 opacity-50"/>
                                <p className="font-medium text-gray-700">Không tìm thấy sản phẩm nào đang tuyển đại lý.</p>
                            </div>
                        ) : (
                            wholesaleProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-2xl p-4 border-2 border-gray-300 shadow-sm hover:border-purple-400 transition-all group flex flex-col">
                                    <div className="flex gap-4 mb-4">
                                        <img src={product.image} className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0"/>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{product.title}</h3>
                                                <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded uppercase shrink-0">
                                                    HH {product.resellCommission}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-medium">{product.description}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="font-black text-[#131921]">${product.price}</span>
                                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                                                    Lãi dự kiến: ${(product.price * (product.resellCommission || 0) / 100).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Users size={14}/> {product.resellerCount || 0} người đang bán
                                        </div>
                                        <button 
                                            onClick={() => onImportProduct(product)}
                                            className="bg-[#131921] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-600 transition-colors border-2 border-gray-800"
                                        >
                                            <Download size={14}/> Nhập về kho
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB: MY AGENCY */}
            {activeTab === 'MY_AGENCY' && (
                <div className="animate-in slide-in-from-right-4">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-20"><DollarSign size={80}/></div>
                            <p className="text-purple-200 text-sm font-bold mb-1">Doanh số từ Đại lý</p>
                            <h3 className="text-3xl font-black">${myAgencyStats.totalSalesFromResellers.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Users size={20}/></div>
                                <span className="text-sm font-bold text-gray-700">Tổng Đại lý</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{myAgencyStats.totalResellers}</h3>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-300 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><ShoppingBag size={20}/></div>
                                <span className="text-sm font-bold text-gray-700">Sản phẩm đang tuyển sỉ</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{myAgencyStats.activeProducts}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <TrendingUp className="text-green-500"/> Top Đại lý xuất sắc
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${i===1 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>
                                            #{i}
                                        </div>
                                        <img src={`https://ui-avatars.com/api/?name=Reseller+${i}&background=random`} className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Đại lý {i} - Khu vực HCM</p>
                                            <p className="text-xs text-gray-600 font-medium">Đã bán: {100 - i*10} đơn</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#131921]">${(5000 - i*500).toLocaleString()}</p>
                                        <p className="text-[10px] text-green-600 font-bold">+12% tháng này</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => alert('Chức năng báo cáo chi tiết đang được phát triển...')}
                            className="w-full mt-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 border-2 border-gray-300 hover:border-gray-400 hover:shadow-md transform hover:scale-[1.02]"
                        >
                            Xem tất cả báo cáo <ArrowRight size={14} className="transition-transform group-hover:translate-x-1"/>
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AgencyHub;
