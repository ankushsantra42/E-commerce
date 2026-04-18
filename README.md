# MERN Stack E-commerce Project

A full-featured, responsive E-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). This project features a robust admin dashboard, a dynamic shopping experience for users, real-time image handling with Cloudinary, and secure payments via PayPal.

## 🚀 Key Features

### **For Users**
- **Unified Authentication**: Secure JWT-based login and registration with session persistence via HTTP-only cookies.
- **Product Discovery**: 
  - Advanced filtering by Category and Brand.
  - Price-based sorting (Low to High, High to Low).
  - Real-time search functionality.
- **Cart & Checkout**:
  - Persistent shopping cart.
  - Multiple address management (Add, Edit, Delete).
  - Real-time stock validation (prevents adding more than available stock).
- **Ratings & Reviews**: Users can leave reviews and star ratings on products they've purchased.
- **Secure Payments**: Fully integrated **PayPal** payment gateway.

### **For Admins**
- **Dashboard**: High-level overview and management of the store.
- **Product Management**: Add, update, or delete products with image uploads directly to Cloudinary.
- **Order Management**: Track and update the status of user orders.
- **Marketing Control**: Upload and manage hero banner images that reflect on the homepage slideshow.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit (Slices for Auth, Products, Cart, Address, etc.)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn UI & Radix UI
- **Notifications**: Sonner (Color-coded toasts for Success/Error/Warning)
- **Icons**: Lucide React
- **API Client**: Axios

### **Backend**
- **Runtime**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Images**: Cloudinary (via Multer)
- **Payments**: @paypal/paypal-server-sdk
- **Security**: JWT (JSON Web Tokens), Bcrypt.js (Password hashing), Cookie-parser

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js installed
- MongoDB account (Atlas or Local)
- Cloudinary account (for images)
- PayPal Developer account (for payments)

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd e-commerce
```

### **2. Backend Setup**
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` directory and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   ```
4. Start the server: `npx nodemon server.js`

### **3. Frontend Setup**
1. Navigate to the frontend folder: `cd ../frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

---

## 📂 Project Structure

```text
├── backend
│   ├── controllers     # Business logic for Auth, Shop, Admin, Common
│   ├── models          # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes          # Express API routes
│   ├── helpers         # Cloudinary & PayPal configurations
│   └── server.js       # Main entry point
├── frontend
│   ├── src
│   │   ├── component   # Reusable UI components (Common, Admin, Shop)
│   │   ├── pages       # Specific views (Shopping view, Admin view, Auth)
│   │   ├── store       # Redux Toolkit store and slices
│   │   └── config      # Form controls and menu configurations
```

---

