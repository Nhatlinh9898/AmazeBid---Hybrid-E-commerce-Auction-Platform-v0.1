
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import GeminiAssistant from './components/GeminiAssistant';
import SellModal from './components/SellModal';
import OrderDashboard from './components/OrderDashboard';
import LiveStreamViewer from './components/LiveStreamViewer';
import CreateStreamModal from './components/CreateStreamModal'; 
import BidModal from './components/BidModal';
import AuthModal from './components/AuthModal'; 
import UserProfile from './components/UserProfile'; 
import CustomerServiceModal from './components/CustomerServiceModal'; 
import ContentStudioModal from './components/ContentStudioModal'; 
import SuperDealsModal from './components/SuperDealsModal'; 
import SellerDashboard from './components/SellerDashboard'; 
import AdminDashboard from './components/AdminDashboard'; 
import KOLCreatorStudio from './components/KOLCreatorStudio';
import VirtualAvatarStudio from './components/VirtualAvatarStudio'; 
import SocialFeed from './components/SocialFeed'; 
import RewardsHub from './components/RewardsHub'; 
import VisualSearchModal from './components/VisualSearchModal'; 
import ProductDetailModal from './components/ProductDetailModal';
import CompareBar from './components/CompareBar'; 
import CompareModal from './components/CompareModal'; 
import CartDrawer from './components/CartDrawer'; // Import CartDrawer

import { AuthProvider, useAuth } from './context/AuthContext'; 

import { MOCK_PRODUCTS, MOCK_STREAMS } from './data';
import { Product, CartItem, ItemType, OrderStatus, LiveStream, Bid, ContentPost } from './types';
import { Filter, PackageSearch, Sparkles, User, Heart, Clock, History } from 'lucide-react';

