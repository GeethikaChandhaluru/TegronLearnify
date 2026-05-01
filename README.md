# 📚 Tegron Notes — Digital Books E-Commerce Platform

A full-stack digital books e-commerce platform built with React.js, Node.js, Express, and MongoDB Atlas.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, React Router v6, Axios    |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (Mongoose ODM)        |
| Auth       | JWT + bcrypt                        |
| File Upload| Multer (local uploads/)             |
| Styling    | Pure CSS (custom design system)     |
| Toasts     | react-hot-toast                     |

---

## 📁 Project Structure

```
tegron-notes/
├── backend/         # Node + Express API
└── frontend/        # React SPA
```

---

## ⚙️ Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tegron-notes
JWT_SECRET=your_super_secret_key
ADMIN_EMAIL=admin@tegronnotes.com
ADMIN_PASSWORD=Admin@123
ADMIN_USERNAME=Admin
CLIENT_URL=http://localhost:5173
```

### 3. Seed the admin account
```bash
npm run seed
```

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

Server runs on `https://tegronlearnify.onrender.com`

---

## ⚙️ Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start the dev server
```bash
npm run dev
```

App runs on `http://localhost:5173`

> The Vite proxy forwards `/api` and `/uploads` to the backend automatically.

---

## 🔑 Roles & Access

| Role  | Access                                                         |
|-------|----------------------------------------------------------------|
| User  | Browse books, cart, buy, read purchased books                  |
| Admin | All user access + Admin Dashboard (books, users, orders)       |

**Admin Login:** Use the credentials set in `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

---

## 🚀 API Endpoints

### Auth
| Method | Endpoint                         | Description          |
|--------|----------------------------------|----------------------|
| POST   | `/api/auth/signup`               | Register user        |
| POST   | `/api/auth/login`                | Login (user + admin) |
| POST   | `/api/auth/forgot-password`      | Request reset link   |
| PUT    | `/api/auth/reset-password/:token`| Reset password       |
| GET    | `/api/auth/me`                   | Get current user     |

### Books
| Method | Endpoint          | Access      |
|--------|-------------------|-------------|
| GET    | `/api/books`      | Public      |
| GET    | `/api/books/:id`  | Public      |
| POST   | `/api/books`      | Admin only  |
| PUT    | `/api/books/:id`  | Admin only  |
| DELETE | `/api/books/:id`  | Admin only  |

### Cart
| Method | Endpoint             | Access   |
|--------|----------------------|----------|
| GET    | `/api/cart`          | Private  |
| POST   | `/api/cart/:bookId`  | Private  |
| DELETE | `/api/cart/:bookId`  | Private  |
| DELETE | `/api/cart`          | Private  |

### Orders
| Method | Endpoint                      | Access   |
|--------|-------------------------------|----------|
| POST   | `/api/orders/buy-now/:bookId` | Private  |
| POST   | `/api/orders/checkout`        | Private  |
| GET    | `/api/orders`                 | Private  |
| GET    | `/api/orders/purchased`       | Private  |

### Admin
| Method | Endpoint                | Access     |
|--------|-------------------------|------------|
| GET    | `/api/admin/stats`      | Admin only |
| GET    | `/api/admin/users`      | Admin only |
| GET    | `/api/admin/orders`     | Admin only |
| GET    | `/api/admin/purchased`  | Admin only |

---

## 🧭 Frontend Routes

| Route                     | Page                  | Guard      |
|---------------------------|-----------------------|------------|
| `/login`                  | Login                 | Guest only |
| `/signup`                 | Signup                | Guest only |
| `/forgot-password`        | Forgot Password       | Guest only |
| `/`                       | Home (Browse Books)   | Auth       |
| `/books/:id`              | Book Details          | Auth       |
| `/cart`                   | Cart                  | Auth       |
| `/purchased`              | My Library            | Auth       |
| `/admin`                  | Admin Dashboard       | Admin      |
| `/admin/add-book`         | Add Book              | Admin      |
| `/admin/manage-books`     | Manage Books          | Admin      |
| `/admin/edit-book/:id`    | Edit Book             | Admin      |
| `/admin/users`            | View Users            | Admin      |
| `/admin/orders`           | View Orders           | Admin      |

---

## 🎨 Theme Colors

| Name         | Hex       |
|--------------|-----------|
| Deep Navy    | `#0D2A44` |
| Dark Blue    | `#0A2238` |
| Cyan         | `#28C7D9` |
| Light Cyan   | `#3ED6E5` |
| Orange-Red   | `#F04A2A` |
| Warm Orange  | `#C63D22` |
| Gold Yellow  | `#F4C430` |
| Soft Gold    | `#FFD95A` |
| White        | `#FFFFFF` |
| Light Gray   | `#F5F7FA` |

---

## 📦 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Serve static files from backend (add to server.js):
# app.use(express.static(path.join(__dirname, '../frontend/dist')));
```

---

## 📝 Notes

- PDF files and thumbnails are stored locally in `backend/uploads/`. For production, integrate **AWS S3** or **Cloudinary**.
- Password reset emails require SMTP config. For dev, the reset URL is returned in the API response.
- No payment gateway is integrated — add **Razorpay** or **Stripe** for production.
