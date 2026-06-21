# Meshabek Store

A production-ready full-stack e-commerce website for **Meshabek Store**, a premium Egyptian thrift clothing brand. The app includes a public shopping experience, cart, checkout, JWT-secured admin dashboard, MongoDB models, Cloudinary image upload route, analytics, and realistic demo data.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- Image storage: Cloudinary
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas database

## Project Structure

```txt
frontend/   React storefront and admin dashboard
backend/    Express API, MongoDB models, routes, controllers, seed data
```

## Local Setup

1. Install backend dependencies:

```bash
cd backend
npm install
cp .env.example .env
```

2. Set `backend/.env`.

For local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/meshabek-store
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

3. Seed demo data:

```bash
npm run seed
```

Default admin from `.env.example`:

```txt
admin@meshabek.store
admin12345
```

4. Start backend:

```bash
npm run dev
```

5. Install frontend dependencies:

```bash
cd ../frontend
npm install
cp .env.example .env
```

6. Start frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Environment Variables

Backend:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/meshabek-store
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_NAME=Meshabek Admin
ADMIN_EMAIL=admin@meshabek.store
ADMIN_PASSWORD=admin12345
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

- `GET /api/products` public product listing with search/filter/sort
- `GET /api/products/featured` featured products
- `GET /api/products/:id` product details
- `POST /api/orders` public checkout
- `POST /api/auth/login` admin login
- `GET /api/admin/stats` admin analytics
- `POST /api/products` admin create product
- `PUT /api/products/:id` admin update product
- `DELETE /api/products/:id` admin delete product
- `GET /api/orders` admin order list
- `PATCH /api/orders/:id/status` admin order status update
- `POST /api/upload/images` admin Cloudinary image upload

## Deployment

### MongoDB Atlas

1. Create an Atlas cluster.
2. Add a database user.
3. Add your Render outbound IPs or allow access as appropriate.
4. Copy the connection string into `MONGO_URI`.

### Backend on Render

1. Create a new Web Service from this repo.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add backend environment variables from `backend/.env.example`.
6. Set `NODE_ENV=production`.
7. Set `CLIENT_URL` to your Vercel frontend URL.

Run seed once from Render shell or locally against Atlas:

```bash
npm run seed
```

### Frontend on Vercel

1. Import the repo into Vercel.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL=https://your-render-service.onrender.com/api`.

## Production Notes

- Replace the demo admin password before showing the site publicly.
- Configure Cloudinary variables to enable dashboard image uploads.
- For a live store, add payment integration, delivery fee calculation, and exact garment measurements.
- The backend reduces stock when an order is placed and automatically marks products sold out when stock reaches zero.
