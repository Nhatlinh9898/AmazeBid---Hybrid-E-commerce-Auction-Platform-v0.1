
// services/api.ts

// Định nghĩa URL Backend (Local hoặc Cloud)
// Khi deploy lên Render, thay đổi dòng này thành URL của Render
// Ví dụ: const BASE_URL = 'https://amazebid-api.onrender.com/api';
const BASE_URL = 'http://localhost:5000/api'; 

interface ApiResponse<T> {
  message?: string;
  [key: string]: any; // Cho phép các trường động khác trả về từ server
}

// Hàm helper để gọi API (Wrapper around fetch)
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Lấy token từ localStorage (Lưu ý: Cần cập nhật AuthContext để lưu token vào key 'auth_token' khi login thành công)
  const token = localStorage.getItem('auth_token'); 
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers as Record<string, string>,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Ném lỗi với message từ Backend trả về (VD: "Email đã tồn tại")
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data as T;
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // --- AUTHENTICATION ---
  auth: {
    // POST /api/auth/login
    login: (email: string, password: string) => 
      fetchClient<any>('/auth/login', { 
        method: 'POST', 
        body: JSON.stringify({ email, password }) 
      }),
      
    // POST /api/auth/register
    register: (fullName: string, email: string, password: string) => 
      fetchClient<any>('/auth/register', { 
        method: 'POST', 
        body: JSON.stringify({ fullName, email, password }) 
      }),
  },

  // --- PRODUCTS ---
  products: {
    // GET /api/products
    getAll: () => fetchClient<any[]>('/products'),
    
    // POST /api/products (Cần Token)
    create: (productData: any) => 
      fetchClient<any>('/products', { 
        method: 'POST', 
        body: JSON.stringify(productData) 
      }),
  },

  // --- AI INTEGRATION (Backend Proxy) ---
  // Gọi qua Backend để bảo mật API Key, không gọi trực tiếp từ Frontend
  // POST /api/ai/generate
  ai: {
    generate: (prompt: string, modelName: string = 'gemini-1.5-flash') => 
      fetchClient<{ result: string }>('/ai/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, modelName })
      }),
  },

  // --- SOCKET.IO (Ghi chú) ---
  // Phần Realtime (Đấu giá/Live) không dùng fetch mà dùng socket.io-client.
  // Code kết nối Socket sẽ nằm ở file riêng (VD: services/socket.ts hoặc context/SocketContext.tsx).
};
