
import { Product, OrderStatus } from '../types';

// --- Cấu hình Email ---
// Trong thực tế, bạn sẽ dùng EmailJS hoặc gọi API Backend
const USE_REAL_EMAIL = false; // Đổi thành true nếu đã cấu hình API

interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
}

export const emailService = {
  /**
   * Gửi email (Giả lập hoặc Thực tế)
   */
  send: async (payload: EmailPayload): Promise<boolean> => {
    console.log(`[EmailService] Preparing to send to ${payload.to}...`);
    
    if (USE_REAL_EMAIL) {
      // CODE TÍCH HỢP EMAILJS HOẶC BACKEND API
      // const response = await fetch('YOUR_BACKEND_API/send-email', {
      //   method: 'POST',
      //   body: JSON.stringify(payload)
      // });
      // return response.ok;
      return true;
    } else {
      // GIẢ LẬP: Delay 1.5s để tạo cảm giác đang xử lý
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`%c[Email Sent] Subject: ${payload.subject}`, "color: #10b981; font-weight: bold;");
          console.log(payload.htmlBody); // In nội dung ra console để debug
          resolve(true);
        }, 1500);
      });
    }
  },

  /**
   * Template: Chia sẻ sản phẩm cho bạn bè/bản thân
   */
  sendProductShare: async (email: string, product: Product, message?: string) => {
    const subject = `🔥 Có người muốn bạn xem sản phẩm này: ${product.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #131921; padding: 20px; text-align: center;">
          <h2 style="color: #febd69; margin: 0;">AmazeBid</h2>
        </div>
        <div style="padding: 20px;">
          <p>Xin chào,</p>
          <p>Một người bạn đã chia sẻ sản phẩm này với bạn${message ? `: "<i>${message}</i>"` : "."}</p>
          
          <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <img src="${product.image}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 4px;" />
            <h3 style="margin-top: 15px; color: #111;">${product.title}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #b12704; margin: 5px 0;">$${product.price}</p>
            <p style="color: #555; font-size: 14px;">${product.description}</p>
          </div>

          <a href="${window.location.origin}" style="display: block; width: 100%; background-color: #febd69; color: #111; text-align: center; padding: 12px 0; text-decoration: none; font-weight: bold; border-radius: 4px;">Xem chi tiết ngay</a>
        </div>
      </div>
    `;
    return emailService.send({ to: email, subject, htmlBody });
  },

  /**
   * Template: Xác nhận đơn hàng
   */
  sendOrderConfirmation: async (email: string, product: Product) => {
    const subject = `✅ Xác nhận đơn hàng: ${product.title}`;
    const htmlBody = `
      <div style="font-family: sans-serif;">
        <h1>Cảm ơn bạn đã mua hàng tại AmazeBid!</h1>
        <p>Đơn hàng của bạn đang được xử lý.</p>
        <hr/>
        <h3>Thông tin đơn hàng:</h3>
        <ul>
          <li>Sản phẩm: <strong>${product.title}</strong></li>
          <li>Giá: <strong>$${product.price}</strong></li>
          <li>Trạng thái: <strong>Đang xử lý</strong></li>
        </ul>
      </div>
    `;
    return emailService.send({ to: email, subject, htmlBody });
  },

  /**
   * Template: Thông báo trạng thái đơn hàng (Shipping)
   */
  sendOrderStatusUpdate: async (email: string, product: Product, status: OrderStatus) => {
    let statusText = '';
    let color = '#333';
    
    switch(status) {
        case 'SHIPPED': statusText = 'Đang giao hàng 🚚'; color = '#2563eb'; break;
        case 'DELIVERED': statusText = 'Giao thành công 📦'; color = '#7c3aed'; break;
        case 'COMPLETED': statusText = 'Hoàn tất giao dịch ✅'; color = '#10b981'; break;
        case 'RETURNED': statusText = 'Đang trả hàng ↩️'; color = '#dc2626'; break;
    }

    const subject = `🔔 Cập nhật đơn hàng: ${statusText}`;
    const htmlBody = `
      <h3>Đơn hàng ${product.title} của bạn vừa được cập nhật trạng thái:</h3>
      <h2 style="color: ${color};">${statusText}</h2>
      <p>Vui lòng kiểm tra ứng dụng để biết thêm chi tiết.</p>
    `;
    return emailService.send({ to: email, subject, htmlBody });
  }
};
