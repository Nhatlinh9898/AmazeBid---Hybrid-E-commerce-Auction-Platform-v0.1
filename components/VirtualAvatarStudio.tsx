
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { X, Box, Radio, Send, Sparkles, Video, Volume2, MessageSquare, Heart, Share2, Wand2, MonitorPlay, Zap, RefreshCw, Palette, Play, Info } from 'lucide-react';
import { MOCK_AVATARS, MOCK_ENVIRONMENTS } from '../data';
import { GoogleGenAI } from "@google/genai";
import { Product, AvatarConfig } from '../types';

interface VirtualAvatarStudioProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const VirtualAvatarStudio: React.FC<VirtualAvatarStudioProps> = ({ isOpen, onClose, products }) => {
  const [viewMode, setViewMode] = useState<'3D' | 'VIDEO'>('3D');
  const [activeTab, setActiveTab] = useState<'PERSONA' | 'STUDIO' | 'LIVE'>('PERSONA');
  
  // Initialize with the first avatar from data
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarConfig>(MOCK_AVATARS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  
  // Initialize model ID from the selected avatar
  const [modelId, setModelId] = useState(MOCK_AVATARS[0].sketchfabId || '0f5c66b6c0e4428080004f4a3e7906d5');
  
  const [isLive, setIsLive] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<{user: string, text: string, time: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Function to handle switching avatars
  const handleSelectAvatar = (avatar: AvatarConfig) => {
    setSelectedAvatar(avatar);
    setChatHistory([]); // Clear chat when switching characters
    if (avatar.sketchfabId) {
      setModelId(avatar.sketchfabId);
    }
  };

  const generateLiveResponse = async (userMsg: string) => {
    setIsAiProcessing(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `Bạn là ${selectedAvatar.name}, một KOL ảo với vai trò: ${selectedAvatar.role}.
    Tính cách/Giọng điệu: ${selectedAvatar.voiceTone}.
    Sản phẩm đang giới thiệu: ${selectedProduct?.title || 'Sản phẩm AmazeBid'}.
    Nhiệm vụ: Trả lời khách hàng trendy, ngắn gọn và điều khiển cơ thể 3D.
    Hãy trả lời kèm theo một "hành động" trong ngoặc vuông ở cuối câu, ví dụ: [WAVE], [DANCE], [POINT], [NOD], [LAUGH].`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: systemPrompt }
      });
      
      const reply = response.text || "Đang kết nối tín hiệu 3D...";
      setChatHistory(prev => [...prev, { user: selectedAvatar.name, text: reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      
      // Giả lập giọng nói
      const utterance = new SpeechSynthesisUtterance(reply.replace(/\[.*?\]/g, ''));
      utterance.lang = 'vi-VN';
      // Adjust pitch/rate based on gender if needed
      utterance.pitch = selectedAvatar.gender === 'FEMALE' ? 1.2 : 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatHistory(prev => [...prev, { user: 'Khách hàng', text: inputMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    const msg = inputMessage;
    setInputMessage('');
    generateLiveResponse(msg);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-[#020617] text-white flex flex-col h-screen w-screen overflow-hidden font-sans">
      
      {/* Top Navigation */}
      <div className="bg-white/5 backdrop-blur-2xl border-b border-white/10 p-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Box size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">AMAZEKOL <span className="text-indigo-400">3D ENGINE</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Sketchfab & Gemini</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button onClick={() => setViewMode('3D')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === '3D' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>3D MODEL</button>
          <button onClick={() => setViewMode('VIDEO')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'VIDEO' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>VIDEO REEL</button>
        </div>

        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24}/>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Control Panel */}
        <div className="w-80 bg-[#0f172a] border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          
          <section>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Chọn Nhân vật KOL</label>
            <div className="space-y-3">
              {MOCK_AVATARS.map(avatar => (
                <button 
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${selectedAvatar.id === avatar.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 bg-white/5'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                    <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-black">{avatar.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{avatar.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs font-black flex items-center gap-2 mb-3">
              <Zap size={14} className="text-indigo-400"/> AI Profile Active
            </h3>
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Tính cách:</span>
                    <span className="text-white font-bold">{selectedAvatar.voiceTone}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Model ID:</span>
                    <span className="font-mono text-xs text-indigo-400">{modelId.slice(0,6)}...</span>
                </div>
            </div>
          </section>

          <div className="mt-auto space-y-4">
             <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-indigo-400 mb-1">TRẠNG THÁI AI</p>
                <p className="text-[10px] text-slate-300">Gemini đang điều khiển hành vi của {selectedAvatar.name}. Hãy thử yêu cầu KOL nhảy hoặc chào!</p>
             </div>
          </div>
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 bg-black relative">
          {viewMode === '3D' ? (
            <div className="w-full h-full relative">
              {/* Sketchfab Iframe Viewer */}
              <iframe 
                title="Sketchfab 3D Viewer"
                className="w-full h-full border-0"
                src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=0&ui_stop=0&ui_watermark=0`}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                execution-while-out-of-viewport
                execution-while-not-rendered
                web-share
              />
              
              {/* Overlay UI */}
              <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-4">
                 {/* Chat Feed */}
                 <div className="max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                    {chatHistory.length === 0 && <p className="text-center text-slate-500 text-xs my-auto italic">Bắt đầu trò chuyện với {selectedAvatar.name}...</p>}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className="animate-in slide-in-from-bottom-2">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${msg.user === selectedAvatar.name ? 'text-indigo-400' : 'text-slate-400'}`}>{msg.user}: </span>
                        <span className="text-xs text-slate-200">{msg.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                 </div>

                 {/* Input Area */}
                 <div className="flex gap-2 bg-white/10 backdrop-blur-3xl p-2 rounded-2xl border border-white/10">
                    <input 
                      className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-slate-500"
                      placeholder={`Hỏi ${selectedAvatar.name} về sản phẩm...`}
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isAiProcessing}
                      className="bg-indigo-600 p-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                      {isAiProcessing ? <RefreshCw className="animate-spin" size={18}/> : <Send size={18}/>}
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
               <div className="text-center">
                  <Video size={48} className="mx-auto mb-4 text-slate-700" />
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Chế độ Video Reel đang bảo trì</p>
               </div>
            </div>
          )}

          {/* Social Floating Controls */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
             <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all border border-white/10">
                <Heart size={20} />
             </button>
             <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all border border-white/10">
                <Share2 size={20} />
             </button>
             <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all border border-white/10">
                <Info size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualAvatarStudio;
