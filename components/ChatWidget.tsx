
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MoreHorizontal, Image, Smile, Paperclip, ChevronLeft, Search } from 'lucide-react';
import { ChatConversation } from '../types';

const MOCK_CONVERSATIONS: ChatConversation[] = [
    {
        id: 'c1', partnerId: 'shop1', partnerName: 'Tech Official Store', partnerAvatar: 'https://ui-avatars.com/api/?name=Tech&background=0D8ABC&color=fff',
        lastMessage: 'Dạ sản phẩm này còn hàng ạ, bạn đặt ngay nhé!', lastTime: '2m', unread: 1,
        messages: [
            { id: 'm1', senderId: 'me', text: 'Chào shop, iPhone 15 còn màu Titan không?', timestamp: '10:00 AM' },
            { id: 'm2', senderId: 'shop1', text: 'Dạ còn ạ. Fullbox nguyên seal bảo hành 12 tháng.', timestamp: '10:05 AM' },
            { id: 'm3', senderId: 'shop1', text: 'Dạ sản phẩm này còn hàng ạ, bạn đặt ngay nhé!', timestamp: '10:06 AM' }
        ]
    },
    {
        id: 'c2', partnerId: 'shop2', partnerName: 'Minh Hằng Boutique', partnerAvatar: 'https://ui-avatars.com/api/?name=Minh+Hang&background=FF5722&color=fff',
        lastMessage: 'Cảm ơn bạn đã ủng hộ shop <3', lastTime: '1h', unread: 0,
        messages: [
            { id: 'm1', senderId: 'shop2', text: 'Váy vừa không bạn ơi?', timestamp: 'Yesterday' },
            { id: 'm2', senderId: 'me', text: 'Vừa in luôn shop, đẹp lắm!', timestamp: 'Yesterday' },
            { id: 'm3', senderId: 'shop2', text: 'Cảm ơn bạn đã ủng hộ shop <3', timestamp: 'Yesterday' }
        ]
    }
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatConversation | null>(null);
  const [input, setInput] = useState('');
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeChat?.messages]);

  const handleSend = () => {
      if (!input.trim() || !activeChat) return;
      const newMsg = { id: `m_${Date.now()}`, senderId: 'me', text: input, timestamp: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
      
      const updatedChat = { ...activeChat, messages: [...activeChat.messages, newMsg] };
      setActiveChat(updatedChat);
      
      setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...updatedChat, lastMessage: input, lastTime: 'Just now' } : c));
      setInput('');

      // Auto reply mock
      setTimeout(() => {
          const replyMsg = { id: `m_${Date.now()}`, senderId: activeChat.partnerId, text: 'Shop sẽ trả lời bạn trong giây lát...', timestamp: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) };
          const updatedChatWithReply = { ...updatedChat, messages: [...updatedChat.messages, newMsg, replyMsg] };
          setActiveChat(updatedChatWithReply);
          setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...updatedChatWithReply, lastMessage: 'Shop sẽ trả lời bạn trong giây lát...', lastTime: 'Just now' } : c));
      }, 1500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start font-sans">
      {isOpen && (
        <div className="mb-4 bg-white w-[350px] h-[480px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 origin-bottom-left">
            {/* Header */}
            <div className="bg-[#131921] p-3 text-white flex justify-between items-center shrink-0">
                {activeChat ? (
                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveChat(null)} className="hover:bg-white/10 p-1 rounded-full"><ChevronLeft size={20}/></button>
                        <div className="relative">
                            <img src={activeChat.partnerAvatar} className="w-8 h-8 rounded-full border border-white/20" />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#131921]"></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">{activeChat.partnerName}</h4>
                            <p className="text-[10px] text-green-400">Đang hoạt động</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">Tin nhắn</h3>
                        <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-bold">1</span>
                    </div>
                )}
                <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-white/10 rounded-full"><MoreHorizontal size={18}/></button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full"><X size={18}/></button>
                </div>
            </div>

            {/* Content */}
            {activeChat ? (
                // Chat Room
                <>
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3" ref={scrollRef}>
                        {activeChat.messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                                    msg.senderId === 'me' 
                                    ? 'bg-[#131921] text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                    <p className={`text-[9px] mt-1 text-right ${msg.senderId === 'me' ? 'text-gray-400' : 'text-gray-400'}`}>{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600"><Paperclip size={20}/></button>
                        <input 
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#febd69]"
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="text-[#febd69] hover:text-orange-600"><Send size={20}/></button>
                    </div>
                </>
            ) : (
                // Chat List
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3">
                        <div className="bg-gray-100 rounded-lg flex items-center px-3 py-2 mb-2">
                            <Search size={16} className="text-gray-400 mr-2"/>
                            <input className="bg-transparent text-sm outline-none w-full" placeholder="Tìm kiếm shop..."/>
                        </div>
                    </div>
                    {conversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChat(chat)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors"
                        >
                            <div className="relative shrink-0">
                                <img src={chat.partnerAvatar} className="w-12 h-12 rounded-full object-cover"/>
                                {chat.unread > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">{chat.unread}</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`text-sm truncate ${chat.unread > 0 ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>{chat.partnerName}</h4>
                                    <span className="text-[10px] text-gray-400 shrink-0">{chat.lastTime}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      {/* Launcher Button */}
      {!isOpen && (
        <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#131921] rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-black transition-transform hover:scale-110 relative group"
        >
            <MessageCircle size={28} className="text-[#febd69]"/>
            <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold items-center justify-center text-white">1</span>
            </span>
            <span className="absolute left-full ml-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">Chat với Shop</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
