
import React from 'react';
import { X, ArrowRightLeft, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface CompareBarProps {
  products: Product[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ products, onRemove, onClear, onCompare }) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center pb-4 px-4 animate-in slide-in-from-bottom-4">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-3 flex items-center gap-4 max-w-2xl w-full">
        <div className="flex items-center gap-2 px-2 border-r border-gray-200 pr-4">
            <div className="bg-[#131921] p-2 rounded-lg text-white">
                <ArrowRightLeft size={20} />
            </div>
            <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-500 uppercase">So sánh</p>
                <p className="font-bold text-gray-900">{products.length} / 2 Sản phẩm</p>
            </div>
        </div>

        <div className="flex-1 flex gap-2 overflow-x-auto">
            {products.map(p => (
                <div key={p.id} className="relative group w-12 h-12 shrink-0">
                    <img src={p.image} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button 
                        onClick={() => onRemove(p.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
            {products.length < 2 && (
                <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center leading-none">
                    Thêm SP
                </div>
            )}
        </div>

        <div className="flex gap-2 pl-4 border-l border-gray-200">
            <button 
                onClick={onClear}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Xóa tất cả"
            >
                <Trash2 size={20} />
            </button>
            <button 
                onClick={onCompare}
                disabled={products.length < 2}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    products.length >= 2 
                    ? 'bg-[#febd69] text-black hover:bg-[#f3a847] shadow-md' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                So sánh ngay
            </button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
