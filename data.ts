
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
