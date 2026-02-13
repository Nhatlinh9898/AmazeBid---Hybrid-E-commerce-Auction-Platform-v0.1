
import { GoogleGenAI, Type } from "@google/genai";
import { Product, KOLProfile } from "../types";

export const generateUnfulfilledKOL = async (industry: string, productContext?: string): Promise<KOLProfile | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Bạn là hệ thống tạo KOL thương mại điện tử chuyên nghiệp.
    Hãy tạo ra một KOL "unfulfilled" (chưa hoàn thiện) cho ngành: ${industry}.
    ${productContext ? `Sản phẩm mục tiêu: ${productContext}` : ''}

    YÊU CẦU CẤU TRÚC JSON TRẢ VỀ:
    {
      "name": "Tên ngắn gọn, hiện đại",
      "industry": "${industry}",
      "strengths": "Điểm mạnh liên quan sản phẩm",
      "unfulfilledPoint": "Điểm yếu thú vị tạo nội dung hài/chân thật",
      "usp": "Đặc điểm độc đáo lặp lại thành series",
      "contentFormats": ["Format 1", "Format 2", "Format 3", "Format 4", "Format 5"],
      "voiceStyle": "Mô tả giọng nói và vibe",
      "growthJourney": "Cách nhân vật cải thiện qua từng video",
      "sampleVideos": [
        { "title": "Tiêu đề 1", "hook": "Hook 3s đầu", "content": "Nội dung chính", "viralReason": "Tại sao dễ viral" }
      ]
    }
    Lưu ý: Không tạo nhân vật hoàn hảo. Hãy làm cho họ trở nên đáng yêu vì những sai lầm.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text) as KOLProfile;
  } catch (error) {
    console.error("KOL Generation Error:", error);
    return null;
  }
};

export const getShoppingAdvice = async (query: string, products: Product[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const productContext = products.map(p => `- ${p.title} (${p.price} USD)`).join('\n');
  const systemInstruction = `Bạn là chuyên gia AmazeBid. Danh sách sản phẩm:\n${productContext}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { systemInstruction },
    });
    return response.text || "Lỗi xử lý.";
  } catch (error) { return "Lỗi kết nối AI."; }
};

export const generateKeywordSuggestions = async (productName: string, description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Liệt kê 20 từ khóa SEO cho: ${productName}. Trả về JSON array.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text) as string[];
  } catch (e) { return []; }
};

export const generateSEOContent = async (productName: string, keywords: string, tone: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Viết bài blog SEO cho ${productName}. Keywords: ${keywords}. Tone: ${tone}. Markdown format.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{googleSearch: {}}] }
    });
    return response.text;
  } catch (e) { return "Lỗi."; }
};

export const generateProductImage = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) { return null; }
};

export const generateProductVideo = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<{ query: string, category: string } | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const base64Data = base64Image.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Identify the main product in this image. Return a JSON object with 'productName' (generic name in Vietnamese, e.g. 'Đồng hồ', 'iPhone') and 'category' (one of: 'Electronics', 'Fashion', 'Home & Office', 'Collectibles')." }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Visual Search Error:", e);
    return { query: "Sản phẩm", category: "Electronics" };
  }
};

export interface ProductAnalysis {
    score: number;
    verdict: "EXCELLENT_DEAL" | "GOOD_PRICE" | "FAIR" | "OVERPRICED";
    pros: string[];
    cons: string[];
    priceAnalysis: string;
}

export const analyzeProductDeal = async (product: Product): Promise<ProductAnalysis | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Phân tích xem sản phẩm này có đáng mua không dựa trên giá và tên gọi:
    Sản phẩm: ${product.title}
    Giá hiện tại: $${product.price}
    ${product.originalPrice ? `Giá gốc: $${product.originalPrice}` : ''}
    Mô tả: ${product.description}

    Hãy đóng vai một chuyên gia thẩm định giá.
    Trả về JSON với cấu trúc:
    {
        "score": number (1-10),
        "verdict": "EXCELLENT_DEAL" | "GOOD_PRICE" | "FAIR" | "OVERPRICED",
        "pros": ["Điểm mạnh 1", "Điểm mạnh 2"],
        "cons": ["Điểm yếu 1", "Điểm yếu 2"],
        "priceAnalysis": "Nhận xét ngắn gọn về giá (tiếng Việt)"
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text) as ProductAnalysis;
    } catch (e) {
        console.error("Deal Analysis Error:", e);
        return null;
    }
};

export interface ComparisonResult {
    winnerId: string;
    reason: string;
    differences: { feature: string; item1Value: string; item2Value: string; advantage: 'item1' | 'item2' | 'draw' }[];
    advice: string;
}

export const compareProducts = async (p1: Product, p2: Product): Promise<ComparisonResult | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `So sánh 2 sản phẩm sau để giúp người mua chọn lựa:
    
    Sản phẩm 1 (ID: ${p1.id}): ${p1.title} - Giá: $${p1.price} - Mô tả: ${p1.description}
    Sản phẩm 2 (ID: ${p2.id}): ${p2.title} - Giá: $${p2.price} - Mô tả: ${p2.description}

    Hãy đóng vai một chuyên gia tư vấn mua sắm. Trả về JSON:
    {
        "winnerId": "ID sản phẩm chiến thắng (hoặc 'draw')",
        "reason": "Lý do ngắn gọn tại sao thắng",
        "differences": [
            { "feature": "Tiêu chí (Giá/Hiệu năng/Thương hiệu...)", "item1Value": "Giá trị SP1", "item2Value": "Giá trị SP2", "advantage": "item1" hoặc "item2" hoặc "draw" }
        ],
        "advice": "Lời khuyên nên mua bên nào trong trường hợp nào (Ngắn gọn)"
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text) as ComparisonResult;
    } catch (e) {
        console.error("Comparison Error:", e);
        return null;
    }
};

