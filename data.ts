
import { Product, ItemType, OrderStatus, LiveStream, User, Transaction, AvatarConfig, AvatarOutfit, AvatarEnvironment, Reward } from './types';

export const MOCK_REWARDS: Reward[] = [
    {
        id: 'r1',
        title: 'Voucher Giảm $5',
        description: 'Áp dụng cho đơn hàng từ $50. Hạn dùng 30 ngày.',
        cost: 500,
        image: 'https://cdn-icons-png.flaticon.com/512/726/726476.png',
        type: 'VOUCHER',
        code: 'SAVE5'
    },
    {
        id: 'r2',
        title: 'Free Shipping',
        description: 'Miễn phí vận chuyển tối đa $10 cho mọi đơn hàng.',
        cost: 800,
        image: 'https://cdn-icons-png.flaticon.com/512/411/411763.png',
        type: 'VOUCHER',
        code: 'FREESHIP'
    },
    {
        id: 'r3',
        title: 'Hộp Quà Bí Ẩn (Mystery Box)',
        description: 'Nhận ngẫu nhiên một món phụ kiện công nghệ hoặc thời trang.',
        cost: 2000,
        image: 'https://cdn-icons-png.flaticon.com/512/4213/4213958.png',
        type: 'GIFT'
    },
    {
        id: 'r4',
        title: 'VIP Profile Frame',
        description: 'Khung ảnh đại diện VIP Diamond độc quyền trong 1 tháng.',
        cost: 1500,
        image: 'https://cdn-icons-png.flaticon.com/512/5406/5406813.png',
        type: 'DIGITAL'
    }
];

