
# Hướng Dẫn Xây Dựng Backend Full-Stack (Chi Tiết A-Z)

Tài liệu này cung cấp **toàn bộ mã nguồn (Source Code)** cần thiết để xây dựng Backend cho AmazeBid sử dụng **Node.js, Express, MongoDB và Socket.io**.

---

## 1. Khởi tạo Dự án & Cài đặt

### Bước 1: Tạo thư mục và khởi tạo
Mở Terminal, chạy các lệnh sau:

```bash
mkdir amazebid-server
cd amazebid-server
npm init -y
```

### Bước 2: Cài đặt thư viện (Dependencies)
```bash
npm install express mongoose dotenv cors socket.io bcryptjs jsonwebtoken @google/genai
npm install --save-dev nodemon
```

*   `express`: Web framework.
*   `mongoose`: Kết nối MongoDB.
*   `dotenv`: Quản lý biến môi trường.
*   `cors`: Cho phép Frontend gọi API.
*   `socket.io`: Xử lý Real-time (Đấu giá/Live).
*   `bcryptjs`: Mã hóa mật khẩu.
*   `jsonwebtoken`: Tạo Token đăng nhập.
*   `@google/genai`: SDK mới nhất của Google Gemini.

---

## 2. Cấu trúc Thư mục

Hãy tạo các thư mục và file theo cấu trúc sau:

```
amazebid-server/
├── config/
│   └── db.js               # Kết nối Database
├── controllers/            # Logic xử lý (Hàm)
│   ├── authController.js
│   ├── productController.js
│   └── aiController.js
├── middleware/
│   └── authMiddleware.js   # Kiểm tra đăng nhập
├── models/                 # Định nghĩa dữ liệu (Schema)
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/                 # Định nghĩa đường dẫn API
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── aiRoutes.js
├── .env                    # File cấu hình (Mật)
└── server.js               # File chạy chính
```

---

## 3. Code Chi Tiết Từng File

### 3.1. Cấu hình (`.env` & `config/db.js`)

**File: `.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/amazebid?retryWrites=true&w=majority
JWT_SECRET=S3cretK3y_ChangeThisToSomethingComplex
GEMINI_API_KEY=AIzaSy... (API Key lấy từ Google AI Studio)
```

**File: `config/db.js`**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 3.2. Models (Schemas)

**File: `models/User.js`**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  avatar: { type: String, default: 'https://ui-avatars.com/api/?background=random' }
}, { timestamps: true });

// Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hàm kiểm tra mật khẩu
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**File: `models/Product.js`**
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  type: { type: String, enum: ['FIXED_PRICE', 'AUCTION'], default: 'FIXED_PRICE' },
  
  // Đấu giá
  currentBid: { type: Number, default: 0 },
  bidCount: { type: Number, default: 0 },
  endTime: Date,
  bidHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now }
  }],

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'AVAILABLE' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
```

---

### 3.3. Middleware (Bảo vệ Route)

**File: `middleware/authMiddleware.js`**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
  }
};

module.exports = { protect };
```

---

### 3.4. Controllers (Logic xử lý)

**File: `controllers/authController.js`**
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Đăng ký user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email đã tồn tại' });

    const user = await User.create({ fullName, email, password });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**File: `controllers/productController.js`**
```javascript
const Product = require('../models/Product');

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  const { title, description, price, image, category, type, endTime } = req.body;

  try {
    const product = new Product({
      title, description, price, image, category, type,
      endTime: type === 'AUCTION' ? endTime : null,
      sellerId: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**File: `controllers/aiController.js`**
```javascript
const { GoogleGenAI } = require("@google/genai");

// @desc    Gọi Gemini API để phân tích hoặc chat
// @route   POST /api/ai/generate
exports.generateContent = async (req, res) => {
  const { prompt, modelName = "gemini-1.5-flash" } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: "Server chưa cấu hình API Key" });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ result: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Lỗi khi gọi AI" });
  }
};
```

---

### 3.5. Routes (Đường dẫn)

**File: `routes/authRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
```

**File: `routes/productRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, createProduct);

module.exports = router;
```

**File: `routes/aiRoutes.js`**
```javascript
const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/aiController');

router.post('/generate', generateContent);

module.exports = router;
```

---

### 3.6. Server Chính & Socket.io

**File: `server.js`**
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Product = require('./models/Product');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Socket.io (Real-time Auction)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Tham gia phòng đấu giá của sản phẩm cụ thể
  socket.on('join_product', (productId) => {
    socket.join(productId);
    console.log(`User joined product room: ${productId}`);
  });

  // Xử lý khi có người đặt giá
  socket.on('place_bid', async (data) => {
    const { productId, userId, userName, amount } = data;

    try {
      // 1. Cập nhật DB
      const product = await Product.findById(productId);
      if (amount <= product.currentBid) {
        socket.emit('error_bid', 'Giá phải cao hơn giá hiện tại!');
        return;
      }

      product.currentBid = amount;
      product.bidCount += 1;
      product.bidHistory.push({
        user: userId,
        userName: userName,
        amount: amount,
        timestamp: new Date()
      });
      await product.save();

      // 2. Gửi thông báo realtime cho TẤT CẢ mọi người trong phòng
      io.to(productId).emit('new_bid_update', {
        currentBid: amount,
        bidCount: product.bidCount,
        lastBidder: userName,
        history: product.bidHistory
      });

    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 4. Cách Chạy Backend

1.  Đảm bảo MongoDB đang chạy (hoặc dùng MongoDB Atlas Cloud).
2.  Chạy lệnh sau tại thư mục gốc:
    ```bash
    npm run dev
    ```
    *(Nếu đã cài nodemon, server sẽ tự khởi động lại khi sửa code)*.

## 5. Kết nối Frontend

Trong file `services/api.ts` ở Frontend, hãy trỏ về server này:

```typescript
const BASE_URL = 'http://localhost:5000/api'; 
// Hoặc URL Render khi deploy: https://amazebid-api.onrender.com/api
```

Với cấu hình này, bạn đã có một hệ thống Backend hoàn chỉnh, bảo mật và hỗ trợ realtime thực thụ.
