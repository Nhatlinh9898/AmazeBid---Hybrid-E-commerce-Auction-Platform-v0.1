
import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User as UserIcon, MapPin, Gavel, LayoutGrid, PlusCircle, Package, Video, Sparkles, Zap, BarChart3, Shield, Bot, BrainCircuit, Newspaper, Home, Crown, Camera, Mic, MicOff, Heart, Bell, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { AppNotification } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number; 
  onSearch: (term: string) => void;
  openCart: () => void;
  openWishlist: () => void; 
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
  onOpenVisualSearch: () => void;
  onOpenAgencyHub: () => void; // New prop
  
  currentView: 'MARKET' | 'SOCIAL';
  onChangeView: (view: 'MARKET' | 'SOCIAL') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, wishlistCount, onSearch, openCart, openWishlist, openSellModal, openOrders, 
  onOpenLiveStudio, onViewLiveStreams, onOpenAuth, onOpenProfile, onOpenCustomerService, 
  onOpenContentStudio, onOpenSuperDeals, onOpenSellerDashboard, onOpenAdminDashboard, 
  onOpenAvatarStudio, onOpenKOLStudio, onOpenRewards, onOpenVisualSearch, onOpenAgencyHub,
  currentView, onChangeView
}) => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
      { id: 'n1', type: 'ORDER', title: 'Đơn hàng đang giao', message: 'Shipper đang trên đường giao iPhone 15 Pro Max đến bạn.', time: '5 phút trước', read: false },
      { id: 'n2', type: 'BID', title: 'Đã bị trả giá cao hơn!', message: 'Có người vừa trả $5,100 cho Rolex Datejust. Hãy trả giá lại ngay!', time: '1 giờ trước', read: false },
      { id: 'n3', type: 'PROMO', title: 'Flash Sale sắp bắt đầu', message: 'Săn deal giảm 50% lúc 12:00 hôm nay.', time: '2 giờ trước', read: true }
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Voice Search Logic
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.");
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (isListening) {
        recognition.stop();
        setIsListening(false);
        return;
    }

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        onSearch(transcript);
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };
  };

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
        <div className={`flex-1 flex h-9 md:h-10 items-stretch bg-white rounded text-black overflow-hidden transition-all ${isListening ? 'ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'focus-within:ring-2 focus-within:ring-[#febd69]'}`}>
          <button 
            onClick={handleVoiceSearch}
            className={`px-3 border-r border-gray-200 transition-colors flex items-center justify-center ${isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Tìm kiếm bằng giọng nói"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          <input 
            type="text" 
            value={voiceText} // Bind voice text
            placeholder={isListening ? "Đang nghe bạn nói..." : (currentView === 'MARKET' ? "Tìm kiếm sản phẩm..." : "Tìm kiếm KOL, bài viết...")}
            className="flex-1 px-3 text-sm outline-none border-none"
            onChange={(e) => {
                setVoiceText(e.target.value);
                onSearch(e.target.value);
            }}
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

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
              <div onClick={() => setShowNotifications(!showNotifications)} className="p-1 cursor-pointer hover:text-[#febd69] relative">
                  {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full animate-pulse">{unreadCount}</span>}
                  <Bell size={22} />
              </div>
              {showNotifications && (
                  <NotificationDropdown 
                    notifications={notifications} 
                    onMarkRead={handleMarkRead}
                    onClearAll={handleClearAll}
                  />
              )}
          </div>

          <div onClick={user ? onOpenProfile : onOpenAuth} className="p-1 cursor-pointer hover:text-[#febd69]">
            <UserIcon size={22} />
          </div>

          {/* Wishlist */}
          <div onClick={openWishlist} className="hidden sm:flex items-center p-1 cursor-pointer hover:text-[#febd69] relative">
             {wishlistCount > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1 rounded-full">{wishlistCount}</span>
             )}
             <Heart size={22} />
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
        <span onClick={onOpenAgencyHub} className="text-purple-400 font-bold flex items-center gap-1 cursor-pointer hover:text-purple-300">
            <Briefcase size={14}/> Agency Network
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
        <span onClick={user ? openOrders : onOpenAuth} className="text-blue-300 cursor-pointer hover:text-blue-100 flex items-center gap-1">
            <Package size={14}/> Đơn hàng
        </span>
        <span onClick={user ? onOpenSellerDashboard : onOpenAuth} className="text-green-300 cursor-pointer hover:text-green-100 flex items-center gap-1">
            <BarChart3 size={14}/> Seller Hub
        </span>
        <span onClick={user && user.role === 'ADMIN' ? onOpenAdminDashboard : onOpenAuth} className="text-red-300 cursor-pointer hover:text-red-100 flex items-center gap-1">
            <Shield size={14} /> Admin
        </span>
        <span onClick={user ? onOpenCustomerService : onOpenAuth} className="text-cyan-300 cursor-pointer hover:text-cyan-100 flex items-center gap-1">
            <Bot size={14} /> Hỗ trợ
        </span>
        <span onClick={user ? onOpenContentStudio : onOpenAuth} className="text-pink-300 cursor-pointer hover:text-pink-100 flex items-center gap-1">
            <BrainCircuit size={14} /> Content Studio
        </span>
        <span onClick={user ? onOpenAvatarStudio : onOpenAuth} className="text-indigo-300 cursor-pointer hover:text-indigo-100 flex items-center gap-1">
            <Camera size={14} /> Avatar Studio
        </span>
      </div>
    </header>
  );
};

export default Navbar;
