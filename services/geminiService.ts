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

// --- Added Missing Functions ---

export const generateProductVideo = async (prompt: string): Promise<string | null> => {
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
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    if (operation.response?.generatedVideos?.[0]?.video?.uri) {
       // Return URI with API key appended for access
       return `${operation.response.generatedVideos[0].video.uri}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (e) {
    console.error("Video Generation Error:", e);
    return null;
  }
};

export interface ProductAnalysis {
  verdict: 'EXCELLENT_DEAL' | 'GOOD_PRICE' | 'OVERPRICED';
  score: number;
  priceAnalysis: string;
  pros: string[];
  cons: string[];
}

export const analyzeProductDeal = async (product: Product): Promise<ProductAnalysis | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this product deal:
  Title: ${product.title}
  Price: ${product.price}
  Description: ${product.description}
  Category: ${product.category}
  
  Return JSON with fields:
  verdict (enum: EXCELLENT_DEAL, GOOD_PRICE, OVERPRICED),
  score (number 1-10),
  priceAnalysis (string),
  pros (string array),
  cons (string array).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text) as ProductAnalysis;
  } catch (e) {
    console.error("Product Analysis Error:", e);
    return null;
  }
};

export interface NegotiationResult {
  sellerResponse: string;
  status: 'PENDING' | 'ACCEPTED' | 'COUNTER_OFFER' | 'REJECTED';
  finalPrice?: number;
}

export const negotiateWithAI = async (product: Product, userOffer: number, userNote: string, history: {role: string, text: string}[]): Promise<NegotiationResult | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are a seller negotiating the price of "${product.title}". 
  Listed Price: ${product.price}.
  Minimum Acceptable Price: ${product.price * 0.85}.
  
  Behavior:
  - Be polite but professional.
  - If offer is too low (< min price), reject or counter offer.
  - If acceptable (>= min price), accept.
  - User note: "${userNote}".
  
  Output JSON:
  {
    "sellerResponse": "string",
    "status": "PENDING" | "ACCEPTED" | "COUNTER_OFFER" | "REJECTED",
    "finalPrice": number (optional)
  }`;

  const conversation = history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  const prompt = `Conversation history:\n${conversation}\n\nUser just offered: ${userOffer}. Provide response.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        systemInstruction: systemInstruction 
      }
    });
    return JSON.parse(response.text) as NegotiationResult;
  } catch (e) {
    console.error("Negotiation Error:", e);
    return null;
  }
};

export const generateRecruitmentMessage = async (productName: string, price: number, style: 'FUNNY' | 'URGENT' | 'EMOTIONAL'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Write a short, catchy invitation message for a group buy of "${productName}" at price $${price}. Style: ${style}. Max 150 characters.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text.trim();
  } catch (e) {
    return `Mua chung ${productName} giá cực sốc $${price} cùng mình nhé!`;
  }
};
