
import React, { useState, useEffect } from 'react';
import { X, Book, CreditCard, Package, Truck, RefreshCw, FileText, Scale, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

const TOPICS = [
  { id: 'GUIDE', title: 'Hướng dẫn sử dụng', icon: Book },
  { id: 'PAYMENT', title: 'Quy tắc thanh toán', icon: CreditCard },
  { id: 'PACKAGING', title: 'Quy cách đóng gói', icon: Package },
  { id: 'SHIPPING', title: 'Gửi & Nhận hàng', icon: Truck },
  { id: 'RETURN', title: 'Trả hàng & Hoàn tiền', icon: RefreshCw },
  { id: 'TAX', title: 'Khai báo thuế tự chủ', icon: Scale },
  { id: 'LEGAL', title: 'Luật TMĐT Việt Nam', icon: ShieldCheck },
  { id: 'CONTRACT', title: 'Hợp đồng mua bán', icon: FileText },
  { id: 'AGREEMENT', title: 'Điều khoản sử dụng', icon: FileText },
];

const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ isOpen, onClose, isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState('GUIDE');
  const [hasAgreed, setHasAgreed] = useState(false);

  // Load agreement state from local storage
  useEffect(() => {
    const agreed = localStorage.getItem('amaze_agreement_accepted');
    if (agreed === 'true') {
      setHasAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('amaze_agreement_accepted', 'true');
    setHasAgreed(true);
    alert("Cảm ơn! Bạn đã xác nhận đồng ý với các điều khoản của AmazeBid.");
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'GUIDE':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Book className="text-[#febd69]"/> Hướng dẫn sử dụng AmazeBid</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-2">1. Mua hàng (Fixed Price)</h3>
              <p className="text-sm text-gray-600">Chọn sản phẩm có nhãn "Mua ngay". Nhấn "Thêm vào giỏ" và tiến hành thanh toán. Tiền của bạn sẽ được giữ an toàn bởi hệ thống cho đến khi bạn nhận được hàng.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-2">2. Đấu giá (Auction)</h3>
              <p className="text-sm text-gray-600">Sản phẩm đấu giá có đồng hồ đếm ngược. Bạn cần đặt giá cao hơn giá hiện tại ít nhất một bước giá. Nếu thắng, bạn có 24h để thanh toán.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-2">3. Livestream & Affiliate</h3>
              <p className="text-sm text-gray-600">Tham gia Live Studio để bán hàng trực tiếp. Bạn cũng có thể lấy hàng từ Kho Affiliate để bán và hưởng hoa hồng mà không cần nhập hàng.</p>
            </div>
          </div>
        );

      case 'PAYMENT':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-[#febd69]"/> Quy tắc thanh toán</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="font-bold text-blue-800">Cơ chế AmazeBid SafePay™</p>
              <p className="text-sm text-blue-700 mt-1">Mọi giao dịch đều qua trung gian. Người bán KHÔNG nhận được tiền ngay lập tức. Tiền chỉ được giải ngân sau khi người mua xác nhận "Đã nhận hàng & Hài lòng".</p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                <li>Hỗ trợ thẻ Visa/Mastercard/JCB nội địa và quốc tế.</li>
                <li>Hỗ trợ chuyển khoản ngân hàng (xác thực tự động).</li>
                <li>Hỗ trợ Ví điện tử (Momo, ZaloPay) và Crypto (USDT).</li>
                <li><strong>Người mua:</strong> Không mất phí giao dịch.</li>
                <li><strong>Người bán:</strong> Phí sàn 5% trên mỗi đơn hàng thành công.</li>
            </ul>
          </div>
        );

      case 'PACKAGING':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Package className="text-[#febd69]"/> Quy cách đóng gói</h2>
            <p className="text-gray-600 italic mb-4">Người bán chịu trách nhiệm hoàn toàn về sự nguyên vẹn của hàng hóa khi đến tay người mua.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Hàng dễ vỡ</h4>
                    <p className="text-sm text-gray-600">Bắt buộc quấn 3-4 lớp xốp hơi (bubble wrap). Dùng thùng carton cứng, chèn kín các khe hở bằng xốp hoặc giấy vụn. Dán tem "Hàng dễ vỡ".</p>
                </div>
                <div className="border p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Đồ điện tử</h4>
                    <p className="text-sm text-gray-600">Bọc nilon chống thấm nước trước khi đóng hộp. Tháo pin nếu có thể (đối với thiết bị dùng pin rời).</p>
                </div>
                <div className="border p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Quần áo/Vải vóc</h4>
                    <p className="text-sm text-gray-600">Gấp gọn, bọc trong túi nilon kín miệng để tránh ẩm mốc hoặc nước trong quá trình vận chuyển.</p>
                </div>
            </div>
            <div className="mt-4 bg-yellow-50 p-3 rounded text-sm text-yellow-800 font-bold border border-yellow-200">
                Lưu ý: Quay video quá trình đóng gói để làm bằng chứng nếu có tranh chấp xảy ra.
            </div>
          </div>
        );

      case 'SHIPPING':
        return (
           <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Truck className="text-[#febd69]"/> Quy tắc Gửi & Nhận hàng</h2>
            
            <div className="space-y-4">
                <div className="bg-white p-4 shadow-sm border rounded-lg">
                    <h3 className="font-bold text-[#131921] border-b pb-2 mb-2">Quy trình Gửi hàng (Người bán)</h3>
                    <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Xác nhận đơn hàng trong vòng 24h.</li>
                        <li>Đóng gói theo quy chuẩn.</li>
                        <li>Giao cho đơn vị vận chuyển được AmazeBid chỉ định trong vòng 48h.</li>
                        <li>Cập nhật trạng thái "Đã gửi" lên hệ thống.</li>
                    </ul>
                </div>

                <div className="bg-white p-4 shadow-sm border rounded-lg">
                    <h3 className="font-bold text-[#131921] border-b pb-2 mb-2">Quy trình Nhận hàng (Người mua)</h3>
                    <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li><strong>Đồng kiểm:</strong> Được phép kiểm tra ngoại quan (không thử hàng) khi nhận.</li>
                        <li><strong>Quay video:</strong> BẮT BUỘC quay video mở hộp (uncut) để làm bằng chứng khiếu nại.</li>
                        <li><strong>Xác nhận:</strong> Nhấn "Đã nhận hàng" trong vòng 3 ngày kể từ khi nhận. Sau 3 ngày, hệ thống tự động xác nhận.</li>
                    </ul>
                </div>
            </div>
           </div>
        );

      case 'RETURN':
        return (
           <div className="space-y-6 animate-in slide-in-from-right-4">
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><RefreshCw className="text-[#febd69]"/> Quy tắc Trả hàng & Hoàn tiền</h2>
             <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3">
                 <AlertTriangle className="text-red-600 shrink-0"/>
                 <div>
                     <p className="font-bold text-red-800">Thời hạn khiếu nại: 3 ngày</p>
                     <p className="text-sm text-red-700">Kể từ lúc đơn vị vận chuyển báo giao hàng thành công.</p>
                 </div>
             </div>

             <div className="space-y-4 mt-2">
                 <h3 className="font-bold text-gray-900">Lý do chấp nhận trả hàng:</h3>
                 <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-4">
                     <li>Hàng không đúng mô tả (sai màu, sai size, sai mẫu).</li>
                     <li>Hàng bị bể vỡ, hư hỏng trong quá trình vận chuyển.</li>
                     <li>Hàng giả/nhái (cần bằng chứng xác thực).</li>
                     <li>Thiếu phụ kiện kèm theo.</li>
                 </ul>

                 <h3 className="font-bold text-gray-900 mt-4">Chi phí trả hàng:</h3>
                 <p className="text-sm text-gray-700">
                    - <strong>Lỗi người bán/Vận chuyển:</strong> Người bán hoặc Đơn vị vận chuyển chịu phí.<br/>
                    - <strong>Người mua đổi ý:</strong> Không hỗ trợ trả hàng (trừ khi người bán đồng ý, người mua chịu 100% phí ship 2 chiều).
                 </p>
             </div>
           </div>
        );

      case 'TAX':
        return (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Scale className="text-[#febd69]"/> Quy định Khai báo thuế Tự chủ</h2>
                <div className="bg-gray-100 p-6 rounded-xl border border-gray-200 text-center">
                    <p className="text-gray-800 font-medium mb-4">
                        AmazeBid là nền tảng trung gian kết nối. Chúng tôi không chịu trách nhiệm kê khai và nộp thuế thu nhập cá nhân (TNCN) thay cho người bán (trừ các khoản thuế sàn TMĐT bắt buộc khấu trừ tại nguồn nếu luật pháp quy định).
                    </p>
                    <div className="text-left bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-[#131921] mb-2">Trách nhiệm của Người bán:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                            <li>Cá nhân kinh doanh có doanh thu trên 100 triệu đồng/năm thuộc diện chịu thuế GTGT và TNCN.</li>
                            <li>Tự chủ động đăng ký mã số thuế cá nhân.</li>
                            <li>Tự kê khai doanh thu phát sinh từ AmazeBid vào tờ khai thuế hàng năm.</li>
                            <li>Lưu trữ chứng từ giao dịch để phục vụ thanh tra thuế khi cần thiết.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );

      case 'LEGAL':
        return (
          <div className={`space-y-6 animate-in slide-in-from-right-4`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="text-[#febd69]"/> Luật Thương Mại Điện Tử Việt Nam</h2>
            
            <div className={`bg-blue-50 border-l-4 p-4 ${isDarkMode ? 'border-blue-700 bg-blue-900' : 'border-blue-500'}`}>
              <p className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Nghị định 52/2013/NĐ-CP</p>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>Quy định về quản lý hoạt động thương mại điện tử</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 shadow-sm border rounded-lg">
                <h3 className="font-bold text-[#131921] mb-2">Điều 4: Nghĩa vụ của website thương mại điện tử</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Công bố thông tin về người bán (tên, địa chỉ, điện thoại, email)</li>
                  <li>Cung cấp thông tin chi tiết về hàng hóa, dịch vụ</li>
                  <li>Công bố giá bán hàng hóa, dịch vụ rõ ràng</li>
                  <li>Cung cấp phương thức thanh toán an toàn, bảo mật</li>
                  <li>Chịu trách nhiệm về thông tin do mình cung cấp</li>
                </ul>
              </div>

              <div className="bg-white p-4 shadow-sm border rounded-lg">
                <h3 className="font-bold text-[#131921] mb-2">Điều 20: Quy định về giao dịch</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Hợp đồng điện tử có giá trị pháp lý như hợp đồng viết</li>
                  <li>Thời gian xác nhận giao dịch không quá 24h</li>
                  <li>Phải cung cấp hóa đơn điện tử cho mọi giao dịch</li>
                  <li>Lưu trữ thông tin giao dịch tối thiểu 03 năm</li>
                </ul>
              </div>

              <div className="bg-white p-4 shadow-sm border rounded-lg">
                <h3 className="font-bold text-[#131921] mb-2">Điều 25: Bảo vệ người tiêu dùng</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Được xem thông tin đầy đủ trước khi mua</li>
                  <li>Được xác nhận thông tin đơn hàng</li>
                  <li>Được hủy giao dịch trong vòng 07 ngày (đối với hàng dịch vụ)</li>
                  <li>Được bảo mật thông tin cá nhân</li>
                  <li>Được khiếu nại và bồi thường thiệt hại</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="font-bold text-yellow-800 mb-2">Lưu ý quan trọng:</p>
                <p className="text-sm text-yellow-700">AmazeBid tuân thủ tuyệt đối Nghị định 52/2013/NĐ-CP và các quy định pháp luật Việt Nam về thương mại điện tử.</p>
              </div>
            </div>
          </div>
        );

      case 'CONTRACT':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FileText className="text-[#febd69]"/> Hợp Đồng Mua Bán Điện Tử</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-3">Mẫu Hợp Đồng Mua Bán Chuẩn</h3>
              
              <div className="bg-white p-6 rounded-lg border space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700">Bên A (Người bán)</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Họ và tên: Nguyễn Văn A</p>
                      <p className="text-gray-600">Địa chỉ: 123 Nguyễn Trãi, Q.1, TP.HCM</p>
                      <p className="text-gray-600">Điện thoại: 0901234567</p>
                      <p className="text-gray-600">Email: seller@gmail.com</p>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-gray-700">Bên B (Người mua)</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="font-medium">Họ và tên: Trần Thị B</p>
                      <p className="text-gray-600">Địa chỉ: 456 Lê Lợi, Q.3, TP.HCM</p>
                      <p className="text-gray-600">Điện thoại: 0987654321</p>
                      <p className="text-gray-600">Email: buyer@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold mb-3">Điều khoản hợp đồng</h4>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="font-medium">Điều 1: Đối tượng hợp đồng</p>
                      <p>Bên A đồng ý bán và Bên B đồng ý mua các sản phẩm theo thông tin chi tiết trong đơn hàng.</p>
                    </div>
                    <div>
                      <p className="font-medium">Điều 2: Giá trị và thanh toán</p>
                      <p>Tổng giá trị hợp đồng: [Thể hiện theo đơn hàng]. Bên B thanh toán 100% giá trị trước khi nhận hàng.</p>
                    </div>
                    <div>
                      <p className="font-medium">Điều 3: Giao nhận hàng</p>
                      <p>Thời gian giao hàng: [Theo thỏa thuận]. Địa chỉ giao hàng: [Địa chỉ người mua].</p>
                    </div>
                    <div>
                      <p className="font-medium">Điều 4: Bảo hành và đổi trả</p>
                      <p>Sản phẩm được bảo hành [Theo chính sách]. Được đổi trả trong vòng [Theo quy định] ngày nếu có lỗi từ nhà sản xuất.</p>
                    </div>
                    <div>
                      <p className="font-medium">Điều 5: Giải quyết tranh chấp</p>
                      <p>Các bên thỏa thuận giải quyết tranh chấp thông qua thương lượng. Nếu không thành công, tranh chấp sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý pháp lý:</strong> Hợp đồng điện tử có giá trị pháp lý theo Điều 20 Nghị định 52/2013/NĐ-CP. 
                    Hợp đồng được tự động tạo và lưu trữ khi người mua xác nhận đơn hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'AGREEMENT':
        return (
            <div className="h-full flex flex-col animate-in slide-in-from-right-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FileText className="text-[#febd69]"/> Điều khoản Sử dụng Dịch vụ</h2>
                
                {/* Scrollable Agreement Content */}
                <div className={`flex-1 overflow-y-auto p-6 rounded-xl mb-4 text-justify text-sm leading-relaxed custom-scrollbar shadow-inner ${
                  isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-300'
                }`}>
                    <h3 className="font-bold text-center mb-4 uppercase">ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ AMAZEBID<br/>Cập nhật lần cuối: 01/01/2024<br/>---</h3>

                    <p className="mb-3"><strong>Điều 1: Chấp nhận Điều khoản</strong><br/>
                    Bằng việc sử dụng dịch vụ AmazeBid, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản này.</p>
                    
                    <p className="mb-3"><strong>Điều 2: Định nghĩa Dịch vụ</strong><br/>
                    AmazeBid là nền tảng thương mại điện tử kết nối người mua và người bán. Chúng tôi cung cấp công nghệ trung gian thanh toán và giải quyết tranh chấp.</p>

                    <p className="mb-3"><strong>Điều 3: Quyền và Nghĩa vụ Người dùng</strong><br/>
                    1. Cung cấp thông tin chính xác, đầy đủ và cập nhật<br/>
                    2. Bảo mật tài khoản và chịu trách nhiệm về mọi hoạt động dưới tài khoản<br/>
                    3. Không sử dụng dịch vụ cho mục đích phi pháp, lừa đảo<br/>
                    4. Tôn trọng quyền sở hữu trí tuệ và không vi phạm bản quyền</p>

                    <p className="mb-3"><strong>Điều 4: Quyền và Nghĩa vụ Người bán</strong><br/>
                    1. Đăng bán sản phẩm hợp pháp, có nguồn gốc rõ ràng<br/>
                    2. Cung cấp thông tin chính xác về sản phẩm<br/>
                    3. Chịu trách nhiệm về chất lượng và giao hàng đúng hẹn<br/>
                    4. Tuân thủ chính sách bảo hành, đổi trả</p>

                    <p className="mb-3"><strong>Điều 5: Giao dịch và Thanh toán</strong><br/>
                    1. Mọi giao dịch được bảo vệ bởi cơ chế SafePay<br/>
                    2. Tiền chỉ được giải ngân cho người bán sau khi người mua xác nhận đã nhận hàng<br/>
                    3. Phí dịch vụ: 5% trên giá trị đơn hàng thành công<br/>
                    4. Phương thức thanh toán: Thẻ ngân hàng, chuyển khoản, ví điện tử</p>

                    <p className="mb-3"><strong>Điều 6: Bảo vệ Người tiêu dùng</strong><br/>
                    1. Được xem thông tin đầy đủ trước khi mua<br/>
                    2. Được hủy giao dịch trong vòng 7 ngày (đối với dịch vụ)<br/>
                    3. Được bảo mật thông tin cá nhân<br/>
                    4. Được khiếu nại và bồi thường thiệt hại</p>

                    <p className="mb-3"><strong>Điều 7: Trách nhiệm Thuế</strong><br/>
                    1. Người bán chịu trách nhiệm kê khai và nộp thuế thu nhập cá nhân<br/>
                    2. AmazeBid không chịu trách nhiệm về nghĩa vụ thuế của người bán<br/>
                    3. Tuân thủ Luật Quản lý thuế và Nghị định 52/2013/NĐ-CP</p>

                    <p className="mb-3"><strong>Điều 8: Giải quyết Tranh chấp</strong><br/>
                    1. Ưu tiên giải quyết thông qua thương lượng<br/>
                    2. Thời hạn khiếu nại: 3 ngày kể từ khi nhận hàng<br/>
                    3. Nếu không giải quyết được, tranh chấp sẽ được xử lý tại cơ quan có thẩm quyền</p>

                    <p className="mb-3"><strong>Điều 9: Miễn trừ Trách nhiệm</strong><br/>
                    1. AmazeBid không chịu trách nhiệm về chất lượng thực tế của sản phẩm<br/>
                    2. Không chịu trách nhiệm về thiệt hại gián tiếp phát sinh<br/>
                    3. Không bảo đảm tính sẵn sàng của dịch vụ 100% thời gian</p>

                    <p className="mb-3"><strong>Điều 10: Sửa đổi Điều khoản</strong><br/>
                    AmazeBid có quyền sửa đổi điều khoản và sẽ thông báo trước 7 ngày. Việc tiếp tục sử dụng dịch vụ sau thông báo coi như đồng ý với điều khoản đã sửa đổi.</p>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                      <p className="font-bold text-yellow-800 mb-2">Lưu ý quan trọng:</p>
                      <p className="text-sm text-yellow-700">Các điều khoản này được xây dựng dựa trên Nghị định 52/2013/NĐ-CP và Luật Bảo vệ người tiêu dùng Việt Nam.</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-white border-t pt-4 flex flex-col items-center gap-3">
                    {hasAgreed ? (
                        <div className="flex flex-col items-center text-green-600 animate-in zoom-in">
                            <ShieldCheck size={48} className="mb-2"/>
                            <p className="font-bold text-lg">Bạn đã ký xác nhận thỏa thuận này.</p>
                            <p className="text-xs text-gray-500">Hiệu lực từ: {new Date().toLocaleDateString()}</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <p className="text-xs text-center text-gray-500 mb-3">Vui lòng đọc kỹ toàn bộ nội dung trước khi xác nhận.</p>
                            <button 
                                onClick={handleAgree}
                                className="w-full bg-[#131921] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={20} /> TÔI ĐỒNG Ý VỚI ĐIỀU KHOẢN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className={`relative bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 ${isDarkMode ? 'bg-gray-900 text-white' : ''}`}>
        
        {/* Sidebar */}
        <div className={`w-full md:w-64 flex flex-col shrink-0 ${isDarkMode ? 'bg-gray-800' : 'bg-[#f3f4f6]'}`}>
            <div className={`p-5 border-b ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`font-bold text-xl flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#131921]'}`}>
                    Dịch vụ KH
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Trung tâm hỗ trợ & Pháp lý</p>
            </div>
            
            <nav className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                {TOPICS.map(topic => (
                    <button
                        key={topic.id}
                        onClick={() => setActiveTab(topic.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center justify-between transition-all ${
                            activeTab === topic.id 
                                ? isDarkMode ? 'bg-blue-600 text-white shadow-md' : 'bg-[#131921] text-white shadow-md'
                                : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <topic.icon size={18} />
                            {topic.title}
                        </span>
                        {activeTab === topic.id && (
                            <ChevronRight size={16} className="animate-pulse" />
                        )}
                    </button>
                ))}
            </nav>
            
            {hasAgreed && (
                <div className="p-4 bg-green-50 m-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 text-green-800 font-bold text-xs mb-1">
                        <ShieldCheck size={14} /> Trạng thái tài khoản
                    </div>
                    <p className="text-xs text-green-700">Đã xác thực hợp đồng pháp lý.</p>
                </div>
            )}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative h-full">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">
                <X size={24} />
            </button>
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceModal;
