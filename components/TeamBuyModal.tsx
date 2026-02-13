
import React, { useState, useEffect } from 'react';
import { X, Users, Clock, Copy, Share2, Sparkles, Check, Zap, Wand2 } from 'lucide-react';
import { Product } from '../types';
import { generateRecruitmentMessage } from '../services/geminiService';

interface TeamBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onConfirmTeam: (product: Product, teamPrice: number) => void;
}

const TeamBuyModal: React.FC<TeamBuyModalProps> = ({ isOpen, onClose, product, onConfirmTeam }) => {
  const teamPrice = Math.floor(product.price * 0.8); // 20% discount
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours
  const [inviteMessage, setInviteMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(false); // Simulate user joining/starting

  useEffect(() => {
    if (isOpen) {
        setIsJoined(true);
        handleGenerateMessage();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const handleGenerateMessage = async (style: 'FUNNY' | 'URGENT' | 'EMOTIONAL' = 'FUNNY') => {
      setIsGenerating(true);
      const msg = await generateRecruitmentMessage(product.title, teamPrice, style);
      setInviteMessage(msg);
      setIsGenerating(false);
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(`${inviteMessage} Link: amazebid.com/team/${product.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-purple-900 to-[#131921] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 text-white border border-purple-500/30">
        
        <button onClick={onClose} className="absolute top-4 right-4 hover:bg-white/10 p-2 rounded-full z-10"><X size={20}/></button>

        {/* Product Header */}
        <div className="p-6 pb-0 flex gap-4 items-center">
            <img src={product.image} className="w-20 h-20 rounded-xl object-cover border-2 border-purple-400 shadow-lg bg-white" />
            <div>
                <div className="bg-purple-600 text-[10px] font-black uppercase px-2 py-0.5 rounded w-fit mb-1 flex items-center gap-1">
                    <Users size={10} /> AmazeTeam
                </div>
                <h3 className="font-bold text-lg leading-tight line-clamp-2">{product.title}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-yellow-400">${teamPrice}</span>
                    <span className="text-sm text-gray-400 line-through">${product.price}</span>
                </div>
            </div>
        </div>

        {/* Status Area */}
        <div className="p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
                    <div className="bg-yellow-400 h-full w-[50%] animate-pulse"></div>
                </div>
                
                <div className="flex justify-center items-center gap-4 mb-4 mt-2">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-400 p-1 relative">
                        <img src={`https://ui-avatars.com/api/?name=You&background=random`} className="w-full h-full rounded-full object-cover" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-2 rounded-full">Host</div>
                    </div>
                    <div className="w-8 h-1 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center bg-black/20 text-gray-400">
                        <Users size={24} />
                    </div>
                </div>

                <h4 className="text-xl font-bold mb-1">Thiếu 1 người nữa!</h4>
                <p className="text-sm text-gray-300 mb-4 flex items-center justify-center gap-2">
                    <Clock size={14} className="text-red-400"/> Kết thúc trong: <span className="font-mono font-bold text-red-400">{formatTime(timeLeft)}</span>
                </p>

                {/* AI Copywriter */}
                <div className="bg-black/30 rounded-xl p-3 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1">
                            <Sparkles size={10} /> AI Gợi ý lời mời
                        </span>
                        <div className="flex gap-1">
                            <button onClick={() => handleGenerateMessage('FUNNY')} className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20">Hài hước</button>
                            <button onClick={() => handleGenerateMessage('URGENT')} className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20">Gấp</button>
                        </div>
                    </div>
                    {isGenerating ? (
                        <div className="h-10 flex items-center gap-2 text-xs text-gray-400">
                            <Wand2 size={14} className="animate-spin" /> Đang viết...
                        </div>
                    ) : (
                        <div className="relative">
                            <p className="text-sm italic text-gray-200 pr-8">"{inviteMessage}"</p>
                            <button onClick={handleCopy} className="absolute right-0 top-0 text-gray-400 hover:text-white">
                                {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16}/>}
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleCopy}
                    className="w-full mt-4 bg-[#febd69] hover:bg-[#f3a847] text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                    <Share2 size={18} /> Mời bạn bè tham gia
                </button>
            </div>
            
            <p className="text-center text-[10px] text-gray-500 mt-4">
                Nếu sau 24h không đủ người, hệ thống sẽ tự động hoàn tiền 100%.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TeamBuyModal;
