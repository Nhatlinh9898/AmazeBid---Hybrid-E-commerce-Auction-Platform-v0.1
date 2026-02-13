
import React from 'react';
import { Bell, Package, Gavel, Tag, Info, Check } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDropdownProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkRead, onClearAll }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'ORDER': return <Package size={16} className="text-blue-500"/>;
      case 'BID': return <Gavel size={16} className="text-red-500"/>;
      case 'PROMO': return <Tag size={16} className="text-green-500"/>;
      default: return <Info size={16} className="text-gray-500"/>;
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 z-[60]">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-900">Thông báo</h3>
        <button onClick={onClearAll} className="text-xs text-blue-600 font-bold hover:underline">
          Đánh dấu đã đọc hết
        </button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 flex flex-col items-center">
            <Bell size={32} className="mb-2 opacity-20"/>
            <p className="text-sm">Bạn không có thông báo mới.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => onMarkRead(notif.id)}
              className={`p-4 flex gap-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm relative">
                {notif.image ? (
                    <img src={notif.image} className="w-full h-full rounded-full object-cover"/>
                ) : getIcon(notif.type)}
                {!notif.read && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"/>}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                    {notif.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
        <button className="text-xs font-bold text-gray-500 hover:text-black">Xem tất cả</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
