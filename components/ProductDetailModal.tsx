
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Gavel, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, BrainCircuit, BarChart3, AlertCircle, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { Product, ItemType } from '../types';
import { analyzeProductDeal, ProductAnalysis } from '../services/geminiService';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (p: Product) => void;
  onPlaceBid: (p: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, onAddToCart, onPlaceBid }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_INSIGHTS' | 'REVIEWS'>('OVERVIEW');
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
        setActiveTab('OVERVIEW');
        setAnalysis(null);
    }
  }, [isOpen, product]);

  const handleAnalyze = async () => {
      if (!product) return;
      setIsAnalyzing(true);
      const result = await analyzeProductDeal(product);
      setAnalysis(result);
      setIsAnalyzing(false);
  };

  if (!isOpen || !product) return null;

  const handleAction = () => {
      if (product.type === ItemType.FIXED_PRICE) {
          onAddToCart(product);
      } else {
          onPlaceBid(product);
      }
  };

  const getVerdictColor = (v: string) => {
      switch(v) {
          case 'EXCELLENT_DEAL': return 'text-green-600 bg-green-50 border-green-200';
          case 'GOOD_PRICE': return 'text-blue-600 bg-blue-50 border-blue-200';
          case 'OVERPRICED': return 'text-red-600 bg-red-50 border-red-200';
          default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors">
            <X size={20} />
        </button>

        {/* Left: Images */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col">
            <div className="flex-1 p-8 flex items-center justify-center">
                <img src={product.image} className="max-w-full max-h-[500px] object-contain drop-shadow-xl mix-blend-multiply" />
            </div>
            {/* Thumbnails Mockup */}
            <div className="flex gap-2 p-4 overflow-x-auto justify-center bg-white border-t border-gray-200">
                {[product.image, ...Array(3).fill(product.image)].map((img, i) => (
                    <div key={i} className={`w-16 h-16 border-2 rounded-lg cursor-pointer overflow-hidden ${i === 0 ? 'border-[#febd69]' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                        <img src={img} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto custom-scrollbar">
            
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'OVERVIEW' ? 'border-[#131921] text-[#131921]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Tổng quan
                </button>
                <button 
                    onClick={() => { setActiveTab('AI_INSIGHTS'); if(!analysis) handleAnalyze(); }}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'AI_INSIGHTS' ? 'border-[#febd69] text-black bg-orange-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <BrainCircuit size={16} className={activeTab === 'AI_INSIGHTS' ? "text-[#febd69]" : ""} /> Phân tích AI
                </button>
                <button 
                    onClick={() => setActiveTab('REVIEWS')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all ${activeTab === 'REVIEWS' ? 'border-[#131921] text-[#131921]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Đánh giá
                </button>
            </div>

            <div className="p-6 md:p-8 flex-1">
                {activeTab === 'OVERVIEW' && (
                    <div className="animate-in slide-in-from-right-4 space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{product.title}</h1>
                                <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart size={24} /></button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1 text-[#febd69]">
                                    <Star size={16} fill="currentColor" /> 4.9 (124 reviews)
                                </span>
                                <span>•</span>
                                <span className="text-blue-600 font-medium hover:underline cursor-pointer">
                                    {product.sellerId === 'currentUser' ? 'Shop Của Bạn' : 'Official Store'}
                                </span>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                {product.type === ItemType.AUCTION ? (
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Giá thầu hiện tại</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black text-red-600">${product.currentBid?.toLocaleString()}</span>
                                            <span className="text-sm text-gray-500 font-medium mb-1">({product.bidCount} bids)</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded w-fit">
                                            <Clock size={14} /> Kết thúc: 2h 15m 30s
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black text-[#131921]">${product.price.toLocaleString()}</span>
                                            {product.originalPrice && (
                                                <span className="text-lg text-gray-400 line-through decoration-2">${product.originalPrice.toLocaleString()}</span>
                                            )}
                                        </div>
                                        {product.originalPrice && (
                                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded mt-2 inline-block">
                                                Tiết kiệm {Math.round((1 - product.price/product.originalPrice)*100)}%
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-900">Mô tả sản phẩm</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                            <ul className="grid grid-cols-2 gap-2 mt-4 text-xs text-gray-600">
                                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Chính hãng 100%</li>
                                <li className="flex items-center gap-2"><Truck size={14} className="text-blue-500"/> Free Shipping</li>
                                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#febd69]"/> Bảo hành 12 tháng</li>
                                <li className="flex items-center gap-2"><RotateCcw size={14} className="text-gray-400"/> 7 ngày đổi trả</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'AI_INSIGHTS' && (
                    <div className="animate-in slide-in-from-right-4 h-full">
                        {!analysis ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                {isAnalyzing ? (
                                    <>
                                        <BrainCircuit size={48} className="text-[#febd69] animate-pulse mb-4" />
                                        <h3 className="font-bold text-lg text-gray-800">Gemini đang phân tích dữ liệu...</h3>
                                        <p className="text-sm text-gray-500 mt-2">Đang so sánh giá thị trường và đánh giá chất lượng.</p>
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 size={48} className="text-gray-300 mb-4" />
                                        <h3 className="font-bold text-lg text-gray-800">Phân tích giá trị sản phẩm</h3>
                                        <p className="text-sm text-gray-500 mt-2 mb-6">Sử dụng AI để biết đây có phải là một món hời hay không.</p>
                                        <button 
                                            onClick={handleAnalyze}
                                            className="bg-[#131921] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                                        >
                                            <BrainCircuit size={18} className="text-[#febd69]"/> Bắt đầu phân tích
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center ${getVerdictColor(analysis.verdict)}`}>
                                    <span className="text-xs font-black uppercase tracking-widest mb-1">Kết luận của AI</span>
                                    <h3 className="text-3xl font-black mb-2">{analysis.verdict.replace('_', ' ')}</h3>
                                    <div className="flex items-center gap-1 font-bold">
                                        <span className="text-2xl">{analysis.score}</span>
                                        <span className="text-sm opacity-70">/ 10 Điểm</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} className="text-blue-600"/> Nhận định về giá
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{analysis.priceAnalysis}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-green-200 bg-green-50/50 p-4 rounded-xl">
                                        <h4 className="font-bold text-green-700 text-sm mb-3 flex items-center gap-2">
                                            <CheckCircle2 size={16}/> Ưu điểm
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.pros.map((pro, i) => (
                                                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"/> {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border border-red-200 bg-red-50/50 p-4 rounded-xl">
                                        <h4 className="font-bold text-red-700 text-sm mb-3 flex items-center gap-2">
                                            <AlertCircle size={16}/> Nhược điểm
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.cons.map((con, i) => (
                                                <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0"/> {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center italic">Phân tích được tạo tự động bởi Gemini AI. Chỉ mang tính chất tham khảo.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'REVIEWS' && (
                    <div className="animate-in slide-in-from-right-4 flex flex-col items-center justify-center h-full text-gray-400">
                        <Star size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">Tính năng Đánh giá chi tiết đang cập nhật.</p>
                        <p className="text-xs mt-2">Dữ liệu review sẽ được tổng hợp từ lịch sử mua hàng.</p>
                    </div>
                )}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                    <Share2 size={24} />
                </button>
                <button 
                    onClick={handleAction}
                    className={`flex-1 font-bold text-lg rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                        product.type === ItemType.AUCTION 
                        ? 'bg-[#131921] text-white hover:bg-black' 
                        : 'bg-[#febd69] text-black hover:bg-[#f3a847]'
                    }`}
                >
                    {product.type === ItemType.AUCTION ? (
                        <><Gavel size={20}/> Đặt Giá Thầu</>
                    ) : (
                        <><ShoppingCart size={20}/> Thêm Vào Giỏ</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
