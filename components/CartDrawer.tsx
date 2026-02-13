
import React, { useState, useMemo } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, Ticket } from 'lucide-react';
import { CartItem, ShippingInfo } from '../types';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from './CheckoutModal'; // Import CheckoutModal

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (shippingInfo: ShippingInfo) => void; // Updated signature
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout 
}) => {
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const tax = subtotal * 0.08; // 8% Tax
  const shipping = subtotal > 100 ? 0 : 15; // Free ship over $100
  const total = Math.max(0, subtotal + tax + shipping - discount);

  const handleApplyPromo = () => {
      if (promoCode.toUpperCase() === 'AMAZE20') {
          setDiscount(subtotal * 0.2);
          alert("Áp dụng mã giảm giá 20% thành công!");
      } else if (promoCode.toUpperCase() === 'FREESHIP') {
          setDiscount(shipping); // Cover shipping
          alert("Áp dụng mã Freeship thành công!");
      } else {
          alert("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
          setDiscount(0);
      }
  };

  const handleStartCheckout = () => {
      setIsCheckoutModalOpen(true);
  };

  const handleFinalCheckout = (info: ShippingInfo) => {
      onCheckout(info);
      setIsCheckoutModalOpen(false);
      onClose(); // Close cart drawer
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400] animate-in fade-in" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[401] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#131921] text-white">
            <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#febd69]"/>
                <h2 className="font-bold text-lg">Giỏ hàng ({cartItems.length})</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-gray-50">
            {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingBag size={64} className="mb-4 opacity-20"/>
                    <p className="font-medium">Giỏ hàng của bạn đang trống</p>
                    <button onClick={onClose} className="mt-4 text-[#febd69] font-bold hover:underline">
                        Tiếp tục mua sắm
                    </button>
                </div>
            ) : (
                cartItems.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-200 flex gap-3 shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-[#b12704]">${item.price.toLocaleString()}</span>
                                <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2">
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                        disabled={item.quantity <= 1}
                                        className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button 
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                        className="p-1 hover:bg-white rounded shadow-sm"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-gray-300 hover:text-red-500 self-start p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))
            )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Mã giảm giá (VD: AMAZE20)"
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#febd69] outline-none uppercase"
                        />
                    </div>
                    <button 
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black"
                    >
                        Áp dụng
                    </button>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span className="font-medium">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Thuế (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{shipping === 0 ? <span className="text-green-600 font-bold">Miễn phí</span> : `$${shipping}`}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 font-bold">
                            <span>Giảm giá</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-black text-[#131921] pt-4 border-t border-gray-100">
                        <span>Tổng cộng</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    onClick={handleStartCheckout}
                    className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                    <CreditCard size={20} /> Thanh toán ngay (${total.toLocaleString()})
                </button>
            </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        totalAmount={total}
        onSubmitOrder={handleFinalCheckout}
      />
    </>
  );
};

export default CartDrawer;
