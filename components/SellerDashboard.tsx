
import React, { useMemo, useState } from 'react';
import { X, TrendingUp, DollarSign, Package, Users, BarChart3, PieChart, ArrowUpRight, Link2, ExternalLink, Truck, Printer, Search, Box, AlertTriangle, RefreshCw, Archive, CheckSquare, Square } from 'lucide-react';
import { Product, OrderStatus } from '../types';

interface SellerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentUserId: string;
}

type SellerTab = 'DASHBOARD' | 'LOGISTICS' | 'WAREHOUSE';

const SellerDashboard: React.FC<SellerDashboardProps> = ({ isOpen, onClose, products, currentUserId }) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('DASHBOARD');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Logic tính toán thống kê (Giữ nguyên từ trước)
  const stats = useMemo(() => {
    const myProducts = products.filter(p => p.sellerId === currentUserId);
    const activeListings = myProducts.filter(p => p.status === OrderStatus.AVAILABLE);
    const soldOrders = myProducts.filter(p => p.status !== OrderStatus.AVAILABLE);
    const pendingOrders = soldOrders.filter(p => p.status === OrderStatus.PENDING_SHIPMENT);
    
    let totalRevenue = 0;
    let affiliateRevenue = 0;
    let physicalRevenue = 0;

    soldOrders.forEach(order => {
        if (order.isAffiliate) {
            const commission = (order.price * (order.commissionRate || 0)) / 100;
            affiliateRevenue += commission;
        } else {
            physicalRevenue += order.price;
        }
    });
    totalRevenue = physicalRevenue + affiliateRevenue;

    const categoryStats: Record<string, { count: number; revenue: number }> = {};
    soldOrders.forEach(order => {
        if (!categoryStats[order.category]) categoryStats[order.category] = { count: 0, revenue: 0 };
        categoryStats[order.category].count += 1;
        categoryStats[order.category].revenue += order.isAffiliate ? (order.price * (order.commissionRate || 0)) / 100 : order.price;
    });

    const categoryList = Object.keys(categoryStats).map(cat => ({
        name: cat,
        count: categoryStats[cat].count,
        revenue: categoryStats[cat].revenue,
        percentage: (categoryStats[cat].revenue / (totalRevenue || 1)) * 100
    })).sort((a, b) => b.revenue - a.revenue);

    return {
        totalProducts: myProducts.length,
        activeCount: activeListings.length,
        soldCount: soldOrders.length,
        pendingCount: pendingOrders.length,
        totalRevenue,
        affiliateRevenue,
        physicalRevenue,
        categoryList,
        recentOrders: soldOrders.slice(0, 5),
        allOrders: soldOrders,
        inventory: activeListings
    };
  }, [products, currentUserId]);

  const toggleOrderSelection = (id: string) => {
      setSelectedOrders(prev => prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]);
  };

  const handleBulkPrint = () => {
      if (selectedOrders.length === 0) return;
      
      const ordersToPrint = stats.allOrders.filter(o => selectedOrders.includes(o.id));
      
      // Open print window
      const win = window.open('', '', 'height=800,width=800');
      if (win) {
          const labelsHtml = ordersToPrint.map(order => `
            <div style="border: 2px dashed #000; padding: 20px; margin-bottom: 20px; page-break-inside: avoid;">
                <div style="display:flex; justify-content:space-between; border-bottom: 1px solid #000; padding-bottom:10px;">
                    <span style="font-weight:bold; font-size: 20px;">AMAZEBID</span>
                    <span style="font-weight:bold;">EXPRESS</span>
                </div>
                <div style="margin: 20px 0; font-family: monospace; font-size: 14px;">
                    <strong>ORDER ID:</strong> ${order.id}<br/>
                    <strong>DATE:</strong> ${new Date().toLocaleDateString()}
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="border: 1px solid #ccc; padding: 10px;">
                        <small>FROM:</small><br/>
                        <strong>${currentUserId} (Seller)</strong><br/>
                        AmazeBid Warehouse
                    </div>
                    <div style="border: 1px solid #ccc; padding: 10px;">
                        <small>TO:</small><br/>
                        <strong>${order.buyerInfo?.fullName || 'Guest Buyer'}</strong><br/>
                        ${order.buyerInfo?.address || 'No Address'}, ${order.buyerInfo?.city || ''}<br/>
                        Phone: ${order.buyerInfo?.phone || '---'}
                    </div>
                </div>
                <div style="margin-top: 15px; border-top: 1px solid #000; padding-top: 10px;">
                    <strong>ITEM:</strong> ${order.title} (Qty: 1)<br/>
                    <strong>COD AMOUNT:</strong> $${order.price}
                </div>
            </div>
          `).join('');

          win.document.write(`
              <html>
                  <head><title>Bulk Print Labels</title></head>
                  <body style="font-family: Arial, sans-serif; padding: 20px;">
                      ${labelsHtml}
                      <script>window.onload = function() { window.print(); window.close(); }</script>
                  </body>
              </html>
          `);
          win.document.close();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-7xl h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header Navigation */}
        <div className="bg-[#131921] p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="bg-[#febd69] p-2 rounded-lg text-black">
                    <BarChart3 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Kênh Người Bán</h2>
                    <p className="text-xs text-gray-400">Quản lý kinh doanh toàn diện</p>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-white/10 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'DASHBOARD' ? 'bg-[#febd69] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <PieChart size={16}/> Tổng quan
                </button>
                <button 
                    onClick={() => setActiveTab('LOGISTICS')}
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'LOGISTICS' ? 'bg-[#febd69] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <Truck size={16}/> Vận hành & In đơn
                    {stats.pendingCount > 0 && <span className="bg-red-600 text-white text-[10px] px-1.5 rounded-full">{stats.pendingCount}</span>}
                </button>
                <button 
                    onClick={() => setActiveTab('WAREHOUSE')}
                    className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'WAREHOUSE' ? 'bg-[#febd69] text-black' : 'text-gray-400 hover:text-white'}`}
                >
                    <Box size={16}/> Kho hàng & AI
                </button>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full transition-colors"><X size={24}/></button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8fafc]">
            
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'DASHBOARD' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    {/* Overview Cards (Same as before) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-green-100 p-2 rounded-lg text-green-700"><DollarSign size={20} /></div>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Tổng thu nhập</p>
                                <h3 className="text-2xl font-black text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><Package size={20} /></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Đơn hàng đã bán</p>
                                <h3 className="text-2xl font-black text-gray-900">{stats.soldCount}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-700"><Link2 size={20} /></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Hoa hồng Affiliate</p>
                                <h3 className="text-2xl font-black text-purple-700">${stats.affiliateRevenue.toLocaleString()}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-700"><TrendingUp size={20} /></div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Sản phẩm Active</p>
                                <h3 className="text-2xl font-black text-gray-900">{stats.activeCount}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ArrowUpRight size={18} className="text-green-600"/> Đơn hàng gần đây</h3>
                        {stats.recentOrders.length === 0 ? <p className="text-gray-400 italic text-sm">Chưa có đơn hàng.</p> : (
                            <div className="space-y-3">
                                {stats.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center gap-3 border-b border-gray-50 pb-3">
                                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center font-bold text-xs">{order.isAffiliate ? 'AFF' : 'SALE'}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-sm truncate">{order.title}</p>
                                            <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-green-600 text-sm">+${order.price}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- LOGISTICS TAB --- */}
            {activeTab === 'LOGISTICS' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Quản lý Vận đơn</h2>
                            <p className="text-sm text-gray-500">Xử lý đóng gói và in phiếu giao hàng hàng loạt.</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleBulkPrint}
                                disabled={selectedOrders.length === 0}
                                className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${selectedOrders.length > 0 ? 'bg-[#131921] text-white hover:bg-black shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                            >
                                <Printer size={16}/> In phiếu ({selectedOrders.length})
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                <input placeholder="Tìm mã đơn, tên khách hàng..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#febd69]"/>
                            </div>
                            <select className="p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
                                <option>Tất cả trạng thái</option>
                                <option>Chờ xác nhận</option>
                                <option>Chờ lấy hàng</option>
                                <option>Đang giao</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 text-xs text-gray-500 font-bold uppercase">
                                    <tr>
                                        <th className="p-4 w-10 text-center"><Square size={16}/></th>
                                        <th className="p-4">Sản phẩm</th>
                                        <th className="p-4">Tổng tiền</th>
                                        <th className="p-4">Trạng thái</th>
                                        <th className="p-4">Vận chuyển</th>
                                        <th className="p-4 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {stats.allOrders.map(order => {
                                        const isSelected = selectedOrders.includes(order.id);
                                        return (
                                            <tr key={order.id} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                                                <td className="p-4 text-center cursor-pointer" onClick={() => toggleOrderSelection(order.id)}>
                                                    {isSelected ? <CheckSquare size={18} className="text-[#febd69]"/> : <Square size={18} className="text-gray-300"/>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={order.image} className="w-10 h-10 rounded bg-gray-100 object-cover"/>
                                                        <div>
                                                            <p className="font-bold text-gray-900 line-clamp-1 w-48">{order.title}</p>
                                                            <p className="text-xs text-gray-500">ID: {order.id.slice(-8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-bold">${order.price}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        order.status === OrderStatus.PENDING_SHIPMENT ? 'bg-yellow-100 text-yellow-700' :
                                                        order.status === OrderStatus.SHIPPED ? 'bg-blue-100 text-blue-700' : 
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                        {order.status === OrderStatus.PENDING_SHIPMENT ? 'Chờ gửi' : order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-xs">
                                                    <p className="font-bold">AmazeExpress</p>
                                                    <p className="text-gray-500">Standard</p>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button className="text-blue-600 font-bold text-xs hover:underline">Chi tiết</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {stats.allOrders.length === 0 && (
                                <div className="p-10 text-center text-gray-400">Không có đơn hàng nào.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- WAREHOUSE TAB --- */}
            {activeTab === 'WAREHOUSE' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Kho hàng Thông minh (AI)</h2>
                            <p className="text-sm text-gray-500">Quản lý tồn kho và dự báo nhu cầu nhập hàng.</p>
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 flex items-center gap-2">
                            <RefreshCw size={16}/> Đồng bộ kho
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Inventory List */}
                        <div className="lg:col-span-2 space-y-4">
                            {stats.inventory.map(item => {
                                const stock = item.stock || 0;
                                const isLowStock = stock < 5;
                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                                        <img src={item.image} className="w-16 h-16 rounded-lg bg-gray-100 object-cover"/>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{item.title}</h4>
                                            <p className="text-xs text-gray-500">SKU: {item.id}</p>
                                            
                                            {/* Stock Bar */}
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`} 
                                                        style={{width: `${Math.min(stock, 100)}%`}}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-bold ${isLowStock ? 'text-red-600' : 'text-gray-600'}`}>
                                                    {stock} tồn
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            {isLowStock && (
                                                <div className="mb-2 flex items-center justify-end gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                                    <AlertTriangle size={10}/> Sắp hết hàng
                                                </div>
                                            )}
                                            <button className="text-xs bg-[#131921] text-white px-3 py-1.5 rounded font-bold hover:bg-black">
                                                Nhập hàng
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {stats.inventory.length === 0 && (
                                <div className="p-10 text-center bg-white rounded-xl border border-dashed text-gray-400">
                                    Kho hàng trống. Hãy đăng bán sản phẩm.
                                </div>
                            )}
                        </div>

                        {/* AI Prediction Widget */}
                        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-xl">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Box className="text-[#febd69]"/> Gemini Inventory Insight
                            </h3>
                            <div className="space-y-4 text-sm text-indigo-100">
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                    <p className="font-bold text-white mb-1">Dự báo tiêu thụ</p>
                                    <p>Sản phẩm "iPhone 15 Pro" đang có xu hướng tăng 20% traffic. Dự kiến hết hàng trong 3 ngày tới.</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                    <p className="font-bold text-white mb-1">Cảnh báo tồn kho</p>
                                    <p>Có 2 mã hàng tồn kho trên 90 ngày. Cân nhắc chạy Flash Sale giảm giá để giải phóng kho.</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-[#febd69] text-black font-bold py-3 rounded-xl hover:bg-[#f3a847] transition-all">
                                Tạo kế hoạch nhập hàng tự động
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
