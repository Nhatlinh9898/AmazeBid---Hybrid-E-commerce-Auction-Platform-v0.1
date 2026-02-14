export interface SeasonalBanner {
  id: string;
  name: string;
  imageUrl: string;
  startDate: string; // MM-DD format
  endDate: string;   // MM-DD format
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const seasonalBanners: SeasonalBanner[] = [
  // Tết Nguyên Đán
  {
    id: 'tet',
    name: 'Tết Nguyên Đán',
    imageUrl: 'https://i.ibb.co/QfC54z0/tet-banner-background.jpg',
    startDate: '01-20',
    endDate: '02-20',
    title: 'MUA SẮM TẾT RỘN RÀNG',
    subtitle: 'ĐẤU GIÁ LỘC PHÁT TÀI',
    buttonText: 'Đăng bán Tết'
  },
  
  // Valentine
  {
    id: 'valentine',
    name: 'Valentine',
    imageUrl: 'https://images.unsplash.com/photo-1516601255658-80a353a9b3c6?auto=format&fit=crop&q=80&w=1500',
    startDate: '02-01',
    endDate: '02-14',
    title: 'MUA SẮM VALENTINE',
    subtitle: 'TÌNH YÊU ĐỈNH CAO',
    buttonText: 'Tặng quà Valentine'
  },

  // 8/3 Phụ nữ Việt Nam
  {
    id: 'women-day',
    name: 'Phụ nữ Việt Nam',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1500',
    startDate: '03-01',
    endDate: '03-08',
    title: 'MUA SẮM 8/3',
    subtitle: 'YÊU THƯƠNG ĐỈNH CAO',
    buttonText: 'Quà tặng 8/3'
  },

  // Giáng sinh
  {
    id: 'christmas',
    name: 'Giáng sinh',
    imageUrl: 'https://images.unsplash.com/photo-1519124327496-2da575fb8fb5?auto=format&fit=crop&q=80&w=1500',
    startDate: '12-15',
    endDate: '12-31',
    title: 'MUA SẮM GIÁNG SINH',
    subtitle: 'ĐẤU GIÁ MỪNG NOEL',
    buttonText: 'Quà tặng Giáng sinh'
  },

  // Black Friday
  {
    id: 'black-friday',
    name: 'Black Friday',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500',
    startDate: '11-20',
    endDate: '11-30',
    title: 'MUA SẮM BLACK FRIDAY',
    subtitle: 'ĐẤU GIÁ SIÊU HỜI',
    buttonText: 'Săn sale Black Friday'
  },

  // Mùa hè
  {
    id: 'summer',
    name: 'Mùa hè',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1500',
    startDate: '06-01',
    endDate: '08-31',
    title: 'MUA SẮM MÙA HÈ',
    subtitle: 'ĐẤU GIÁ NĂNG ĐỘNG',
    buttonText: 'Mua sắm mùa hè'
  },

  // Mùa thu
  {
    id: 'autumn',
    name: 'Mùa thu',
    imageUrl: 'https://i.ibb.co/L840JcQ/autumn-background.jpg',
    startDate: '09-01',
    endDate: '11-30',
    title: 'MUA SẮM MÙA THU',
    subtitle: 'ĐẤU GIÁ LÁ VÀNG',
    buttonText: 'Khám phá ngay'
  },

  // Mùa xuân
  {
    id: 'spring',
    name: 'Mùa xuân',
    imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=1500',
    startDate: '03-01',
    endDate: '05-31',
    title: 'MUA SẮM MÙA XUÂN',
    subtitle: 'ĐẤU GIÁ MÃI KHỞI',
    buttonText: 'Mua sắm mùa xuân'
  }
];

// Default banner for when no seasonal banner is active
export const defaultBanner: SeasonalBanner = {
  id: 'default',
  name: 'Mặc định',
  imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1500',
  startDate: '01-01',
  endDate: '12-31',
  title: 'MUA SẮM THÔNG MINH',
  subtitle: 'ĐẤU GIÁ ĐỊNH CAO',
  buttonText: 'Đăng bán ngay'
};

export function getCurrentSeasonalBanner(): SeasonalBanner {
  const today = new Date();
  const currentDate = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Find matching seasonal banner
  const matchingBanner = seasonalBanners.find(banner => {
    // Handle year wrap-around (e.g., Tet spans across years)
    if (banner.startDate > banner.endDate) {
      return currentDate >= banner.startDate || currentDate <= banner.endDate;
    }
    return currentDate >= banner.startDate && currentDate <= banner.endDate;
  });

  return matchingBanner || defaultBanner;
}
