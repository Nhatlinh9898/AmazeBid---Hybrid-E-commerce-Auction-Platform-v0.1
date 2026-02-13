
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

/** Added generateProductVideo function using Veo model */
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
        // Appending the API key is required when fetching from the Veo download link.
        return `${downloadLink}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
};
