import { SeasonalBanner } from './seasonalBanners';

export interface AIBannerConfig {
  theme: 'tet' | 'autumn' | 'spring' | 'summer' | 'winter' | 'valentine' | 'christmas' | 'black-friday';
  style: 'traditional' | 'modern' | 'minimalist' | 'vibrant';
  elements?: string[];
  colors?: string[];
}

export class AIBannerGenerator {
  private static readonly THEME_CONFIGS = {
    tet: {
      elements: ['hoa mai', 'đèn lồng', 'bánh chưng', 'mứt', 'quýt', 'cây đào', 'lì xì', 'pháo hoa'],
      colors: ['đỏ', 'vàng', 'gold', 'đậm'],
      style: 'traditional'
    },
    autumn: {
      elements: ['lá vàng', 'lá đỏ', 'cây phong', 'bí ngô', 'hoa cúc', 'thác nước', 'cầu gỗ'],
      colors: ['vàng', 'cam', 'nâu', 'đỏ', 'cam cháy'],
      style: 'warm'
    },
    spring: {
      elements: ['hoa anh đào', 'hoa đào', 'cây xanh', 'bướm', 'chim', 'ánh nắng', 'sương sớm'],
      colors: ['hồng', 'trắng', 'xanh lá', 'vàng nhạt'],
      style: 'fresh'
    },
    summer: {
      elements: ['biển', 'cát', 'nắng', 'cọp dừa', 'kem', 'đảo', 'mặt trời'],
      colors: ['xanh dương', 'xanh lá', 'vàng', 'trắng'],
      style: 'vibrant'
    },
    winter: {
      elements: ['tuyết', 'đông cây', 'lửa trại', 'cà vạt', 'hồ băng', 'ngôi nhà'],
      colors: ['trắng', 'xanh nhạt', 'xám', 'nâu'],
      style: 'cozy'
    },
    valentine: {
      elements: ['hoa hồng', 'trái tim', 'sô cô la', 'nến', 'quà tặng', 'cặp đôi'],
      colors: ['đỏ', 'hồng', 'trắng', 'đậm'],
      style: 'romantic'
    },
    christmas: {
      elements: ['cây thông', 'quà', 'đông tuyết', 'đèn', 'ngôi sao', 'cổng'],
      colors: ['đỏ', 'xanh lá', 'vàng', 'trắng', 'bạc'],
      style: 'festive'
    },
    'black-friday': {
      elements: ['giảm giá', 'mua sắm', 'hàng đợi', 'crowd', 'bags', 'shopping'],
      colors: ['đen', 'vàng', 'đỏ', 'trắng'],
      style: 'bold'
    }
  };