const InnerApp: React.FC = () => {
  const { user } = useAuth();
  
  // --- STATE ---
  const [currentView, setCurrentView] = useState<'MARKET' | 'SOCIAL'>('MARKET');

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [streams, setStreams] = useState<LiveStream[]>(MOCK_STREAMS);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>([]); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [filterType, setFilterType] = useState<'ALL' | ItemType>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); 
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]); // Store Product IDs
  
  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isOrderDashboardOpen, setIsOrderDashboardOpen] = useState(false);
  const [bidModalProduct, setBidModalProduct] = useState<Product | null>(null);
  const [isCreateStreamModalOpen, setIsCreateStreamModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isContentStudioOpen, setIsContentStudioOpen] = useState(false);
  const [isSuperDealsOpen, setIsSuperDealsOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAvatarStudioOpen, setIsAvatarStudioOpen] = useState(false);
  const [isKOLStudioOpen, setIsKOLStudioOpen] = useState(false);
  const [isRewardsHubOpen, setIsRewardsHubOpen] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Compare List State
  const [compareList, setCompareList] = useState<Product[]>([]);

  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [isHostMode, setIsHostMode] = useState(false); 
  const [showLiveList, setShowLiveList] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false); 
  const [notification, setNotification] = useState<string | null>(null);

  const categories = ['Tất cả', 'Điện tử', 'Thời trang', 'Đồ cổ', 'Máy tính', 'Nhà cửa', 'Làm đẹp', 'Music'];

  // --- Load Recently Viewed from Local Storage ---
  useEffect(() => {
      const saved = localStorage.getItem('amaze_recent');
      if (saved) {
          try {
              setRecentlyViewed(JSON.parse(saved));
          } catch(e) {}
      }
  }, []);

  const addToRecentlyViewed = (product: Product) => {
      setRecentlyViewed(prev => {
          const newList = [product.id, ...prev.filter(id => id !== product.id)].slice(0, 5); // Keep last 5
          localStorage.setItem('amaze_recent', JSON.stringify(newList));
          return newList;
      });
  };

  const handleOpenDetail = (product: Product) => {
      setSelectedDetailProduct(product);
      addToRecentlyViewed(product);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== OrderStatus.AVAILABLE) return false;
      if (showWishlistOnly && !wishlist.includes(p.id)) return false;

      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory || (selectedCategory === 'Điện tử' && p.category === 'Electronics');
      const matchesType = filterType === 'ALL' || p.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, products, selectedCategory, filterType, showWishlistOnly, wishlist]);

  const recentProducts = useMemo(() => {
      return recentlyViewed.map(id => products.find(p => p.id === id)).filter(p => p) as Product[];
  }, [recentlyViewed, products]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Cart Logic ---
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`Đã thêm ${product.title} vào giỏ hàng`);
    setIsCartOpen(true); // Auto open drawer
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
          return item;
      }));
  };

  const handleRemoveFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
      if (!user) {
          setIsCartOpen(false);
          setIsAuthModalOpen(true);
          return;
      }
      if (confirm(`Xác nhận thanh toán ${cart.length} món hàng?`)) {
          setCart([]);
          setIsCartOpen(false);
          showNotification("Thanh toán thành công! Đơn hàng đang được xử lý.");
          // In real app, create Order in DB here
      }
  };

  // Handle Negotiation Success OR Team Buy Success - Add to cart with NEW PRICE
  const handleAddToCartWithPrice = (product: Product, newPrice: number) => {
      const negotiatedProduct = { ...product, price: newPrice };
      setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
              return prev.map(item => 
                  item.id === product.id 
                  ? { ...item, quantity: item.quantity + 1, price: newPrice } 
                  : item
              );
          }
          return [...prev, { ...negotiatedProduct, quantity: 1 }];
      });
      showNotification(`Đã chốt đơn ${product.title} với giá đặc biệt $${newPrice}!`);
      setIsCartOpen(true);
  };

  const handleToggleCompare = (product: Product) => {
      setCompareList(prev => {
          const exists = prev.find(p => p.id === product.id);
          if (exists) {
              return prev.filter(p => p.id !== product.id);
          } else {
              if (prev.length >= 2) {
                  showNotification("Chỉ có thể so sánh tối đa 2 sản phẩm cùng lúc.");
                  return prev;
              }
              showNotification(`Đã thêm ${product.title} vào so sánh`);
              return [...prev, product];
          }
      });
  };

  const handleToggleWishlist = (product: Product) => {
      setWishlist(prev => {
          if (prev.includes(product.id)) {
              showNotification(`Đã bỏ thích ${product.title}`);
              return prev.filter(id => id !== product.id);
          } else {
              showNotification(`Đã thêm ${product.title} vào yêu thích`);
              return [...prev, product.id];
          }
      });
  };

  const handleOpenBidModal = (product: Product) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setBidModalProduct(product);
  };

  const handleSubmitBid = (product: Product, amount: number) => {
    if (!user) return;
    setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
            const newBid: Bid = {
                id: `bid_${Date.now()}`, userId: user.id, userName: user.fullName.split(' ').pop() || 'User',
                amount: amount, timestamp: new Date().toISOString()
            };
            return { ...p, currentBid: amount, bidCount: (p.bidCount || 0) + 1, bidHistory: p.bidHistory ? [...p.bidHistory, newBid] : [newBid] };
        }
        return p;
    }));
    showNotification(`Đã đặt giá thầu $${amount} thành công!`);
  };

  const handleAddProduct = (newProduct: Product) => {
    if (!user) { setIsAuthModalOpen(true); return; }
    setProducts(prev => [{ ...newProduct, sellerId: user.id }, ...prev]);
    showNotification(`Niêm yết thành công!`);
  };

  const handleAddContentPost = (post: ContentPost) => {
      setContentPosts(prev => [post, ...prev]);
      showNotification(`Đã xuất bản bài viết lên AmazeFeed!`);
      setCurrentView('SOCIAL');
  };

  const handleCreateStream = (streamData: Partial<LiveStream>) => {
    if (!user) return;
    const newStream = { ...streamData, hostName: user.fullName, hostAvatar: user.avatar } as LiveStream;
    setStreams(prev => [newStream, ...prev]);
    setIsCreateStreamModalOpen(false);
    setActiveStream(newStream);
    setIsHostMode(true);
  };

  const handleOrderStatusUpdate = (productId: string, newStatus: OrderStatus) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
  };

  const myProducts = useMemo(() => user ? products.filter(p => p.sellerId === user.id) : [], [products, user]);
  const superDealsProducts = useMemo(() => products.filter(p => p.type === ItemType.FIXED_PRICE && (p.originalPrice && p.originalPrice > p.price)), [products]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-20">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        wishlistCount={wishlist.length}
        onSearch={setSearchTerm}
        openCart={() => setIsCartOpen(true)}
        openWishlist={() => { setShowWishlistOnly(!showWishlistOnly); setCurrentView('MARKET'); }}
        openSellModal={() => setIsSellModalOpen(true)}
        openOrders={() => setIsOrderDashboardOpen(true)}
        onOpenLiveStudio={() => user ? setIsCreateStreamModalOpen(true) : setIsAuthModalOpen(true)}
        onViewLiveStreams={() => setShowLiveList(!showLiveList)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCustomerService={() => setIsCustomerServiceOpen(true)}
        onOpenContentStudio={() => setIsContentStudioOpen(true)}
        onOpenSuperDeals={() => setIsSuperDealsOpen(true)}
        onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenAvatarStudio={() => setIsAvatarStudioOpen(true)}
        onOpenKOLStudio={() => setIsKOLStudioOpen(true)}
        onOpenRewards={() => setIsRewardsHubOpen(true)}
        onOpenVisualSearch={() => setIsVisualSearchOpen(true)}
        
        currentView={currentView}
        onChangeView={setCurrentView}
      />

      {/* Main Content Area based on View */}
      {currentView === 'MARKET' ? (
          <main className="max-w-[1500px] mx-auto px-4 py-6 animate-in fade-in">
            {showWishlistOnly && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex justify-between items-center animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                        <Heart fill="currentColor"/> Danh sách yêu thích ({wishlist.length})
                    </div>
                    <button onClick={() => setShowWishlistOnly(false)} className="text-sm underline text-gray-500 hover:text-black">
                        Xem tất cả sản phẩm
                    </button>
                </div>
            )}

            {showLiveList && (
                <div className="mb-10 animate-in slide-in-from-top-4 fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"/>
                        <h2 className="text-xl font-bold uppercase">Đang phát trực tiếp</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {streams.map(stream => (
                            <div key={stream.id} onClick={() => { setActiveStream(stream); setIsHostMode(false); }} className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-lg">
                                <img src={stream.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-4 text-white">
                                    <h3 className="font-bold text-lg mb-1">{stream.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <img src={stream.hostAvatar} className="w-6 h-6 rounded-full border border-white" />
                                        <span className="text-xs">{stream.hostName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!showLiveList && !showWishlistOnly && (
                <>
                    <div className="relative h-[250px] md:h-[350px] mb-8 overflow-hidden rounded-xl shadow-lg group">
                        <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500" alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-8 md:p-12 text-white">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">MUA SẮM THÔNG MINH<br/>ĐẤU GIÁ ĐỈNH CAO</h1>
                            <button onClick={() => user ? setIsSellModalOpen(true) : setIsAuthModalOpen(true)} className="bg-[#febd69] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#f3a847] w-fit shadow-lg transition-transform hover:-translate-y-1">Đăng bán ngay</button>
                        </div>
                    </div>

                    {/* Recently Viewed Section */}
                    {recentProducts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                <History size={20} className="text-[#febd69]"/> Đã xem gần đây
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {recentProducts.map(p => (
                                    <div key={`recent_${p.id}`} onClick={() => handleOpenDetail(p)} className="bg-white p-3 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-all">
                                        <img src={p.image} className="w-full aspect-square object-cover rounded mb-2 bg-gray-50"/>
                                        <p className="text-xs font-bold truncate">{p.title}</p>
                                        <p className="text-xs text-[#b12704] font-black">${p.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!showWishlistOnly && (
                <div className="bg-white p-2 rounded-xl shadow-sm mb-8 flex items-center overflow-x-auto no-scrollbar gap-2 sticky top-[108px] z-40 border border-gray-100">
                <div className="flex items-center gap-2 px-4 border-r border-gray-200 mr-2 shrink-0">
                    <Filter size={18} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Danh mục</span>
                </div>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${selectedCategory === cat ? 'bg-[#131921] text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                    {cat}
                    </button>
                ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart} 
                    onPlaceBid={handleOpenBidModal}
                    onOpenDetail={handleOpenDetail} 
                    onToggleCompare={handleToggleCompare} 
                    isCompared={compareList.some(p => p.id === product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl p-20 text-center shadow-sm">
                    <PackageSearch size={40} className="text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-gray-800">Không tìm thấy sản phẩm</h3>
                    {showWishlistOnly && <p className="text-gray-500 mt-2">Bạn chưa yêu thích sản phẩm nào.</p>}
                </div>
              )}
            </div>
          </main>
      ) : (
          <SocialFeed 
            posts={contentPosts} 
            products={products}
            onAddToCart={handleAddToCart}
            onPlaceBid={handleOpenBidModal}
          />
      )}

      {/* Modals & Drawers */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {isSellModalOpen && <SellModal onClose={() => setIsSellModalOpen(false)} onAddProduct={handleAddProduct}/>}
      {isCreateStreamModalOpen && <CreateStreamModal onClose={() => setIsCreateStreamModalOpen(false)} onStartStream={handleCreateStream} myProducts={products.filter(p => p.sellerId === user?.id)} onOpenSellModal={() => setIsSellModalOpen(true)}/>}
      {bidModalProduct && <BidModal product={bidModalProduct} onClose={() => setBidModalProduct(null)} onSubmitBid={(amount) => handleSubmitBid(bidModalProduct, amount)}/>}
      <SuperDealsModal isOpen={isSuperDealsOpen} onClose={() => setIsSuperDealsOpen(false)} products={superDealsProducts} onAddToCart={handleAddToCart} />
      <SellerDashboard isOpen={isSellerDashboardOpen} onClose={() => setIsSellerDashboardOpen(false)} products={products} currentUserId={user?.id || 'currentUser'} />
      <AdminDashboard isOpen={isAdminDashboardOpen} onClose={() => setIsAdminDashboardOpen(false)} />
      <KOLCreatorStudio isOpen={isKOLStudioOpen} onClose={() => setIsKOLStudioOpen(false)} />
      
      <VirtualAvatarStudio isOpen={isAvatarStudioOpen} onClose={() => setIsAvatarStudioOpen(false)} products={myProducts} />
      <RewardsHub isOpen={isRewardsHubOpen} onClose={() => setIsRewardsHubOpen(false)} />
      
      <VisualSearchModal 
        isOpen={isVisualSearchOpen} 
        onClose={() => setIsVisualSearchOpen(false)} 
        products={products}
        onAddToCart={handleAddToCart}
        onPlaceBid={handleOpenBidModal}
      />

      <ProductDetailModal 
        isOpen={!!selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        product={selectedDetailProduct}
        onAddToCart={handleAddToCart}
        onPlaceBid={handleOpenBidModal}
        onAddToCartWithPrice={handleAddToCartWithPrice}
      />

      <CompareBar 
        products={compareList} 
        onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
        onClear={() => setCompareList([])}
        onCompare={() => setIsCompareModalOpen(true)}
      />
      <CompareModal 
        isOpen={isCompareModalOpen} 
        onClose={() => setIsCompareModalOpen(false)} 
        products={compareList} 
        onAddToCart={handleAddToCart}
      />

      <OrderDashboard isOpen={isOrderDashboardOpen} onClose={() => setIsOrderDashboardOpen(false)} products={products} currentUserId={user?.id || 'guest'} onUpdateStatus={handleOrderStatusUpdate} />
      {activeStream && <LiveStreamViewer stream={activeStream} products={products} isHost={isHostMode} onClose={() => { setActiveStream(null); setIsHostMode(false); }} onPlaceBid={handleSubmitBid} onAddToCart={handleAddToCart} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} myProducts={myProducts} myPosts={contentPosts} />
      <CustomerServiceModal isOpen={isCustomerServiceOpen} onClose={() => setIsCustomerServiceOpen(false)} />
      <ContentStudioModal isOpen={isContentStudioOpen} onClose={() => setIsContentStudioOpen(false)} onSavePost={handleAddContentPost} myProducts={myProducts} />

      {notification && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[500] bg-[#131921] text-white px-8 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 border-2 border-[#febd69] flex items-center gap-3">
          <Sparkles className="text-[#febd69]" size={16} />
          <span className="text-sm font-bold">{notification}</span>
        </div>
      )}

      <GeminiAssistant products={products} />
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    )
}

export default App;