export interface NegotiationResult {
    status: 'ACCEPTED' | 'REJECTED' | 'COUNTER_OFFER';
    sellerResponse: string; 
    finalPrice?: number;
}

export const negotiateWithAI = async (
    product: Product, 
    userOffer: number, 
    userMessage: string, 
    chatHistory: {role: string, text: string}[]
): Promise<NegotiationResult | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const floorPrice = product.price * 0.85;
    const historyText = chatHistory.map(m => `${m.role}: ${m.text}`).join('\n');

    const prompt = `Bạn là chủ cửa hàng AmazeBid (AI Shopkeeper). Bạn đang bán sản phẩm "${product.title}" với giá niêm yết $${product.price}.
    Giá sàn thấp nhất bạn có thể bán là $${floorPrice} (TUYỆT ĐỐI KHÔNG TIẾT LỘ GIÁ SÀN CHO KHÁCH).
    
    Khách hàng vừa trả giá: $${userOffer}.
    Lời nhắn của khách: "${userMessage}".

    Lịch sử chat:
    ${historyText}

    Nhiệm vụ của bạn:
    1. Nếu giá khách trả >= Giá sàn: Chấp nhận (ACCEPTED).
    2. Nếu giá khách trả < Giá sàn nhưng gần (khoảng 80-84%): Đưa ra giá Counter Offer (COUNTER_OFFER) cao hơn giá sàn một chút.
    3. Nếu giá quá thấp: Từ chối khéo léo hoặc Counter Offer về mức giá niêm yết giảm nhẹ.
    
    Hãy trả lời ngắn gọn, hài hước, đôi khi "chảnh" một chút hoặc than nghèo kể khổ để giữ giá.

    Trả về JSON:
    {
        "status": "ACCEPTED" | "REJECTED" | "COUNTER_OFFER",
        "sellerResponse": "Câu trả lời của bạn (Tiếng Việt)",
        "finalPrice": con số (nếu accept thì là giá khách, nếu counter thì là giá bạn muốn, nếu reject thì null)
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text) as NegotiationResult;
    } catch (e) {
        console.error("Negotiation Error:", e);
        return null;
    }
};

/** New Function: AI Viral Copywriter for Group Buying */
export const generateRecruitmentMessage = async (productName: string, teamPrice: number, style: 'FUNNY' | 'URGENT' | 'EMOTIONAL'): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Viết một tin nhắn ngắn (dưới 30 từ) để rủ bạn bè mua chung sản phẩm "${productName}" với giá siêu rẻ $${teamPrice} trên AmazeBid.
    Phong cách: ${style} (Hài hước / Gấp gáp / Tình cảm).
    Có dùng Emoji.
    Mục tiêu: Khiến người nhận bấm vào link ngay lập tức.
    Chỉ trả về nội dung tin nhắn.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || `Mua chung ${productName} giá ${teamPrice} với mình đi! 🔥`;
    } catch (e) {
        return `Mua chung ${productName} giá ${teamPrice} với mình đi! 🔥`;
    }
};
