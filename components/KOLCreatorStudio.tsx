
import React, { useState } from 'react';
import { X, Wand2, Sparkles, User, Target, Zap, Play, CheckCircle, ChevronRight, Video, ListChecks, Star, Users, BrainCircuit, Rocket } from 'lucide-react';
import { generateUnfulfilledKOL } from '../services/geminiService';
import { KOLProfile } from '../types';
import { KOL_VIDEO_IDEAS } from '../data';

interface KOLCreatorStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

const KOLCreatorStudio: React.FC<KOLCreatorStudioProps> = ({ isOpen, onClose }) => {
  const [industry, setIndustry] = useState<'Fashion' | 'Tech' | 'Home' | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [profile, setProfile] = useState<KOLProfile | null>(null);
  const [showPlan, setShowPlan] = useState(false);

  const handleGenerate = async () => {
    if (!industry) return;
    setIsGenerating(true);
    const result = await generateUnfulfilledKOL(industry);
    if (result) {
        setProfile(result);
    }
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 border border-white/20">
        
        {/* Header */}
        <div className="bg-[#131921] p-6 text-white flex justify-between items-center shrink-0 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-[#febd69] to-orange-400 p-3 rounded-2xl text-black shadow-lg">
                <BrainCircuit size={28} />
            </div>
            <div>
                <h2 className="text-2xl font-black tracking-tight">AmazeKOL <span className="text-[#febd69]">Factory</span></h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hệ thống tạo KOL Unfulfilled bằng AI</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-2 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar: Selection & Profile */}
            <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto custom-scrollbar flex flex-col">
                {!profile ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800 font-medium">
                            <Sparkles size={18} className="mb-2 text-blue-600"/>
                            Chọn ngành hàng để AI đúc kết một nhân vật KOL có cá tính độc bản.
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chọn Ngành</label>
                            {[
                                { id: 'Fashion', label: 'Thời trang', color: 'blue' },
                                { id: 'Tech', label: 'Điện tử', color: 'purple' },
                                { id: 'Home', label: 'Home Decor', color: 'orange' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setIndustry(item.id as any)}
                                    className={`w-full p-4 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between ${
                                        industry === item.id 
                                        ? 'border-[#febd69] bg-white shadow-md text-gray-900' 
                                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                >
                                    {item.label}
                                    {industry === item.id && <CheckCircle size={18} className="text-[#febd69]"/>}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={handleGenerate}
                            disabled={!industry || isGenerating}
                            className="w-full py-4 bg-[#131921] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                        >
                            {isGenerating ? <Wand2 className="animate-spin" /> : <Rocket size={20}/>}
                            {isGenerating ? 'Đang "đúc" KOL...' : 'Khởi tạo KOL AI'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white mb-4 shadow-xl border-4 border-white">
                                <User size={48} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">{profile.name}</h3>
                            <p className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mt-1">{profile.industry}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">Điểm mạnh</h4>
                                <p className="text-xs text-gray-700 leading-relaxed">{profile.strengths}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-red-500 uppercase mb-1 flex items-center gap-1">
                                    <Zap size={10} fill="currentColor"/> Điểm dang dở
                                </h4>
                                <p className="text-xs text-red-700 font-medium leading-relaxed">{profile.unfulfilledPoint}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">USP độc bản</h4>
                                <p className="text-xs text-blue-700 font-bold italic leading-relaxed">"{profile.usp}"</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => { setProfile(null); setShowPlan(false); }}
                            className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-xs font-bold hover:border-red-200 hover:text-red-500 transition-all"
                        >
                            Tạo nhân vật khác
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-50 p-8 overflow-y-auto custom-scrollbar">
                {!profile ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl text-gray-300">
                            <BrainCircuit size={40}/>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">Trung tâm Thiết kế KOL</h3>
                        <p className="text-gray-500 text-sm">Hệ thống của chúng tôi sẽ phân tích xu hướng TMĐT để tạo ra một nhân vật có điểm yếu thực tế, giúp tăng 300% tỉ lệ chuyển đổi qua các nội dung hài hước & chân thật.</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in slide-in-from-right">
                        {/* Tabs */}
                        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200 w-fit">
                            <button 
                                onClick={() => setShowPlan(false)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${!showPlan ? 'bg-[#131921] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                <Target size={18}/> Chiến lược nhân vật
                            </button>
                            <button 
                                onClick={() => setShowPlan(true)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${showPlan ? 'bg-[#131921] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                <Video size={18}/> Kế hoạch 30 ngày
                            </button>
                        </div>

                        {!showPlan ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Profile Details */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <ListChecks className="text-[#febd69]"/> Format Nội dung Viral
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {profile.contentFormats.map((f, i) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-white hover:border-[#febd69] transition-all">
                                                    <span className="w-6 h-6 rounded-lg bg-[#febd69] text-black text-[10px] font-black flex items-center justify-center group-hover:scale-110 transition-transform">{i+1}</span>
                                                    <span className="text-sm font-bold text-gray-700">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-[#131921] p-6 rounded-3xl shadow-xl text-white">
                                        <h3 className="font-black mb-4 flex items-center gap-2 text-[#febd69]">
                                            <Sparkles size={18}/> Giọng nói & Phong cách
                                        </h3>
                                        <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{profile.voiceStyle}"</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                                        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                                            <Play className="text-red-500" fill="currentColor"/> 5 Video mẫu đầu tiên
                                        </h3>
                                        <div className="space-y-4">
                                            {profile.sampleVideos.map((v, i) => (
                                                <div key={i} className="p-4 border border-gray-100 rounded-2xl hover:border-red-200 transition-all">
                                                    <h4 className="font-bold text-sm text-gray-900 mb-1">{v.title}</h4>
                                                    <p className="text-[10px] text-red-600 font-bold uppercase mb-2">Hook: {v.hook}</p>
                                                    <p className="text-xs text-gray-500 mb-2">{v.content}</p>
                                                    <div className="text-[10px] bg-gray-100 p-2 rounded-lg text-gray-600 font-medium">
                                                        <span className="font-bold">Lý do viral:</span> {v.viralReason}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right">
                                <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-3xl text-white mb-8 flex justify-between items-center shadow-xl">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1">Roadmap 30 Video Viral</h3>
                                        <p className="text-sm text-red-100">Kịch bản chi tiết dựa trên phong cách Unfulfilled của {profile.name}</p>
                                    </div>
                                    <Video size={48} className="opacity-20"/>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {(KOL_VIDEO_IDEAS[profile.industry.toLowerCase() as keyof typeof KOL_VIDEO_IDEAS] || []).map((idea, idx) => (
                                        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#febd69] hover:shadow-lg transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 text-gray-100 group-hover:text-[#febd69]/20 transition-colors">
                                                <Video size={40} />
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 font-black text-xs flex items-center justify-center mb-4 group-hover:bg-[#febd69] group-hover:text-black transition-all">
                                                {idx + 1}
                                            </div>
                                            <h4 className="font-bold text-sm text-gray-900 leading-snug">{idea}</h4>
                                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Short-form video</span>
                                                <button className="text-blue-600 hover:text-blue-700 transition-colors">
                                                    <ChevronRight size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Users size={16}/> 1.2k People built
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Star size={16} fill="currentColor" className="text-yellow-400"/> 4.9/5 Rating
                </div>
            </div>
            {profile && (
                <button className="px-10 py-3 bg-[#febd69] text-black font-black rounded-2xl shadow-lg hover:bg-[#f3a847] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
                    <Video size={18}/> Xuất Kịch Bản Sang Studio
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default KOLCreatorStudio;
