
import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Search, Sparkles, AlertCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import { analyzeProductImage } from '../services/geminiService';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (p: Product) => void;
  onPlaceBid: (p: Product) => void;
}

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose, products, onAddToCart, onPlaceBid }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<{ query: string, category: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        performVisualSearch(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const performVisualSearch = async (base64Img: string) => {
    setIsAnalyzing(true);
    setResults([]);
    setSearchQuery(null);

    // 1. Call Gemini to identify product
    const analysis = await analyzeProductImage(base64Img);
    
    if (analysis) {
        setSearchQuery(analysis);
        
        // 2. Filter products based on AI analysis
        // Note: In a real app, this would query a vector database
        const matches = products.filter(p => 
            p.category === analysis.category || 
            p.title.toLowerCase().includes(analysis.query.toLowerCase()) ||
            p.description.toLowerCase().includes(analysis.query.toLowerCase())
        );
        
        // Fallback: If no matches, show items from same category
        if (matches.length === 0) {
             const categoryMatches = products.filter(p => p.category === analysis.category);
             setResults(categoryMatches.slice(0, 4));
        } else {
             setResults(matches);
        }
    }
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
      setImage(null);
      setResults([]);
      setSearchQuery(null);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 border-2 border-[#febd69]">
        
        {/* Left: Input Area */}
        <div className="w-full md:w-1/3 bg-[#131921] p-6 text-white flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
            
            <div className="mt-8 mb-6 text-center">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-[#febd69] to-orange-600 mb-4 shadow-lg shadow-orange-500/30">
                    <Camera size={32} className="text-black" />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight">Amaze<span className="text-[#febd69]">Lens</span></h2>
                <p className="text-sm text-gray-400 mt-2 font-medium">Tìm kiếm sản phẩm bằng AI Vision</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                {!image ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#febd69] hover:bg-white/5 transition-all group"
                    >
                        <Upload size={32} className="text-gray-500 group-hover:text-[#febd69] mb-4 transition-colors" />
                        <p className="text-sm font-bold text-gray-400">Tải ảnh lên hoặc Chụp ảnh</p>
                        <p className="text-xs text-gray-600 mt-2">Hỗ trợ JPG, PNG</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                ) : (
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-[#febd69] shadow-lg group">
                        <img src={image} className="w-full h-full object-cover" />
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <Sparkles className="text-[#febd69] animate-spin mb-2" size={32} />
                                <p className="text-xs font-bold animate-pulse">Gemini đang phân tích...</p>
                            </div>
                        )}
                        <button 
                            onClick={handleReset}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-black transition-colors"
                        >
                            Chụp lại
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-6 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Powered by Gemini 2.5 Vision</p>
            </div>
        </div>

        {/* Right: Results Area */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto custom-scrollbar">
            {!image ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                    <Search size={64} className="mb-4" />
                    <p className="font-bold text-lg">Kết quả tìm kiếm sẽ hiện ở đây</p>
                </div>
            ) : (
                <div>
                    {isAnalyzing ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="grid grid-cols-2 gap-4">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right">
                            {searchQuery && (
                                <div className="mb-6 flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                    <Sparkles size={16} className="text-[#febd69]" />
                                    <span className="text-sm text-gray-600">AI nhận diện: </span>
                                    <span className="font-bold text-[#131921] px-2 py-0.5 bg-gray-100 rounded">{searchQuery.query}</span>
                                    <span className="text-xs text-gray-400">({searchQuery.category})</span>
                                </div>
                            )}

                            {results.length > 0 ? (
                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        Sản phẩm tương tự <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{results.length}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {results.map(product => (
                                            <ProductCard 
                                                key={product.id} 
                                                product={product} 
                                                onAddToCart={onAddToCart} 
                                                onPlaceBid={onPlaceBid} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-orange-50 p-4 rounded-full w-fit mx-auto mb-4">
                                        <AlertCircle size={32} className="text-orange-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Không tìm thấy sản phẩm chính xác</h3>
                                    <p className="text-sm text-gray-500 mt-2">Hãy thử chụp lại ảnh rõ hơn hoặc tìm kiếm bằng từ khóa.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VisualSearchModal;
