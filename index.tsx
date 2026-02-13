
// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("AmazeBid: Khởi tạo thành công.");
  } catch (error) {
    console.error("Lỗi khởi động AmazeBid:", error);
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #ef4444; background: white; font-family: sans-serif; min-height: 100vh;">
        <h2 style="font-weight: bold; margin-bottom: 10px;">Lỗi Khởi Động Hệ Thống</h2>
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">Trình duyệt không thể tải một số thành phần quan trọng.</p>
        <pre style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 12px; overflow-x: auto; text-align: left; max-width: 500px; margin: 0 auto;">${error.stack || error.message}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #131921; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Tải lại trang</button>
      </div>
    `;
  }
}