  // Auto-generate banner on season change
  static async autoGenerateBannerForCurrentSeason(): Promise<{ imageUrl: string; title: string; subtitle: string } | null> {
    const currentMonth = new Date().getMonth() + 1;
    let currentTheme: AIBannerConfig['theme'];
    
    // Determine current theme
    if (currentMonth === 2) currentTheme = 'valentine'; // Valentine has priority for Feb 2nd
    else if (currentMonth >= 1 && currentMonth <= 2) currentTheme = 'tet'; // Tet for Jan 20 - Feb 20
    else if (currentMonth >= 3 && currentMonth <= 5) currentTheme = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) currentTheme = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) currentTheme = 'autumn';
    else if (currentMonth === 12) currentTheme = 'christmas';
    else currentTheme = 'spring';

    try {
      // Generate banner with AI
      const config: AIBannerConfig = {
        theme: currentTheme,
        style: 'modern', // Auto-use modern style for seasonal changes
        elements: this.THEME_CONFIGS[currentTheme].elements.slice(0, 5),
        colors: this.THEME_CONFIGS[currentTheme].colors.slice(0, 3)
      };

      const imageUrl = await this.generateBannerWithAI(config);
      const title = this.generateTitle(currentTheme, 'modern');
      const subtitle = this.generateSubtitle(currentTheme, 'modern');

      return { imageUrl, title, subtitle };
    } catch (error) {
      console.error('Auto banner generation failed:', error);
      return null;
    }
  }

  // Check if season has changed and auto-generate
  static checkAndGenerateBanner(): Promise<{ imageUrl: string; title: string; subtitle: string } | null> {
    const lastGenerated = localStorage.getItem('amaze_last_banner_theme');
    const currentMonth = new Date().getMonth() + 1;
    let currentTheme: AIBannerConfig['theme'];
    
    if (currentMonth >= 1 && currentMonth <= 2) currentTheme = 'tet';
    else if (currentMonth === 2) currentTheme = 'valentine';
    else if (currentMonth >= 3 && currentMonth <= 5) currentTheme = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) currentTheme = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) currentTheme = 'autumn';
    else if (currentMonth === 12) currentTheme = 'christmas';
    else currentTheme = 'spring';

    // If season changed, generate new banner
    if (lastGenerated !== currentTheme) {
      console.log(`Season changed to ${currentTheme}, generating new banner...`);
      return this.autoGenerateBannerForCurrentSeason();
    }

    return null;
  }

  // Save generated theme to localStorage
  static saveGeneratedTheme(theme: AIBannerConfig['theme']): void {
    localStorage.setItem('amaze_last_banner_theme', theme);
  }

  static generatePrompt(config: AIBannerConfig): string {
    const themeConfig = this.THEME_CONFIGS[config.theme];
    const elements = config.elements || themeConfig.elements;
    const colors = config.colors || themeConfig.colors;
    
    const basePrompt = `Create a beautiful e-commerce banner for ${config.theme} theme with ${config.style} style.`;
    
    const elementsPrompt = `Include these elements: ${elements.slice(0, 5).join(', ')}.`;
    const colorsPrompt = `Use these colors: ${colors.join(', ')}.`;
    const compositionPrompt = 'Professional photography style, high resolution, commercial quality, suitable for website header banner.';
    const lightingPrompt = 'Soft, warm lighting, inviting atmosphere.';
    const compositionGuide = 'Center-focused composition with negative space for text overlay.';
    
    return `${basePrompt} ${elementsPrompt} ${colorsPrompt} ${compositionPrompt} ${lightingPrompt} ${compositionGuide}`;
  }

  static generateMultipleBanners(): Partial<SeasonalBanner>[] {
    const banners: Partial<SeasonalBanner>[] = [];
    
    // Generate for current season
    const currentMonth = new Date().getMonth() + 1;
    let currentTheme: AIBannerConfig['theme'];
    
    if (currentMonth >= 1 && currentMonth <= 2) currentTheme = 'tet';
    else if (currentMonth === 2) currentTheme = 'valentine';
    else if (currentMonth >= 3 && currentMonth <= 5) currentTheme = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) currentTheme = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) currentTheme = 'autumn';
    else if (currentMonth === 12) currentTheme = 'christmas';
    else currentTheme = 'spring';

    // Generate variations for current theme
    const styles: AIBannerConfig['style'][] = ['traditional', 'modern', 'minimalist', 'vibrant'];
    
    styles.forEach((style, index) => {
      banners.push({
        id: `${currentTheme}_${style}_${index}`,
        name: `${currentTheme} - ${style} style`,
        imageUrl: this.generateImageURL({
          theme: currentTheme,
          style: style,
          elements: this.THEME_CONFIGS[currentTheme].elements.slice(0, 3),
          colors: this.THEME_CONFIGS[currentTheme].colors.slice(0, 2)
        }),
        title: this.generateTitle(currentTheme, style),
        subtitle: this.generateSubtitle(currentTheme, style)
      });
    });

    return banners;
  }

  private static generateImageURL(config: AIBannerConfig): string {
    const prompt = this.generatePrompt(config);
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Using a placeholder AI image generation service with specific dimensions
    // In production, this would connect to DALL-E, Midjourney, or Stable Diffusion
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=600&seed=${Math.random()}`;
  }

  private static generateTitle(theme: AIBannerConfig['theme'], style: AIBannerConfig['style']): string {
    const titles = {
      tet: {
        traditional: 'MUA SẮM TẾT TRUYỀN THỐNG',
        modern: 'TẾT HIỆN ĐẠI - ƯU ĐÃI ĐỈNH',
        minimalist: 'TẾT TINH TẾ',
        vibrant: 'TẾT RỘN RÀNG - SALE SỐC'
      },
      autumn: {
        traditional: 'MUA SẮM MÙA THU',
        modern: 'AUTUMN COLLECTION',
        minimalist: 'MÙA THU TINH TẾ',
        vibrant: 'FALL SALE UP TO 50%'
      },
      spring: {
        traditional: 'MUA SẮM MÙA XUÂN',
        modern: 'SPRING COLLECTION 2024',
        minimalist: 'XUÂN TƯƠI MỚI',
        vibrant: 'SPRING FEVER - HOT DEALS'
      },
      summer: {
        traditional: 'MUA SẮM MÙA HÈ',
        modern: 'SUMMER ESSENTIALS',
        minimalist: 'HÈ THOẢI MÁI',
        vibrant: 'SUMMER MEGA SALE'
      },
      winter: {
        traditional: 'MUA SẮM MÙA ĐÔNG',
        modern: 'WINTER COLLECTION',
        minimalist: 'ĐÔNG ẤM ÁP',
        vibrant: 'WINTER WONDERLAND'
      },
      valentine: {
        traditional: 'VALENTINE SPECIAL',
        modern: 'LOVE SEASON',
        minimalist: 'YÊU THƯƠNG',
        vibrant: 'VALENTINE MEGA SALE'
      },
      christmas: {
        traditional: 'GIÁNG SINH AN LÀNH',
        modern: 'CHRISTMAS 2024',
        minimalist: 'NOEL ẤM ÁP',
        vibrant: 'XMAS MEGA DEALS'
      },
      'black-friday': {
        traditional: 'BLACK FRIDAY',
        modern: 'MEGA SALE EVENT',
        minimalist: 'DEAL KHỦNG',
        vibrant: 'CRAZY FRIDAY SALE'
      }
    };

    return titles[theme]?.[style] || 'MUA SẮM THÔNG MINH';
  }

  private static generateSubtitle(theme: AIBannerConfig['theme'], style: AIBannerConfig['style']): string {
    const subtitles = {
      tet: {
        traditional: 'ĐẤU GIÁ LỘC PHÁT TÀI',
        modern: 'DEALS ĐỈNH CAO',
        minimalist: 'SANG TRỌNG - TIẾT KIỆM',
        vibrant: 'ƯU ĐÃI CỰC SỐC'
      },
      autumn: {
        traditional: 'ĐẤU GIÁ LÁ VÀNG',
        modern: 'BEST AUTUMN DEALS',
        minimalist: 'LỰA CHỌN TINH TẾ',
        vibrant: 'HOT FALL DEALS'
      },
      spring: {
        traditional: 'ĐẤU GIÁ MÃI KHỞI',
        modern: 'FRESH SPRING OFFERS',
        minimalist: 'MỚI CO - NHANH',
        vibrant: 'SPRING BLOWOUT'
      },
      summer: {
        traditional: 'ĐẤU GIÁ NĂNG ĐỘNG',
        modern: 'SUMMER EXCLUSIVE',
        minimalist: 'MÁT MÁT - TIẾT KIỆM',
        vibrant: 'SUMMER SPECTACULAR'
      },
      winter: {
        traditional: 'ĐẤU GIÁ ẤM ÁP',
        modern: 'WINTER EXCLUSIVE',
        minimalist: 'NHIỆT ĐỘ - ẤM TÌNH',
        vibrant: 'WINTER MEGA SALE'
      },
      valentine: {
        traditional: 'YÊU THƯƠNG ĐỈNH CAO',
        modern: 'LOVE & SAVINGS',
        minimalist: 'TÌNH YÊU - GIÁ TỐT',
        vibrant: 'LOVE EXPLOSION'
      },
      christmas: {
        traditional: 'ĐẤU GIÁ MỪNG NOEL',
        modern: 'HOLIDAY SPECIAL',
        minimalist: 'NOEL AN LÀNH',
        vibrant: 'XMAS EXTRAVAGANZA'
      },
      'black-friday': {
        traditional: 'GIẢM GIÁ SỐC',
        modern: 'MEGA DISCOUNTS',
        minimalist: 'DEAL TỐT NHẤT',
        vibrant: 'INSANE SAVINGS'
      }
    };

    return subtitles[theme]?.[style] || 'ĐẤU GIÁ ĐỊNH CAO';
  }

  static async generateBannerWithAI(config: AIBannerConfig): Promise<string> {
    // This would integrate with AI image generation API
    const prompt = this.generatePrompt(config);
    
    try {
      // Example with OpenAI DALL-E (requires API key)
      /*
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "1920x600", // Standard banner size
          quality: "hd",
          model: "dall-e-3"
        })
      });
      
      const data = await response.json();
      return data.data[0].url;
      */
      
      // Fallback to placeholder service with correct dimensions
      return this.generateImageURL(config);
    } catch (error) {
      console.error('AI Banner generation failed:', error);
      return this.generateImageURL(config);
    }
  }
}

// Command interface for generating banners
export const generateBannerCommand = async (theme?: AIBannerConfig['theme'], style?: AIBannerConfig['style']) => {
  const config: AIBannerConfig = {
    theme: theme || 'autumn',
    style: style || 'modern'
  };
  
  const imageUrl = await AIBannerGenerator.generateBannerWithAI(config);
  const title = AIBannerGenerator['generateTitle'](config.theme, config.style);
  const subtitle = AIBannerGenerator['generateSubtitle'](config.theme, config.style);
  
  return {
    imageUrl,
    title,
    subtitle,
    buttonText: 'Khám phá ngay'
  };
};

// Export for use in components
export default AIBannerGenerator;
