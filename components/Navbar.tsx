
import React from 'react';
import { Search, ShoppingCart, User as UserIcon, MapPin, Gavel, LayoutGrid, PlusCircle, Package, Video, Sparkles, Zap, BarChart3, Shield, Bot, BrainCircuit, Newspaper, Home, Crown, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onSearch: (term: string) => void;
  openCart: () => void;
  openSellModal: () => void;
  openOrders: () => void;
  onOpenLiveStudio: () => void;
  onViewLiveStreams: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenCustomerService: () => void;
  onOpenContentStudio: () => void;
  onOpenSuperDeals: () => void;
  onOpenSellerDashboard: () => void;
  onOpenAdminDashboard: () => void;
  onOpenAvatarStudio: () => void;
  onOpenKOLStudio: () => void;
  onOpenRewards: () => void; 
  onOpenVisualSearch: () => void; // New prop
  
  currentView: 'MARKET' | 'SOCIAL';
  onChangeView: (view: 'MARKET' | 'SOCIAL') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, onSearch, openCart, openSellModal, openOrders, 
  onOpenLiveStudio, onViewLiveStreams, onOpenAuth, onOpenProfile, onOpenCustomerService, 
  onOpenContentStudio, onOpenSuperDeals, onOpenSellerDashboard, onOpenAdminDashboard, 
  onOpenAvatarStudio, onOpenKOLStudio, onOpenRewards, onOpenVisualSearch,
  currentView, onChangeView
}) => {
  const { user } = useAuth();

  return (
    <header className="bg-[#131921] text-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="max-w-[1500px] mx-auto flex items-center p-2 gap-2 md:gap-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer p-1 shrink-0" onClick={() => window.location.reload()}>
          <span className="text-xl md:text-2xl font-bold italic flex items-center gap-1">
            <Gavel className="text-[#febd69] w-5 h-5 md:w-6 md:h-6" /> Amaze<span className="text-[#febd69]">Bid</span>
          </span>
        </div>

        {/* View Switcher (Desktop) */}
        <div className="hidden md:flex bg-[#232f3e] rounded-lg p-1 mx-4">
            <button 
                onClick={() => onChangeView('MARKET')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${currentView === 'MARKET' ? 'bg-[#febd69] text-black shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
                <Home size={14} /> Mua sắm
            </button>
            <button 
                onClick={() => onChangeView('SOCIAL')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${currentView === 'SOCIAL' ? 'bg-[#febd69] text-black shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
                <Newspaper size={14} /> AmazeFeed
            </button>
        </div>

        {/* Search Bar - Flexible */}
        <div className="flex-1 flex h-9 md:h-10 items-stretch bg-white rounded text-black overflow-hidden focus-within:ring-2 focus-within:ring-[#febd69]">
          <input 
            type="text" 
            placeholder={currentView === 'MARKET' ? "Tìm kiếm sản phẩm..." : "Tìm kiếm KOL, bài viết..."}
            className="flex-1 px-3 text-sm outline-none border-none"
            onChange={(e) => onSearch(e.target.value)}
          />
          {/* Visual Search Button */}
          <button 
            onClick={onOpenVisualSearch}
            className="px-3 hover:bg-gray-100 text-gray-500 hover:text-black border-l border-gray-200 transition-colors"
            title="Tìm bằng hình ảnh (AmazeLens)"
          >
            <Camera size={20} />
          </button>
          
          <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 md:px-5 flex items-center justify-center transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* User Account & Cart */}
        <div className="flex items-center gap-1 md:gap-3 shrink-0">
          
          {/* Rewards Pill (Only if user logged in) */}
          {user && (
              <div 
                onClick={onOpenRewards}
                className="hidden sm:flex items-center gap-1 bg-[#232f3e] hover:bg-[#374151] px-3 py-1.5 rounded-full cursor-pointer transition-colors border border-gray-700"
              >
                  <Crown size={14} className="text-[#febd69]" fill="currentColor"/>
                  <span className="text-xs font-bold text-[#febd69]">{user.points?.toLocaleString() || 0}</span>
              </div>
          )}

          <div onClick={user ? onOpenProfile : onOpenAuth} className="p-1 cursor-pointer hover:text-[#febd69]">
            <UserIcon size={22} />
          </div>

          {/* Cart */}
          <div onClick={openCart} className="flex items-center p-1 cursor-pointer hover:text-[#febd69] relative">
            <span className="absolute -top-1 -right-1 bg-[#febd69] text-black text-[10px] font-bold px-1 rounded-full">{cartCount}</span>
            <ShoppingCart size={22} />
          </div>
        </div>
      </div>

      {/* Mobile View Switcher (Only visible on mobile) */}
      <div className="md:hidden flex border-t border-gray-700">
         <button 
            onClick={() => onChangeView('MARKET')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${currentView === 'MARKET' ? 'bg-[#febd69] text-black' : 'bg-[#232f3e] text-gray-400'}`}
        >
            <Home size={14} /> Mua sắm
        </button>
        <button 
            onClick={() => onChangeView('SOCIAL')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 ${currentView === 'SOCIAL' ? 'bg-[#febd69] text-black' : 'bg-[#232f3e] text-gray-400'}`}
        >
            <Newspaper size={14} /> AmazeFeed
        </button>
      </div>

      {/* Sub-Nav - Scrollable on Mobile */}
      <div className="bg-[#232f3e] px-2 py-1.5 flex items-center gap-4 text-[13px] font-medium overflow-x-auto no-scrollbar whitespace-nowrap border-t border-gray-700 md:border-t-0">
        <span onClick={onViewLiveStreams} className="text-[#febd69] font-bold flex items-center gap-1 cursor-pointer hover:underline">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Đấu giá trực tiếp
        </span>
        <span onClick={onOpenSuperDeals} className="text-red-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
            <Zap size={14} className="animate-pulse" /> Siêu Ưu Đãi
        </span>
        <span onClick={onOpenRewards} className="text-yellow-400 cursor-pointer hover:text-yellow-200 flex items-center gap-1">
            <Crown size={14} /> AmazeRewards
        </span>
        <span onClick={user ? openSellModal : onOpenAuth} className="flex items-center gap-1 cursor-pointer hover:text-white text-gray-300">
            <PlusCircle size={14} /> Đăng bán
        </span>
        <span onClick={onOpenKOLStudio} className="text-purple-300 cursor-pointer hover:text-purple-100 flex items-center gap-1">
            <Sparkles size={14}/> AmazeKOL AI
        </span>
      </div>
    </header>
  );
};

export default Navbar;
