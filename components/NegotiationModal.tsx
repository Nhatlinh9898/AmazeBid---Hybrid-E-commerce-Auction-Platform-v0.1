
import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, DollarSign, Send, User, Bot, CheckCircle2, Frown, Sparkles, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { negotiateWithAI, NegotiationResult } from '../services/geminiService';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSuccess: (product: Product, finalPrice: number) => void;
}

interface ChatMessage {
  role: 'user' | 'seller';
  text: string;
}

const NegotiationModal: React.FC<NegotiationModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [userNote, setUserNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dealStatus, setDealStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [finalDealPrice, setFinalDealPrice] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setMessages([{ role: 'seller', text: `Chào bạn! Tôi là trợ lý AI của shop. Sản phẩm "${product.title}" đang có giá tốt là $${product.price}. Bạn muốn thương lượng mức giá nào?` }]);
        setDealStatus('PENDING');
        setOfferPrice('');
        setUserNote('');
        setFinalDealPrice(null);
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNegotiate = async () => {
      const price = parseFloat(offerPrice);
      if (!price || price <= 0) return;
      if (isProcessing) return;

      setIsProcessing(true);
      
      // Add user message
      const newMessages = [...messages, { role: 'user' as const, text: `Tôi trả giá $${price}. ${userNote}` }];
      setMessages(newMessages);

      // Call AI
      const result = await negotiateWithAI(product, price, userNote, newMessages);

      if (result) {
          setMessages(prev => [...prev, { role: 'seller', text: result.sellerResponse }]);
          
          if (result.status === 'ACCEPTED') {
              setDealStatus('SUCCESS');
              setFinalDealPrice(result.finalPrice || price);
          } else if (result.status === 'COUNTER_OFFER') {
              // Update offer input to suggest the counter price
              if (result.finalPrice) setOfferPrice(result.finalPrice.toString());
          }
      } else {
          setMessages(prev => [...prev, { role: 'seller', text: 'Xin lỗi, tôi đang bận chút. Bạn thử lại sau nhé.' }]);
      }

      setIsProcessing(false);
      setUserNote(''); // Clear note but keep price for adjustment
  };

  const handleAcceptDeal = () => {
      if (finalDealPrice) {
          onSuccess(product, finalDealPrice);
          onClose();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                <div className="bg-[#febd69] p-1.5 rounded-full text-black">
                    <DollarSign size={20} />
                </div>
                <div>
                    <h2 className="font-bold">Thương lượng giá</h2>
                    <p className="text-xs text-gray-400">AmazeHaggle AI Agent</p>
                </div>
            </div>
            <button onClick={onClose} className="hover:bg-gray-700 p-2 rounded-full"><X size={20}/></button>
        </div>

        {/* Product Summary */}
        <div className="bg-gray-50 p-3 border-b border-gray-200 flex gap-3 items-center shrink-0">
            <img src={product.image} className="w-12 h-12 rounded border border-gray-300 object-cover" />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{product.title}</p>
                <p className="text-xs text-gray-500">Giá niêm yết: <span className="line-through">${product.price}</span></p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar" ref={scrollRef}>
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-[#131921] text-[#febd69]'}`}>
                            {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            {isProcessing && (
                <div className="flex justify-start">
                     <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"/>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"/>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"/>
                     </div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
            {dealStatus === 'SUCCESS' ? (
                <div className="text-center animate-in slide-in-from-bottom">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl text-green-700 mb-1">Chốt đơn thành công!</h3>
                    <p className="text-gray-600 text-sm mb-4">Bạn đã mua được với giá <span className="font-bold text-[#b12704]">${finalDealPrice}</span></p>
                    <button 
                        onClick={handleAcceptDeal}
                        className="w-full bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={18}/> Thêm vào giỏ hàng ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Mức giá bạn muốn ($)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 font-bold text-lg focus:border-[#febd69] outline-none"
                            placeholder="Nhập giá..."
                            value={offerPrice}
                            onChange={e => setOfferPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Lời nhắn (Tăng tỷ lệ thành công)</label>
                        <input 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-[#febd69] outline-none"
                            placeholder="VD: Em là sinh viên, giảm chút đi shop..."
                            value={userNote}
                            onChange={e => setUserNote(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleNegotiate()}
                        />
                    </div>
                    <button 
                        onClick={handleNegotiate}
                        disabled={isProcessing || !offerPrice}
                        className="w-full bg-[#131921] hover:bg-black text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles size={16} className="text-[#febd69]"/> Gửi đề nghị
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