export const AFFILIATE_NETWORK_ITEMS = [
  {
    title: "Kindle Paperwhite (16 GB)",
    description: "Màn hình 6.8 inch, đèn nền ấm có thể điều chỉnh, thời lượng pin lên đến 10 tuần.",
    price: 139.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 8,
    affiliateLink: "https://amazon.com/dp/B08KTZ8249"
  },
  {
    title: "Nồi chiên không dầu Philips XXL",
    description: "Công nghệ Rapid Air, giảm 90% lượng dầu mỡ. Dung tích lớn cho cả gia đình.",
    price: 250.00,
    image: "https://images.unsplash.com/photo-1626162976644-b00344d51b8c?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Shopee",
    commissionRate: 5,
    affiliateLink: "https://shopee.vn/philips-xxl"
  },
  {
    title: "AirPods Pro 2nd Gen",
    description: "Chống ồn chủ động adaptive, âm thanh không gian, pin lên đến 6 giờ.",
    price: 249.00,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 6,
    affiliateLink: "https://amazon.com/dp/B09JQMJHWG"
  },
  {
    title: "MacBook Air M2 13 inch",
    description: "Chip M2 siêu mạnh, mỏng nhẹ 1.24kg, màn hình Liquid Retina 13.6 inch.",
    price: 999.00,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Lazada",
    commissionRate: 4,
    affiliateLink: "https://lazada.vn/macbook-air-m2"
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Chống ồn industry leading, 30 giờ pin, chất âm Hi-Res.",
    price: 379.00,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Tiki",
    commissionRate: 7,
    affiliateLink: "https://tiki.vn/sony-wh1000xm5"
  },
  {
    title: "Dyson V15 Detect Vacuum",
    description: "Hệ thống laser phát hiện bụi, công suất 230AW, pin 60 phút.",
    price: 699.00,
    image: "https://images.unsplash.com/photo-1578912699407-2a8b2b5c3b7c?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Amazon",
    commissionRate: 5,
    affiliateLink: "https://amazon.com/dp/B09JGQFMW3"
  },
  {
    title: "Nike Air Max 270",
    description: "Đế Air Max 270 unit, upper mesh thoáng khí, màu sắc trendy.",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400",
    category: "Fashion",
    platformName: "Shopee",
    commissionRate: 10,
    affiliateLink: "https://shopee.vn/nike-airmax270"
  },
  {
    title: "iPad Pro 12.9 inch M2",
    description: "Chip M2, màn hình Liquid Retina XDR, hỗ trợ Apple Pencil 2nd gen.",
    price: 1099.00,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 3,
    affiliateLink: "https://amazon.com/dp/B09J3KWLJ2"
  },
  {
    title: "Samsung Galaxy Watch 6",
    description: "Màn hình Super AMOLED, theo dõi sức khỏe toàn diện, pin 40 giờ.",
    price: 299.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Lazada",
    commissionRate: 8,
    affiliateLink: "https://lazada.vn/galaxy-watch6"
  },
  {
    title: "Lululemon Yoga Mat",
    description: "Thảm yoga cao cấp 5mm, chống trượt, thân thiện môi trường.",
    price: 78.00,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=400",
    category: "Fashion",
    platformName: "Tiki",
    commissionRate: 12,
    affiliateLink: "https://tiki.vn/lululemon-yoga-mat"
  },
  {
    title: "LEGO Creator Expert Bookshop",
    description: "Mô hình 2,504 chi tiết, kiến trúc châu Âu cổ điển.",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1589923268231-6a684e1c7b4c?auto=format&fit=crop&q=80&w=400",
    category: "Collectibles",
    platformName: "Amazon",
    commissionRate: 6,
    affiliateLink: "https://amazon.com/dp/B07W5NZL4G"
  },
  {
    title: "Instant Pot Duo 7-in-1",
    description: "Nồi đa năng 7 chức năng, dung tích 6QT, 14 chương trình thông minh.",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Shopee",
    commissionRate: 9,
    affiliateLink: "https://shopee.vn/instant-pot-duo"
  },
  {
    title: "Adidas Ultraboost 22",
    description: "Đế Boost responsive, upper Primeknit, công nghệ Continental.",
    price: 190.00,
    image: "https://images.unsplash.com/photo-1551107696-a4b0bf5a8c1c?auto=format&fit=crop&q=80&w=400",
    category: "Fashion",
    platformName: "Lazada",
    commissionRate: 11,
    affiliateLink: "https://lazada.vn/ultraboost22"
  },
  {
    title: "Canon EOS R6 Mark II",
    description: "Full-frame 24MP, Dual Pixel AF II, quay video 4K 60fps.",
    price: 2499.00,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b242cc32?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 2,
    affiliateLink: "https://amazon.com/dp/B0BNRZTXG8"
  },
  {
    title: "Vitamix 5200 Blender",
    description: "Máy xay sinh tố chuyên nghiệp, công suất 2HP, cối 64oz.",
    price: 449.00,
    image: "https://images.unsplash.com/photo-1577662614448-4f8e0c2b1c1f?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Tiki",
    commissionRate: 7,
    affiliateLink: "https://tiki.vn/vitamix-5200"
  },
  {
    title: "iPhone 15 Pro Max",
    description: "Chip A17 Pro, Titan grade 5, camera 48MP, Action button.",
    price: 1199.00,
    image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Amazon",
    commissionRate: 3,
    affiliateLink: "https://amazon.com/dp/B0CHX2XQ2F"
  },
  {
    title: "Samsung 85\" QLED 4K TV",
    description: "Smart TV QLED, Quantum HDR, Dolby Atmos, Gaming Hub.",
    price: 1499.00,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Lazada",
    commissionRate: 4,
    affiliateLink: "https://lazada.vn/samsung-qled85"
  },
  {
    title: "Tesla Model Y Floor Mats",
    description: "Thảm lót sàn cao cấp, chống thấm, khử mùi, chính hãng.",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=400",
    category: "Automotive",
    platformName: "Amazon",
    commissionRate: 8,
    affiliateLink: "https://amazon.com/dp/B08XYZ1234"
  },
  {
    title: "Peloton Bike+",
    description: "Xe đạp tập thông minh, màn hình 23.8\", live classes.",
    price: 2495.00,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400",
    category: "Sports",
    platformName: "Amazon",
    commissionRate: 5,
    affiliateLink: "https://amazon.com/dp/B08PXYZ567"
  },
  {
    title: "Dyson Supersonic Hair Dryer",
    description: "Máy sấy tóc nhanh, không nhiệt, magnetic attachments.",
    price: 399.00,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
    category: "Beauty",
    platformName: "Shopee",
    commissionRate: 10,
    affiliateLink: "https://shopee.vn/dyson-supersonic"
  },
  {
    title: "Nintendo Switch OLED",
    description: "Màn hình 7 inch OLED, 64GB storage, dock mode.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Tiki",
    commissionRate: 6,
    affiliateLink: "https://tiki.vn/nintendo-switch-oled"
  },
  {
    title: "Vans Old Skool Sneakers",
    description: "Classic skate shoes, canvas upper, waffle sole.",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400",
    category: "Fashion",
    platformName: "Shopee",
    commissionRate: 12,
    affiliateLink: "https://shopee.vn/vans-oldskool"
  },
  {
    title: "KitchenAid Stand Mixer",
    description: "Máy đánh trứng 5.5QT, 10 speeds, 3 attachments.",
    price: 379.99,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400",
    category: "Home & Office",
    platformName: "Amazon",
    commissionRate: 7,
    affiliateLink: "https://amazon.com/dp/B07W5NZL4H"
  },
  {
    title: "GoPro Hero 12 Black",
    description: "Camera 5.3K 60fps, HyperSmooth 6.0, waterproof.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1596462502278-27d52b24f849?auto=format&fit=crop&q=80&w=400",
    category: "Electronics",
    platformName: "Lazada",
    commissionRate: 8,
    affiliateLink: "https://lazada.vn/gopro-hero12"
  }
];

// Added missing PRODUCT_TEMPLATES export to fix import error in SellModal.tsx
export const PRODUCT_TEMPLATES = [
  {
    title: "iPhone 15 Pro Max",
    description: "Tình trạng: Mới 99%, Fullbox. Màu Titan tự nhiên. Bản quốc tế 256GB.",
    price: 1050,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Đồng hồ Rolex Datejust 36",
    description: "Đồng hồ chính hãng, có giấy tờ kiểm định. Mặt số xanh lá cây cực đẹp.",
    price: 8500,
    category: "Collectibles",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Máy pha cà phê Breville 870",
    description: "Máy pha cà phê chuyên nghiệp cho gia đình. Tặng kèm bộ dụng cụ barista.",
    price: 600,
    category: "Home & Office",
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&q=80&w=400"
  }
];

