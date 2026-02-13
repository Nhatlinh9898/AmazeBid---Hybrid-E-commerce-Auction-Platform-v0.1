
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag, MoreHorizontal, Sparkles, CheckCircle2, TrendingUp, Gavel } from 'lucide-react';
import { ContentPost, Product, ItemType } from '../types';

interface SocialFeedProps {
  posts: ContentPost[];
  products: Product[]; // Để link sản phẩm vào bài viết
  onAddToCart: (p: Product) => void;
  onPlaceBid: (p: Product) => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ posts, products, onAddToCart, onPlaceBid }) => {
  // Mock data nếu chưa có bài đăng nào
  const [localPosts, setLocalPosts] = useState<ContentPost[]>(posts.length > 0 ? posts : [
    {
      id: 'mock_1',
      title: 'Review iPhone 15 Pro Max - Đáng tiền không?',
      content: 'Sau 1 tuần trải nghiệm, mình thấy camera 5x zoom thực sự đỉnh cao. Titan tự nhiên rất nhẹ, cầm không mỏi tay. Tuy nhiên pin chưa trâu như kỳ vọng. Chấm 9/10 nhé cả nhà! #iPhone15 #TechReview',
      keywords: ['Tech', 'Review'],
      generatedImages: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'],
      status: 'PUBLISHED',
      platform: 'TIKTOK',
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock_2',
      title: 'Săn đồng hồ Rolex cũ giá hời',
      content: 'Không thể tin được mình săn được em Datejust này với giá khởi điểm chỉ $5000. Mọi người vào đấu giá ngay kẻo lỡ nhé, hàng hiếm đấy! #Rolex #Luxury',
      keywords: ['Luxury', 'Auction'],
      generatedImages: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
      status: 'PUBLISHED',
      platform: 'FACEBOOK',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Hàm tìm sản phẩm liên quan (Giả lập logic matching theo tên)
  const getRelatedProduct = (postTitle: string) => {
    // Tìm sản phẩm có tên trùng khớp một phần với tiêu đề bài viết
    return products.find(p => postTitle.toLowerCase().includes(p.title.split(' ')[0].toLowerCase())) || products[0];
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8 pb-24">
      {/* Header Feed */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
           <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
             Amaze<span className="text-[#febd69]">Feed</span>
           </h2>
           <p className="text-xs text-gray-500 font-medium">Khám phá xu hướng & KOL Reviews</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
           <Sparkles size={12} /> AI Curated
        </div>
      </div>

      {localPosts.map((post) => {
        const relatedProduct = getRelatedProduct(post.title);
        const isLiked = likedPosts[post.id];

        return (
          <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Post Header */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#febd69] to-orange-500 p-[2px]">
                   <div className="w-full h-full rounded-full bg-white p-0.5">
                      <img src={`https://ui-avatars.com/api/?name=${post.platform}&background=random`} className="w-full h-full rounded-full object-cover"/>
                   </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1">
                    {post.platform === 'TIKTOK' ? 'TechReviewer_AI' : 'LuxuryHunter'} 
                    <CheckCircle2 size={12} className="text-blue-500 fill-blue-50"/>
                  </h4>
                  <p className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()} • Được tạo bởi Gemini</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20}/></button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
               <h3 className="font-bold text-base mb-1">{post.title}</h3>
               <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {post.content.split('#')[0]}
                  {post.keywords.map(k => <span key={k} className="text-blue-600 font-medium">#{k} </span>)}
               </p>
            </div>

            {/* Visuals */}
            <div className="mt-3 relative bg-black">
               {post.generatedImages && post.generatedImages.length > 0 ? (
                 <img src={post.generatedImages[0]} className="w-full h-auto object-cover max-h-[500px]" />
               ) : (
                 <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
               )}
               
               {/* Product Tag Overlay */}
               {relatedProduct && (
                 <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <img src={relatedProduct.image} className="w-10 h-10 rounded-lg bg-gray-200 object-cover shrink-0"/>
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{relatedProduct.title}</p>
                          <p className="text-xs font-black text-[#b12704]">${relatedProduct.price}</p>
                       </div>
                    </div>
                    
                    {relatedProduct.type === ItemType.AUCTION ? (
                        <button 
                            onClick={() => onPlaceBid(relatedProduct)}
                            className="bg-[#131921] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 hover:bg-black transition-colors"
                        >
                            <Gavel size={14}/> Đấu giá
                        </button>
                    ) : (
                        <button 
                            onClick={() => onAddToCart(relatedProduct)}
                            className="bg-[#febd69] text-black px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 hover:bg-[#f3a847] transition-colors"
                        >
                            <ShoppingBag size={14}/> Mua ngay
                        </button>
                    )}
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="p-4 flex items-center justify-between">
               <div className="flex gap-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1 text-sm font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  >
                     <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                     <span>{isLiked ? '1.2k' : '1.2k'}</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-blue-500">
                     <MessageCircle size={22} />
                     <span>48</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-green-500">
                     <Share2 size={22} />
                  </button>
               </div>
               <div className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  <TrendingUp size={12}/> Trending
               </div>
            </div>
            
            <div className="px-4 pb-4">
               <p className="text-xs text-gray-500 cursor-pointer hover:underline">Xem tất cả 48 bình luận...</p>
            </div>
          </div>
        );
      })}
      
      <div className="text-center py-8 text-gray-400">
         <Sparkles className="mx-auto mb-2 opacity-50"/>
         <p className="text-sm">Bạn đã xem hết tin hôm nay.</p>
         <p className="text-xs mt-1">Hãy dùng Content Studio để tạo thêm bài viết!</p>
      </div>
    </div>
  );
};

export default SocialFeed;
