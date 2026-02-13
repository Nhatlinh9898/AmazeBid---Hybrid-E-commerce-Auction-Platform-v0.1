
import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle2, AlertCircle, Sparkles, Sword } from 'lucide-react';
import { Product } from '../types';
import { compareProducts, ComparisonResult } from '../services/geminiService';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (p: Product) => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, products, onAddToCart }) => {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && products.length === 2) {
        setIsLoading(true);
        setResult(null);
        compareProducts(products[0], products[1]).then(res => {
            setResult(res);
            setIsLoading(false);
        });
    }
  }, [isOpen, products]);

  if (!isOpen || products.length < 2) return null;

  const [p1, p2] = products;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] p-4 flex justify-between items-center text-white shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
                <Sword className="text-[#febd69]" /> Đấu Trường Sản Phẩm
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
            {/* Products Header Side-by-Side */}
            <div className="grid grid-cols-2 gap-8 mb-8 relative">
                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black text-xl w-12 h-12 rounded-full flex items-center justify-center border-4 border-gray-50 z-10 shadow-xl">
                    VS
                </div>

                {[p1, p2].map((p, idx) => (
                    <div key={p.id} className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
                        result?.winnerId === p.id ? 'bg-yellow-50 border-[#febd69] shadow-lg scale-105 z-0' : 'bg-white border-transparent opacity-80'
                    }`}>
                        {result?.winnerId === p.id && (
                            <div className="bg-[#febd69] text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1 animate-bounce">
                                <Trophy size={12}/> Winner
                            </div>
                        )}
                        <img src={p.image} className="w-32 h-32 object-contain mb-4 mix-blend-multiply" />
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 h-14">{p.title}</h3>
                        <p className="text-2xl font-black text-[#b12704] mb-4">${p.price.toLocaleString()}</p>
                        <button 
                            onClick={() => onAddToCart(p)}
                            className="bg-[#131921] text-white px-6 py-2 rounded-lg font-bold hover:bg-black w-full"
                        >
                            Chọn Mua
                        </button>
                    </div>
                ))}
            </div>

            {/* AI Analysis */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Sparkles className="mx-auto mb-4 text-[#febd69] animate-spin" size={40} />
                    <h3 className="text-xl font-bold text-gray-800">Gemini đang phân tích thông số...</h3>
                    <p className="text-gray-500">Đang so sánh cấu hình, giá bán và đánh giá.</p>
                </div>
            ) : result ? (
                <div className="animate-in slide-in-from-bottom-4">
                    {/* The Verdict */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                        <h3 className="font-black text-gray-900 mb-2 flex items-center gap-2 text-lg">
                            <Sparkles className="text-[#febd69]"/> Lời khuyên từ chuyên gia AI
                        </h3>
                        <p className="text-gray-700 leading-relaxed font-medium">"{result.advice}"</p>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 font-bold text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="p-4 text-left w-1/3">Tiêu chí</th>
                                    <th className="p-4 text-center w-1/3">{p1.title.slice(0, 15)}...</th>
                                    <th className="p-4 text-center w-1/3">{p2.title.slice(0, 15)}...</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {result.differences.map((diff, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-gray-700">{diff.feature}</td>
                                        <td className={`p-4 text-center ${diff.advantage === 'item1' ? 'text-green-600 font-bold bg-green-50/30' : 'text-gray-600'}`}>
                                            {diff.item1Value}
                                            {diff.advantage === 'item1' && <CheckCircle2 size={14} className="inline ml-1"/>}
                                        </td>
                                        <td className={`p-4 text-center ${diff.advantage === 'item2' ? 'text-green-600 font-bold bg-green-50/30' : 'text-gray-600'}`}>
                                            {diff.item2Value}
                                            {diff.advantage === 'item2' && <CheckCircle2 size={14} className="inline ml-1"/>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