// Added missing KOL_VIDEO_IDEAS export to fix import error in KOLCreatorStudio.tsx
export const KOL_VIDEO_IDEAS = {
  fashion: [
    "Phối đồ 0 đồng từ tủ đồ của mẹ",
    "Review túi hiệu 100 triệu và túi chợ 100k",
    "Săn đồ si đa chuẩn style Paris tại AmazeBid",
    "Cách mặc đẹp dù bụng mỡ (Unfulfilled Style)",
    "Ngày đầu làm KOL thời trang và cái kết"
  ],
  tech: [
    "Thử thách dùng Nokia 1280 trong 24h",
    "Đập hộp PC 200 triệu mua cũ trên mạng",
    "Tại sao tui không dùng iPhone nữa?",
    "Review bàn phím cơ gõ sướng nhất quả đất",
    "Sửa máy tính cho gái và những câu chuyện dở khóc dở cười"
  ],
  home: [
    "Decor phòng trọ 10m2 thành cung điện",
    "Mẹo dọn nhà cho người siêu lười",
    "Review máy hút bụi cầm tay có thực sự đáng mua?",
    "Nấu ăn bằng nồi cơm điện: 7 món trong 1",
    "Trồng cây trong nhà và cái kết tan hoang"
  ]
};

export const MOCK_AVATARS: AvatarConfig[] = [
  {
    id: 'av_1',
    name: 'Mika Cyber',
    role: 'Virtual Fashion KOL',
    gender: 'FEMALE',
    voiceTone: 'Trẻ trung, Năng động',
    image: 'https://images.unsplash.com/photo-1616766098956-c81f12114571?auto=format&fit=crop&q=80&w=600',
    idleVideo: 'https://assets.mixkit.co/videos/preview/mixkit-woman-looking-at-camera-with-neon-lights-2292-large.mp4',
    talkingVideo: 'https://assets.mixkit.co/videos/preview/mixkit-woman-talking-on-a-video-call-42939-large.mp4',
    sketchfabId: '0f5c66b6c0e4428080004f4a3e7906d5' // Cyber Girl Model
  },
  {
    id: 'av_2',
    name: 'Tomo Life',
    role: 'Lifestyle Vlogger',
    gender: 'MALE',
    voiceTone: 'Thân thiện, Gần gũi',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    idleVideo: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
    talkingVideo: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-blogger-talking-to-camera-42890-large.mp4',
    sketchfabId: '360b6b0877964957a7da9326e038622c' // Casual Boy Model
  },
  {
    id: 'av_3',
    name: 'Robo Deal',
    role: 'Tech Reviewer',
    gender: 'ROBOT',
    voiceTone: 'Hài hước, Thông minh',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    idleVideo: 'https://assets.mixkit.co/videos/preview/mixkit-robot-toy-gesturing-4198-large.mp4',
    talkingVideo: 'https://assets.mixkit.co/videos/preview/mixkit-robot-toy-gesturing-4198-large.mp4',
    sketchfabId: 'bc31e34e5a95444198c6087d3dfa50e9' // Mascot Robot
  }
];

export const MOCK_ENVIRONMENTS: AvatarEnvironment[] = [
  { 
      id: 'env_1', 
      name: 'Cyberpunk Studio', 
      type: 'STAGE', 
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
      lightingColor: '#f59e0b'
  },
  { 
      id: 'env_2', 
      name: 'Minimalist Loft', 
      type: 'HOME', 
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
      lightingColor: '#ffffff'
  },
  { 
      id: 'env_3', 
      name: 'Electronic Market', 
      type: 'STREET', 
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
      lightingColor: '#3b82f6'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '0',
    title: 'Custom Neon Keyboard Pro',
    description: 'Bàn phím cơ Custom nhôm nguyên khối, led RGB cực đỉnh cho Streamer.',
    price: 199.00,
    originalPrice: 250.00,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400',
    category: 'Electronics',
    type: ItemType.FIXED_PRICE,
    rating: 5.0,
    reviewCount: 124,
    status: OrderStatus.AVAILABLE,
    sellerId: 'currentUser'
  }
];

export const MOCK_STREAMS: LiveStream[] = [
  {
    id: 'stream_1',
    title: 'Săn Deal Tech Cùng Mika! ⌚️',
    viewerCount: 1420,
    hostName: 'Mika Cyber',
    hostAvatar: 'https://ui-avatars.com/api/?name=Mika&background=random',
    thumbnail: 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?auto=format&fit=crop&q=80&w=800',
    featuredProductIds: ['0'],
    isLive: true
  }
];

export const MOCK_ALL_USERS: User[] = [
  {
    id: 'admin_1',
    fullName: 'Administrator',
    email: 'admin@amazebid.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff',
    joinDate: '2022-12-01T00:00:00Z',
    balance: 99999.00,
    points: 99999,
    tier: 'DIAMOND',
    paymentMethods: [],
    role: 'ADMIN'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [];
