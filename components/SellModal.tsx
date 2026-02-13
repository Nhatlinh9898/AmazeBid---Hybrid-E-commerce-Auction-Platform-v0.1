
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Gavel, DollarSign, Tag, Info, PlusCircle, CreditCard, Landmark, Wallet, CheckCircle2, Sparkles, Search, Link2, Globe, Download, Calculator, ArrowRight, PieChart, AlertTriangle, Wand2, RefreshCw } from 'lucide-react';
import { Product, ItemType, OrderStatus } from '../types';
import { PRODUCT_TEMPLATES, AFFILIATE_NETWORK_ITEMS } from '../data';
import { generateProductImage } from '../services/geminiService';

interface SellModalProps {
  onClose: () => void;
  onAddProduct: (p: Product) => void;
}

const SellModal: React.FC<SellModalProps> = ({ onClose, onAddProduct }) => {
  const [activeTab, setActiveTab] = useState<'PHYSICAL' | 'AFFILIATE'>('PHYSICAL');
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<typeof PRODUCT_TEMPLATES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // --- Smart Pricing State ---
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcData, setCalcData] = useState({
      costPrice: 0,
      totalQuantity: 100,
      breakEvenCount: 20, // Mặc định thu hồi vốn sau 20 sản phẩm
      platformFeePercent: 5 // Phí sàn 5%
  });

  // --- AI Image Gen State ---
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Derived Pricing Data
  const totalCapital = calcData.costPrice * calcData.totalQuantity;
  const suggestedPrice = calcData.breakEvenCount > 0 ? Math.ceil(totalCapital / calcData.breakEvenCount) : 0;
  const systemFee = suggestedPrice * (calcData.platformFeePercent / 100);
  const netRevenuePerUnit = suggestedPrice - systemFee;
  const netProfitPerUnit = netRevenuePerUnit - calcData.costPrice;
  
  // Phase 2: Sau khi bán hết 20 cái, 80 cái còn lại là lãi ròng (trừ phí sàn)
  const profitPhase2 = suggestedPrice - systemFee; 

  // Affiliate Link Input (Manual)
  const [manualAffiliateLink, setManualAffiliateLink] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    image: `https://picsum.photos/seed/${Math.random()}/400/400`,
    payoutMethod: 'BANK_TRANSFER',
    isAffiliate: false,
    affiliateLink: '',
    platformName: '',
    commissionRate: 0,
    condition: 'NEW' as 'NEW' | 'LIKE_NEW' | 'USED'
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, title: value });

    if (value.length > 1) {
      const matches = PRODUCT_TEMPLATES.filter(item => 
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const applyTemplate = (template: typeof PRODUCT_TEMPLATES[0]) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
      price: template.price.toString(),
      category: template.category,
      image: template.image,
      type: ItemType.FIXED_PRICE 
    });
    setShowSuggestions(false);
  };

  const applySmartPrice = () => {
      setFormData({ ...formData, price: suggestedPrice.toString() });
      setShowCalculator(false);
  };

  const handleAiGenerateImage = async () => {
      if (!formData.title) {
          alert("Vui lòng nhập tên sản phẩm trước.");
          return;
      }
      setIsGeneratingImage(true);
      const prompt = `Professional product photography of ${formData.title}, ${formData.category}, studio lighting, high quality, white background`;
      const imgData = await generateProductImage(prompt);
      
      if (imgData) {
          setFormData({ ...formData, image: imgData });
      } else {
          alert("Không thể tạo ảnh lúc này. Vui lòng thử lại.");
      }
      setIsGeneratingImage(false);
  };

  // Add item from Affiliate Network
  const addFromAffiliateNetwork = (item: typeof AFFILIATE_NETWORK_ITEMS[0]) => {
    const newProduct: Product = {
        id: `aff_${Date.now()}`,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        type: ItemType.FIXED_PRICE,
        image: item.image,
        rating: 5.0,
        reviewCount: 0,
        status: OrderStatus.AVAILABLE,
        sellerId: 'currentUser',
        // Affiliate Specifics
        isAffiliate: true,
        platformName: item.platformName,
        commissionRate: item.commissionRate,
        affiliateLink: `${item.affiliateLink}?ref_id=user_123`, // Auto-generate link
        condition: 'NEW'
    };
    onAddProduct(newProduct);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      type: formData.type,
      image: formData.image,
      rating: 5.0,
      reviewCount: 0,
      status: OrderStatus.AVAILABLE,
      sellerId: 'currentUser',
      payoutMethod: formData.payoutMethod,
      isAffiliate: activeTab === 'AFFILIATE',
      affiliateLink: formData.affiliateLink || manualAffiliateLink,
      platformName: formData.platformName || 'External',
      commissionRate: formData.commissionRate,
      condition: formData.condition,
      ...(formData.type === ItemType.AUCTION ? { 
        currentBid: parseFloat(formData.price), 
        bidCount: 0,
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() 
      } : {})
    };
    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#131921] p-5 text-white flex justify-between items-center border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#febd69] rounded-lg">
              <PlusCircle size={24} className="text-[#131921]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                 {activeTab === 'PHYSICAL' ? 'Đăng bán sản phẩm' : 'Thêm Affiliate Link'}
              </h2>
              {activeTab === 'PHYSICAL' && (
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    <span className={step === 1 ? "text-[#febd69]" : ""}>1. Thông tin</span>
                    <span>&gt;</span>
                    <span className={step === 2 ? "text-[#febd69]" : ""}>2. Thanh toán</span>
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex border-b border-gray-100 shrink-0">
            <button 
                onClick={() => setActiveTab('PHYSICAL')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'PHYSICAL' ? 'text-[#131921] border-b-2 border-[#131921] bg-gray-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <Tag size={16} /> Hàng của tôi (Vật lý)
            </button>
            <button 
                onClick={() => setActiveTab('AFFILIATE')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'AFFILIATE' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <Globe size={16} /> Affiliate Network
            </button>
        </div>

        {activeTab === 'AFFILIATE' ? (
             // AFFILIATE MODE
             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
                <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Link2 size={18} className="text-blue-600"/>
                        Kho hàng tiếp thị liên kết (Shared Inventory)
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Chọn sản phẩm từ kho chung để thêm vào shop của bạn. Link tiếp thị sẽ được tự động tạo.
                    </p>
                    
                    <div className="space-y-3">
                        {AFFILIATE_NETWORK_ITEMS.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 hover:border-blue-400 transition-all group">
                                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl">
                                        {item.commissionRate}% HH
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-gray-500">{item.category} • Bán trên <span className="font-bold text-blue-600">{item.platformName}</span></p>
                                        </div>
                                        <p className="font-bold text-[#b12704]">${item.price}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                    
                                    <button 
                                        onClick={() => addFromAffiliateNetwork(item)}
                                        className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 border border-blue-200"
                                    >
                                        <Download size={14} /> Thêm vào kho hàng & Tạo Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm">Hoặc thêm thủ công Link Affiliate</h3>
                    <div className="flex gap-2">
                        <input 
                            value={manualAffiliateLink}
                            onChange={(e) => setManualAffiliateLink(e.target.value)}
                            className="flex-1 border border-gray-300 p-2 rounded-lg text-sm focus:border-blue-500 outline-none"
                            placeholder="Dán link sản phẩm (Amazon, Shopee, v.v.)"
                        />
                        <button className="bg-gray-800 text-white px-4 rounded-lg font-bold text-sm hover:bg-black">
                            Tìm
                        </button>
                    </div>
                </div>
             </div>
        ) : (
             // PHYSICAL MODE (Original)
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {step === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1: Product Info */}
                <div className="space-y-6">
                    <div ref={wrapperRef} className="relative">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider flex justify-between">
                        <span>Tên sản phẩm</span>
                        <span className="text-[#febd69] flex items-center gap-1 normal-case"><Sparkles size={10} /> Tự động điền</span>
                    </label>
                    <div className="relative">
                        <input 
                            required
                            autoFocus
                            className="w-full border-2 border-gray-100 p-3 pl-4 rounded-xl focus:border-[#febd69] focus:ring-0 outline-none transition-all placeholder:text-gray-300 text-sm font-medium"
                            placeholder="VD: iPhone 15, Rolex..."
                            value={formData.title}
                            onChange={handleTitleChange}
                            onFocus={() => {
                                if(formData.title.length > 1 && suggestions.length > 0) setShowSuggestions(true);
                            }}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                <div className="bg-gray-50 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    Gợi ý từ kho dữ liệu
                                </div>
                                {suggestions.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => applyTemplate(item)}
                                        className="p-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <img src={item.image} className="w-10 h-10 rounded bg-gray-200 object-cover" />
                                        <div>
                                            <p className="font-bold text-sm text-[#131921]">{item.title}</p>
                                            <p className="text-xs text-gray-400 truncate w-48">{item.category}</p>
                                        </div>
                                        <div className="ml-auto text-xs font-bold text-[#febd69] bg-[#131921] px-2 py-1 rounded">
                                            Auto-fill
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    </div>

                    <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Mô tả chi tiết</label>
                    <textarea 
                        required
                        rows={4}
                        className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#febd69] focus:ring-0 outline-none transition-all placeholder:text-gray-300 text-sm resize-none"
                        placeholder="Mô tả sẽ được tự động điền nếu chọn gợi ý..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                    </div>

                    <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Danh mục</label>
                    <select 
                        className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-[#febd69] outline-none transition-all text-sm font-bold bg-white"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="Electronics">Điện tử</option>
                        <option value="Collectibles">Đồ cổ / Sưu tầm</option>
                        <option value="Home & Office">Nhà cửa & Đời sống</option>
                        <option value="Music">Âm nhạc / Đĩa than</option>
                        <option value="Fashion">Thời trang</option>
                    </select>
                    </div>

                    {/* Condition Selector */}
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Tình trạng</label>
                        <div className="flex gap-2">
                            {['NEW', 'LIKE_NEW', 'USED'].map((cond) => (
                                <button
                                    key={cond}
                                    type="button"
                                    onClick={() => setFormData({...formData, condition: cond as any})}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                        formData.condition === cond 
                                        ? 'bg-[#131921] text-white border-[#131921]' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {cond === 'NEW' ? 'Mới 100%' : cond === 'LIKE_NEW' ? 'Like New' : 'Đã dùng'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center group hover:border-[#febd69] transition-all cursor-pointer relative overflow-hidden h-[200px]">
                        {/* Preview Image if Auto-filled */}
                        {isGeneratingImage ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
                                <Wand2 className="animate-spin text-[#febd69] mb-2" size={32} />
                                <p className="text-xs font-bold text-gray-500">AI đang vẽ ảnh...</p>
                            </div>
                        ) : null}

                        <img src={formData.image} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        
                        <div className="z-10 flex flex-col items-center gap-3">
                            <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                                <p className="text-xs font-bold text-gray-800 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-600"/> Ảnh hiện tại</p>
                            </div>
                            <button 
                                type="button"
                                onClick={handleAiGenerateImage}
                                className="bg-[#131921] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-black transition-all"
                            >
                                <Sparkles size={12} className="text-[#febd69]"/> Tạo ảnh AI
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Hình thức giao dịch</label>
                        <div className="flex p-1 bg-white rounded-lg border border-gray-200">
                            <button 
                            type="button"
                            onClick={() => setFormData({...formData, type: ItemType.FIXED_PRICE})}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === ItemType.FIXED_PRICE ? 'bg-[#131921] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                            <DollarSign size={14} /> MUA NGAY
                            </button>
                            <button 
                            type="button"
                            onClick={() => setFormData({...formData, type: ItemType.AUCTION})}
                            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === ItemType.AUCTION ? 'bg-[#febd69] text-black shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                            <Gavel size={14} /> ĐẤU GIÁ
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                {formData.type === ItemType.FIXED_PRICE ? 'Giá bán' : 'Giá khởi điểm'}
                            </label>
                            <button 
                                type="button"
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="text-[10px] font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                            >
                                <Calculator size={12}/> Tính giá thông minh
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</div>
                            <input 
                            required
                            type="number"
                            className="w-full border-2 border-gray-100 p-3 pl-8 rounded-xl focus:border-[#febd69] outline-none transition-all font-bold text-xl text-[#131921]"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-right">
                {/* Step 2: Payment & Payout Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <Info className="text-blue-600 shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Cơ chế Bảo vệ AmazeBid SafePay</p>
                    <p>Tiền của người mua sẽ được hệ thống tạm giữ. Bạn sẽ chỉ nhận được tiền sau khi người mua xác nhận đã nhận hàng thành công và không có khiếu nại trả hàng.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-wider">Chọn phương thức nhận tiền (Payout)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                        onClick={() => setFormData({...formData, payoutMethod: 'BANK_TRANSFER'})}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'BANK_TRANSFER' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <Landmark size={24} className="mb-2 text-gray-700" />
                        <p className="font-bold text-sm">Chuyển khoản NH</p>
                        <p className="text-xs text-gray-500 mt-1">1-3 ngày làm việc</p>
                    </div>
                    <div 
                        onClick={() => setFormData({...formData, payoutMethod: 'WALLET'})}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'WALLET' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <Wallet size={24} className="mb-2 text-gray-700" />
                        <p className="font-bold text-sm">Ví điện tử</p>
                        <p className="text-xs text-gray-500 mt-1">Tức thì (Momo/ZaloPay)</p>
                    </div>
                    <div 
                        onClick={() => setFormData({...formData, payoutMethod: 'CRYPTO'})}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.payoutMethod === 'CRYPTO' ? 'border-[#febd69] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <CreditCard size={24} className="mb-2 text-gray-700" />
                        <p className="font-bold text-sm">Tiền số (USDT)</p>
                        <p className="text-xs text-gray-500 mt-1">Mạng TRC20/ERC20</p>
                    </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Thông tin chi tiết</label>
                    <input 
                        className="w-full border border-gray-300 p-3 rounded-lg focus:border-[#febd69] outline-none text-sm"
                        placeholder={formData.payoutMethod === 'BANK_TRANSFER' ? "Số tài khoản - Tên ngân hàng - Chi nhánh" : "Địa chỉ ví / Số điện thoại ví"}
                    />
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                        <CheckCircle2 size={14} className="text-green-600 mt-0.5" />
                        <span>Tôi đồng ý với điều khoản: Nếu có trả hàng, phí vận chuyển sẽ được trừ vào tài khoản của tôi hoặc người mua tùy theo chính sách.</span>
                    </div>
                </div>
                </div>
            )}
            </form>
        )}

        {/* Smart Pricing Calculator Modal Layer */}
        {showCalculator && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom">
                <div className="bg-[#131921] p-4 text-white flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2"><Calculator size={20} className="text-[#febd69]"/> AmazeCalc: Định Giá Thông Minh</h3>
                    <button onClick={() => setShowCalculator(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={20}/></button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-50">
                    <div className="mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><PieChart size={16}/> Chiến lược hòa vốn (Break-even Strategy)</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Hệ thống sẽ tính giá bán sao cho bạn thu hồi toàn bộ vốn sau khi bán hết một lượng hàng nhỏ (ví dụ 20%). Số lượng còn lại sẽ là lợi nhuận ròng để chạy khuyến mãi.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Giá vốn 1 SP ($)</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-2 rounded-lg font-bold" 
                                value={calcData.costPrice}
                                onChange={e => setCalcData({...calcData, costPrice: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tổng số lượng nhập</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 p-2 rounded-lg font-bold" 
                                value={calcData.totalQuantity}
                                onChange={e => setCalcData({...calcData, totalQuantity: parseFloat(e.target.value) || 100})}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Muốn hòa vốn sau khi bán (Số lượng)</label>
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="range" min="1" max={calcData.totalQuantity} 
                                    value={calcData.breakEvenCount}
                                    onChange={e => setCalcData({...calcData, breakEvenCount: parseInt(e.target.value)})}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#febd69]"
                                />
                                <span className="text-sm font-bold w-12 text-center">{calcData.breakEvenCount}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">({Math.round((calcData.breakEvenCount/calcData.totalQuantity)*100)}% tổng kho)</p>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Tổng vốn đầu tư:</span>
                            <span className="font-bold text-gray-900">${totalCapital.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                            <span className="text-sm font-bold text-yellow-800">Giá bán đề xuất:</span>
                            <span className="font-black text-xl text-[#b12704]">${suggestedPrice.toLocaleString()}</span>
                        </div>
                        
                        {suggestedPrice > calcData.costPrice * 3 && (
                            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-100 p-2 rounded-lg">
                                <AlertTriangle size={14}/>
                                <span>Giá này gấp {Math.round(suggestedPrice/calcData.costPrice)}x giá vốn. Cân nhắc tăng số lượng hòa vốn để giảm giá bán.</span>
                            </div>
                        )}

                        <div className="bg-gray-100 p-3 rounded-lg text-xs space-y-2 mt-2">
                            <p className="font-bold text-gray-700 border-b pb-1 mb-1">Cơ cấu lợi nhuận (Trên 1 sản phẩm)</p>
                            <div className="flex justify-between">
                                <span>Giá bán:</span>
                                <span>${suggestedPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-red-500">
                                <span>Phí sàn ({calcData.platformFeePercent}%):</span>
                                <span>-${systemFee.toFixed(2)} (Trích nộp hệ thống)</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Giá vốn:</span>
                                <span>-${calcData.costPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-green-600 pt-1 border-t border-gray-300">
                                <span>Lợi nhuận ròng (Giai đoạn 1):</span>
                                <span>${netProfitPerUnit.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-2">
                            <p className="text-xs font-bold text-green-800 mb-1 flex items-center gap-1">
                                <Sparkles size={12}/> Giai đoạn 2 (Sau {calcData.breakEvenCount} sản phẩm):
                            </p>
                            <p className="text-[10px] text-green-700">
                                Bạn đã hòa vốn! {calcData.totalQuantity - calcData.breakEvenCount} sản phẩm còn lại là lãi ròng.
                                <br/>Lợi nhuận mỗi đơn sau đó: <strong>${profitPhase2.toFixed(2)}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
                    <button onClick={() => setShowCalculator(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Hủy</button>
                    <button 
                        onClick={applySmartPrice}
                        disabled={suggestedPrice <= 0}
                        className="flex-1 py-3 bg-[#131921] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        Áp dụng giá này <ArrowRight size={16}/>
                    </button>
                </div>
            </div>
        )}

        {/* Footer */}
        {activeTab === 'PHYSICAL' && (
             <div className="p-5 border-t border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                {step === 2 ? (
                    <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-500 font-bold text-sm hover:text-black"
                    >
                    Quay lại
                    </button>
                ) : (
                    <div />
                )}
                
                {step === 1 ? (
                    <button 
                    type="button"
                    onClick={() => {
                        if (formData.title && formData.price) setStep(2);
                    }}
                    className="bg-[#131921] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
                    >
                    Tiếp tục: Thanh toán
                    </button>
                ) : (
                    <button 
                    onClick={handleSubmit}
                    className="bg-[#febd69] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#f3a847] shadow-lg flex items-center gap-2"
                    >
                    Hoàn tất đăng bán
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SellModal;
