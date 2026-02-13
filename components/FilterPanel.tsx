
import React from 'react';
import { SlidersHorizontal, ArrowDownUp, Tag, Star } from 'lucide-react';

interface FilterPanelProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  condition: string;
  onConditionChange: (cond: string) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  minPrice, maxPrice, onPriceChange, 
  sortOption, onSortChange, 
  condition, onConditionChange,
  className 
}) => {
  return (
    <div className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-6 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <SlidersHorizontal size={18} className="text-[#febd69]"/>
        <h3 className="font-bold text-sm uppercase text-gray-700">Bộ lọc tìm kiếm</h3>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
            <ArrowDownUp size={12}/> Sắp xếp theo
        </label>
        <select 
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#febd69] bg-gray-50"
        >
            <option value="POPULAR">Phổ biến nhất</option>
            <option value="PRICE_ASC">Giá: Thấp đến Cao</option>
            <option value="PRICE_DESC">Giá: Cao đến Thấp</option>
            <option value="NEWEST">Mới nhất</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2">Khoảng giá ($)</label>
        <div className="flex items-center gap-2">
            <input 
                type="number" 
                placeholder="Min"
                className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#febd69]"
                value={minPrice || ''}
                onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            />
            <span className="text-gray-400">-</span>
            <input 
                type="number" 
                placeholder="Max"
                className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#febd69]"
                value={maxPrice || ''}
                onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
            <Tag size={12}/> Tình trạng
        </label>
        <div className="flex flex-wrap gap-2">
            {['ALL', 'NEW', 'LIKE_NEW', 'USED'].map(c => (
                <button
                    key={c}
                    onClick={() => onConditionChange(c)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                        condition === c 
                        ? 'bg-[#131921] text-white border-[#131921]' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {c === 'ALL' ? 'Tất cả' : c === 'NEW' ? 'Mới 100%' : c === 'LIKE_NEW' ? 'Like New' : 'Đã dùng'}
                </button>
            ))}
        </div>
      </div>

      {/* Rating Mock */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
            <Star size={12}/> Đánh giá
        </label>
        <div className="space-y-1">
            {[5, 4, 3].map(stars => (
                <div key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <div className="flex text-[#febd69]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < stars ? "currentColor" : "none"} />)}
                    </div>
                    <span className="text-xs">& Trở lên</span>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default FilterPanel;
