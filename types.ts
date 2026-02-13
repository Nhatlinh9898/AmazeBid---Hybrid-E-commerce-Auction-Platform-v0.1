
export enum ItemType {
  FIXED_PRICE = 'FIXED_PRICE',
  AUCTION = 'AUCTION'
}

export enum OrderStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING_SHIPMENT = 'PENDING_SHIPMENT',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED'
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  images?: string[];
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  providerName: string;
  accountNumber: string;
  holderName: string;
  isDefault: boolean;
}

export interface SocialAccount {
  provider: 'google' | 'facebook' | 'github' | 'instagram';
  connected: boolean;
  username?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar: string;
  address?: string;
  joinDate: string;
  balance: number;
  points: number; // Điểm thưởng
  tier: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'; // Hạng thành viên
  paymentMethods: PaymentMethod[];
  socialAccounts?: SocialAccount[];
  referralCode?: string;
  role?: 'USER' | 'ADMIN';
  friendCount?: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  type: 'VOUCHER' | 'GIFT' | 'DIGITAL';
  code?: string;
}

export interface KOLProfile {
  name: string;
  industry: 'Fashion' | 'Tech' | 'Home';
  strengths: string;
  unfulfilledPoint: string;
  usp: string;
  contentFormats: string[];
  voiceStyle: string;
  growthJourney: string;
  sampleVideos: {
    title: string;
    hook: string;
    content: string;
    viralReason: string;
  }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: ItemType;
  status: OrderStatus;
  sellerId: string;
  isAffiliate?: boolean;
  affiliateLink?: string;
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  originalPrice?: number;
  currentBid?: number;
  bidCount?: number;
  bidHistory?: Bid[];
  endTime?: string;
  payoutMethod?: string;
  stepPrice?: number;
  platformName?: string;
  commissionRate?: number;
  condition?: 'NEW' | 'LIKE_NEW' | 'USED'; 
  
  // New Field for Buyer Info
  buyerInfo?: ShippingInfo;
  buyerId?: string;
}

export interface LiveStream {
  id: string;
  title: string;
  viewerCount: number;
  hostName: string;
  hostAvatar: string;
  thumbnail: string;
  featuredProductIds: string[];
  isLive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ContentPost {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  generatedImages: string[];
  generatedVideo?: string;
  status: 'DRAFT' | 'PUBLISHED';
  platform: 'BLOG' | 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';
  createdAt: string;
  comments?: Comment[];
  likes?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  type: string;
  timestamp: string;
  status: string;
}

export interface AvatarConfig {
  id: string;
  name: string;
  role: string;
  gender: string;
  voiceTone: string;
  image: string;
  idleVideo: string;
  talkingVideo: string;
  sketchfabId?: string;
}

export interface AvatarOutfit {
  id: string;
  name: string;
  style: string;
  image: string;
}

export interface AvatarEnvironment {
  id: string;
  name: string;
  type: string;
  image: string;
  lightingColor: string;
}

export interface AvatarCustomization {
  heightScale: number;
  skinToneHash: string;
  hairStyle: string;
  language: string;
  voiceSpeed: number;
  voicePitch: number;
}

export interface AppNotification {
  id: string;
  type: 'ORDER' | 'BID' | 'PROMO' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
}

export interface ChatConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }[];
}
