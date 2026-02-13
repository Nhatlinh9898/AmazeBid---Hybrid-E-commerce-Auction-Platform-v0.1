
import React, { useState } from 'react';
import { X, Trophy, Crown, Star, Gift, ChevronRight, Zap, Gem, CheckCircle2, Ticket, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_REWARDS } from '../data';
import { Reward } from '../types';

interface RewardsHubProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardsHub: React.FC<RewardsHubProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'REDEEM' | 'EARN' | 'HISTORY' | 'LUCKY_SPIN'>('REDEEM');
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen || !user) return null;

  const currentPoints = user.points || 0;
  const currentTier = user.tier || 'SILVER';

  // Calculate progress to next tier
  const getNextTierInfo = () => {
    if (currentTier === 'SILVER') return { next: 'GOLD', target: 1000, current: currentPoints };
    if (currentTier === 'GOLD') return { next: 'PLATINUM', target: 5000, current: currentPoints };
    if (currentTier === 'PLATINUM') return { next: 'DIAMOND', target: 20000, current: currentPoints };
    return { next: 'MAX', target: currentPoints, current: currentPoints };
  };

  const tierInfo = getNextTierInfo();
  const progressPercent = Math.min((tierInfo.current / tierInfo.target) * 100, 100);

  const handleRedeem = (reward: Reward) => {
    if (currentPoints < reward.cost) {
        alert("Bạn không đủ điểm để đổi quà này!");
        return;
    }
    
    if (confirm(`Đổi ${reward.cost} điểm lấy "${reward.title}"?`)) {
        updateProfile({ points: currentPoints - reward.cost });
        alert(`Đổi quà thành công! Mã của bạn là: ${reward.code || 'GIFT-' + Date.now()}`);
    }
  };

  const handleSpin = () => {
      if (currentPoints < 50) {
          alert("Bạn cần 50 điểm cho mỗi lượt quay!");
          return;
      }
      setIsSpinning(true);
      // Deduct points
      updateProfile({ points: currentPoints - 50 });

      // Simulate Spin
      setTimeout(() => {
          setIsSpinning(false);
          const prize = Math.random() > 0.5 ? 100 : 10;
          const isJackpot = Math.random() > 0.9;
          const finalPrize = isJackpot ? 1000 : prize;
          
          alert(isJackpot ? `JACKPOT! BẠN NHẬN ĐƯỢC ${finalPrize} ĐIỂM!` : `Chúc mừng! Bạn nhận được ${finalPrize} điểm.`);
          updateProfile({ points: (currentPoints - 50) + finalPrize });
      }, 2000);
  };

  const renderTierBadge = () => {
      const colors = {
          SILVER: 'bg-gray-200 text-gray-700 border-gray-300',
          GOLD: 'bg-yellow-100 text-yellow-700 border-yellow-300',
          PLATINUM: 'bg-blue-50 text-blue-700 border-blue-200',
          DIAMOND: 'bg-purple-100 text-purple-700 border-purple-300'
      };
      return (
          <div className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider flex items-center gap-1 ${colors[currentTier]}`}>
             {currentTier === 'DIAMOND' ? <Gem size={12}/> : <Crown size={12}/>}
             {currentTier} MEMBER
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-[#f8fafc] w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 border border-white/20">
        
        {/* Sidebar / User Card */}
        <div className="w-full md:w-80 bg-gradient-to-br from-[#131921] to-gray-900 text-white p-6 flex flex-col relative overflow-hidden shrink-0">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Crown size={200} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <img src={user.avatar} className="w-16 h-16 rounded-full border-4 border-white/10 shadow-xl" />
                    {renderTierBadge()}
                </div>
                
                <h2 className="text-2xl font-bold mb-1">{user.fullName}</h2>
                <div className="flex items-center gap-2 text-yellow-400 font-mono text-xl font-bold mb-6">
                    <Zap fill="currentColor" size={20}/>
                    <span>{currentPoints.toLocaleString()} Points</span>
                </div>

                {/* Progress Bar */}
                {currentTier !== 'DIAMOND' && (
                    <div className="mb-8">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                            <span>Hiện tại: {tierInfo.current}</span>
                            <span>Lên hạng {tierInfo.next}: {tierInfo.target}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">Tích thêm {tierInfo.target - tierInfo.current} điểm để thăng hạng và nhận ưu đãi đặc quyền.</p>
                    </div>
                )}

                {/* Daily Check-in Mock */}
                <button 
                    onClick={() => {
                        updateProfile({ points: currentPoints + 50 });
                        alert("Điểm danh thành công! +50 Points");
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-3 flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-2 rounded-lg text-white">
                            <CheckCircle2 size={16}/>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-sm">Điểm danh hàng ngày</p>
                            <p className="text-[10px] text-gray-400">Nhận +50 điểm ngay</p>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-500 group-hover:text-white transition-colors" size={16}/>
                </button>
            </div>

            <div className="mt-auto relative z-10 pt-6 border-t border-white/10">
                <p className="text-[10px] text-gray-500 text-center">AmazePoints có giá trị trong 12 tháng.</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
            {/* Header Tabs */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('REDEEM')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'REDEEM' ? 'bg-white shadow text-[#131921]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Đổi quà
                    </button>
                    <button 
                        onClick={() => setActiveTab('LUCKY_SPIN')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'LUCKY_SPIN' ? 'bg-[#febd69] text-black shadow' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Sparkles size={14}/> Vòng quay
                    </button>
                    <button 
                        onClick={() => setActiveTab('EARN')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'EARN' ? 'bg-white shadow text-[#131921]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Nhiệm vụ
                    </button>
                    <button 
                        onClick={() => setActiveTab('HISTORY')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'HISTORY' ? 'bg-white shadow text-[#131921]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Lịch sử
                    </button>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                    <X size={20}/>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                
                {/* REDEEM TAB */}
                {activeTab === 'REDEEM' && (
                    <div className="animate-in slide-in-from-right-4">
                        <div className="mb-6">
                            <h3 className="text-lg font-black text-gray-800 mb-1 flex items-center gap-2">
                                <Gift className="text-red-500"/> Kho quà tặng
                            </h3>
                            <p className="text-sm text-gray-500">Dùng điểm tích lũy để đổi các ưu đãi độc quyền.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MOCK_REWARDS.map(reward => (
                                <div key={reward.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:border-[#febd69] transition-all flex gap-4 group">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 p-2">
                                        <img src={reward.image} className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h4 className="font-bold text-gray-900 line-clamp-1">{reward.title}</h4>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{reward.description}</p>
                                        <div className="mt-auto flex justify-between items-center">
                                            <span className="text-sm font-black text-[#febd69]">{reward.cost} pts</span>
                                            <button 
                                                onClick={() => handleRedeem(reward)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                    currentPoints >= reward.cost 
                                                    ? 'bg-[#131921] text-white hover:bg-black' 
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                Đổi ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* LUCKY SPIN TAB */}
                {activeTab === 'LUCKY_SPIN' && (
                    <div className="animate-in zoom-in h-full flex flex-col items-center justify-center">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-[#131921]">VÒNG QUAY MAY MẮN</h3>
                            <p className="text-gray-500 text-sm">Thử vận may - Nhận ngay Jackpot</p>
                        </div>

                        <div className="relative mb-8">
                            {/* Simple Wheel Representation */}
                            <div className={`w-64 h-64 rounded-full border-8 border-[#febd69] bg-white shadow-2xl relative overflow-hidden transition-transform duration-[2000ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${isSpinning ? 'rotate-[1080deg]' : 'rotate-0'}`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                                        <div className="bg-red-100 flex items-center justify-center p-4"><span className="font-black text-red-600 -rotate-45">10 pts</span></div>
                                        <div className="bg-blue-100 flex items-center justify-center p-4"><span className="font-black text-blue-600 rotate-45">50 pts</span></div>
                                        <div className="bg-yellow-100 flex items-center justify-center p-4"><span className="font-black text-yellow-600 -rotate-[135deg]">100 pts</span></div>
                                        <div className="bg-purple-100 flex items-center justify-center p-4"><span className="font-black text-purple-600 rotate-[135deg]">JACKPOT</span></div>
                                    </div>
                                </div>
                            </div>
                            {/* Pointer */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-red-600 drop-shadow-md">
                                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600"></div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSpin}
                            disabled={isSpinning || currentPoints < 50}
                            className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-12 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                        >
                            {isSpinning ? <RefreshCw className="animate-spin"/> : <Sparkles className="animate-pulse"/>}
                            QUAY NGAY (-50 Pts)
                        </button>
                    </div>
                )}

                {/* EARN TAB */}
                {activeTab === 'EARN' && (
                    <div className="animate-in slide-in-from-right-4 space-y-4">
                         <div className="mb-4">
                            <h3 className="text-lg font-black text-gray-800 mb-1 flex items-center gap-2">
                                <Zap className="text-yellow-500"/> Nhiệm vụ kiếm điểm
                            </h3>
                            <p className="text-sm text-gray-500">Hoàn thành các hoạt động để tích lũy thêm điểm thưởng.</p>
                        </div>

                        {[
                            { title: 'Xem Livestream 5 phút', points: 100, icon: Star, color: 'text-orange-500', done: false },
                            { title: 'Chia sẻ sản phẩm lên Facebook', points: 200, icon: Zap, color: 'text-blue-500', done: true },
                            { title: 'Đánh giá đơn hàng đầu tiên', points: 500, icon: Trophy, color: 'text-yellow-500', done: false },
                            { title: 'Mời bạn bè tham gia', points: 1000, icon: Gift, color: 'text-red-500', done: false },
                        ].map((task, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${task.done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full bg-gray-50 ${task.color}`}>
                                        <task.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${task.done ? 'text-green-800' : 'text-gray-900'}`}>{task.title}</h4>
                                        <p className="text-xs font-bold text-[#febd69]">+{task.points} Points</p>
                                    </div>
                                </div>
                                {task.done ? (
                                    <span className="text-xs font-bold bg-green-200 text-green-800 px-3 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12}/> Đã nhận
                                    </span>
                                ) : (
                                    <button className="text-xs font-bold bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-black">
                                        Thực hiện
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                 {/* HISTORY TAB */}
                 {activeTab === 'HISTORY' && (
                    <div className="animate-in slide-in-from-right-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-black text-gray-800 mb-1">Lịch sử điểm</h3>
                        </div>
                        <div className="space-y-4 relative border-l-2 border-gray-200 ml-4 pl-6">
                            {[
                                { action: 'Daily Check-in', points: 50, type: 'EARN', date: 'Vừa xong' },
                                { action: 'Mua iPhone 15 Pro Max', points: 1050, type: 'EARN', date: '2 giờ trước' },
                                { action: 'Đổi Voucher Freeship', points: -800, type: 'SPEND', date: 'Hôm qua' },
                                { action: 'Đăng ký thành viên', points: 500, type: 'EARN', date: '1 tuần trước' }
                            ].map((h, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${h.type === 'EARN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm">{h.action}</p>
                                            <p className="text-xs text-gray-400">{h.date}</p>
                                        </div>
                                        <span className={`font-black text-sm ${h.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                                            {h.type === 'EARN' ? '+' : ''}{h.points}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsHub;
