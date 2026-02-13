
import React, { useState, useRef } from 'react';
import { X, MapPin, Phone, User, CreditCard, Truck, CheckCircle2, ArrowRight, Printer, Package, Download } from 'lucide-react';
import { ShippingInfo, CartItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onSubmitOrder: (info: ShippingInfo) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, totalAmount, onSubmitOrder }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ShippingInfo>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Hồ Chí Minh',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  // Success & Print States
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  const labelRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintLabel = () => {
      setIsPrinting(true);
      
      const printContent = document.getElementById('shipping-label-area');
      if (printContent) {
          const win = window.open('', '', 'height=800,width=600');
          if (win) {
              win.document.write(`
                  <html>
                      <head>
                          <title>Phiếu Gửi Hàng - ${orderId}</title>
                          <style>
                              body { font-family: 'Arial', sans-serif; padding: 20px; }
                              .label-container { border: 2px solid #000; padding: 20px; max-width: 500px; margin: 0 auto; }
                              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                              .logo { font-weight: 900; font-size: 24px; font-style: italic; }
                              .barcode { text-align: center; margin: 20px 0; }
                              .barcode-img { height: 60px; width: 80%; background: repeating-linear-gradient(90deg, #000 0, #000 2px, #fff 2px, #fff 4px); display: inline-block; }
                              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                              .section { border: 1px solid #ccc; padding: 10px; }
                              .label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #555; }
                              .value { font-size: 14px; font-weight: bold; margin-top: 4px; }
                              .items { margin-top: 20px; border-top: 1px dashed #000; pt-2; }
                              .item-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
                              .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
                          </style>
                      </head>
                      <body>
                          ${printContent.innerHTML}
                          <script>
                              window.onload = function() { window.print(); window.close(); }
                          </script>
                      </body>
                  </html>
              `);
              win.document.close();
          }
      }
      setIsPrinting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng");
        return;
    }
    
    // 1. Generate Order ID
    const newOrderId = `AMZ-${Date.now().toString().slice(-8)}-VN`;
    setOrderId(newOrderId);

    // 2. Submit Order to App State
    onSubmitOrder(formData);

    // 3. Switch to Success View
    setIsSuccess(true);

    // 4. Auto Trigger Print after a short delay (for UX)
    setTimeout(() => {
        handlePrintLabel();
    }, 800);
  };

  // --- Render Success View ---
  if (isSuccess) {
      return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in">
                
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-2">Đặt hàng thành công!</h2>
                <p className="text-gray-500 text-sm mb-6">Mã đơn hàng: <span className="font-mono font-bold text-[#131921]">{orderId}</span></p>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-full mb-6 text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <Printer size={20} className="text-blue-600"/>
                        <p className="font-bold text-sm text-gray-800">Đang in phiếu gửi hàng...</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-8">Vui lòng dán phiếu này lên kiện hàng nếu bạn cần trả lại hoặc lưu làm bằng chứng.</p>
                </div>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Đóng
                    </button>
                    <button 
                        onClick={handlePrintLabel}
                        className="flex-1 py-3 bg-[#131921] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        <Printer size={18}/> In lại
                    </button>
                </div>

                {/* HIDDEN SHIPPING LABEL TEMPLATE (FOR PRINTING) */}
                <div id="shipping-label-area" className="hidden">
                    <div className="label-container">
                        <div className="header">
                            <div className="logo">AMAZE<span style={{color: '#febd69'}}>BID</span></div>
                            <div className="label">EXPRESS DELIVERY</div>
                        </div>
                        
                        <div className="barcode">
                            <div className="barcode-img"></div>
                            <div style={{letterSpacing: '4px', fontWeight: 'bold', marginTop: '5px'}}>{orderId}</div>
                        </div>

                        <div className="grid">
                            <div className="section">
                                <div className="label">FROM (NGƯỜI GỬI)</div>
                                <div className="value">AMAZEBID WAREHOUSE</div>
                                <div style={{fontSize: '12px', marginTop: '2px'}}>Quan 1, TP. Ho Chi Minh</div>
                                <div style={{fontSize: '12px'}}>Hotline: 1900 1234</div>
                            </div>
                            <div className="section">
                                <div className="label">TO (NGƯỜI NHẬN)</div>
                                <div className="value" style={{fontSize: '16px'}}>{formData.fullName.toUpperCase()}</div>
                                <div style={{fontSize: '12px', marginTop: '2px'}}>{formData.phone}</div>
                                <div style={{fontSize: '12px'}}>{formData.address}, {formData.city}</div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="label">ORDER DETAILS</div>
                            <div style={{marginTop: '10px'}}>
                                {cartItems.map((item, i) => (
                                    <div key={i} className="item-row">
                                        <span>{item.quantity}x {item.title}</span>
                                        <span style={{fontWeight: 'bold'}}>${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '5px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                <span>TOTAL (COD)</span>
                                <span>${totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="footer">
                            Powered by AmazeBid Logistics - Thank you for shopping!
                        </div>
                    </div>
                </div>

            </div>
        </div>
      );
  }

  // --- Normal Checkout Form ---
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] p-5 text-white flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Truck className="text-[#febd69]"/> Xác nhận & Giao hàng
            </h2>
            <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50 flex flex-col md:flex-row gap-6">
            
            {/* Left: Form */}
            <div className="flex-1 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-red-500"/> Địa chỉ nhận hàng
                    </h3>
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Người nhận</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input 
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none"
                                    placeholder="Họ và tên"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input 
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none"
                                    placeholder="Số điện thoại liên hệ"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ chi tiết</label>
                            <textarea 
                                required
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none resize-none"
                                rows={2}
                                placeholder="Số nhà, tên đường, phường/xã..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thành phố / Tỉnh</label>
                            <select 
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none bg-white"
                            >
                                <option>Hồ Chí Minh</option>
                                <option>Hà Nội</option>
                                <option>Đà Nẵng</option>
                                <option>Cần Thơ</option>
                                <option>Khác</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú (Tùy chọn)</label>
                            <input 
                                value={formData.note}
                                onChange={e => setFormData({...formData, note: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none"
                                placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
                            />
                        </div>
                    </form>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-500"/> Phương thức thanh toán
                    </h3>
                    <div className="space-y-2">
                        <div 
                            onClick={() => setPaymentMethod('COD')}
                            className={`p-3 rounded-lg border-2 cursor-pointer flex items-center justify-between ${paymentMethod === 'COD' ? 'border-[#febd69] bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <span className="text-sm font-bold">Thanh toán khi nhận hàng (COD)</span>
                            {paymentMethod === 'COD' && <CheckCircle2 size={18} className="text-[#febd69]"/>}
                        </div>
                        <div 
                            onClick={() => setPaymentMethod('BANK')}
                            className={`p-3 rounded-lg border-2 cursor-pointer flex items-center justify-between ${paymentMethod === 'BANK' ? 'border-[#febd69] bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <span className="text-sm font-bold">Chuyển khoản Ngân hàng</span>
                            {paymentMethod === 'BANK' && <CheckCircle2 size={18} className="text-[#febd69]"/>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Summary */}
            <div className="w-full md:w-80 space-y-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Đơn hàng của bạn</h3>
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex gap-3">
                                <img src={item.image} className="w-12 h-12 rounded bg-gray-100 object-cover"/>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500">SL: {item.quantity} x ${item.price}</p>
                                </div>
                                <span className="text-xs font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Tạm tính</span>
                            <span>${totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Phí vận chuyển</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-[#b12704] pt-2">
                            <span>Tổng cộng</span>
                            <span>${totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Action */}
        <div className="p-5 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
            <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                Quay lại
            </button>
            <button 
                form="checkout-form"
                type="submit"
                className="px-8 py-3 bg-[#131921] text-white font-bold rounded-xl hover:bg-black shadow-lg flex items-center gap-2 transition-all"
            >
                Đặt hàng ngay <ArrowRight size={18}/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
