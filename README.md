# Cartly

A full-stack e-commerce application for browsing apparel, managing carts, checking out with PayPal, and administering products, users, and orders.

**Live app:** [cartly-zupz.vercel.app](https://cartly-zupz.vercel.app/)  
**API:** [cartly-pi.vercel.app](https://cartly-pi.vercel.app/)

## Features

- Browse products by gender, category, brand, material, size, colour, price, and search term.
- Product details, ratings, reviews, related products, and stock-aware cart management.
- Guest cart support and cart merging after sign-in.
- Email/password authentication and Google OAuth sign-in.
- JWT authentication using HTTP-only cookies.
- PayPal checkout, order history, and order details.
- Admin screens for managing users, products, and orders.
- Cloudinary-backed product image uploads.

## Tech stack

- **Frontend:** React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, Passport, JWT
- **Services:** MongoDB Atlas, Cloudinary, Google OAuth, PayPal
- **Deployment:** Vercel

## Project structure

```text
cartly/
├── frontend/       # React + Vite client
└── backend/        # Express API and MongoDB models
```

## Run locally

### 1. Install dependencies

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:9000
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

Create `backend/.env`:

```env
PORT=9000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=use-a-long-random-secret

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-secure-password

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:9000/api/users/auth/google/callback
```

Never commit either `.env` file or any API secret.

### 3. Start the apps

In one terminal:

```bash
cd backend
node server.js
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Google OAuth setup

In Google Cloud Console, configure a Web application OAuth client with these local URLs:

```text
Authorized JavaScript origin: http://localhost:5173
Authorized redirect URI: http://localhost:9000/api/users/auth/google/callback
```

For production, use the public frontend origin and API callback URL:

```text
Authorized JavaScript origin: https://cartly-zupz.vercel.app
Authorized redirect URI: https://cartly-pi.vercel.app/api/users/auth/google/callback
```

The callback URI must exactly match `GOOGLE_CALLBACK_URL` in the deployed backend environment.

## Deploying to Vercel

Deploy `frontend` and `backend` as separate Vercel projects.

### Frontend environment variables

```env
VITE_BACKEND_URL=https://cartly-pi.vercel.app
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

### Backend environment variables

```env
NODE_ENV=production
FRONTEND_URL=https://cartly-zupz.vercel.app
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://cartly-pi.vercel.app/api/users/auth/google/callback
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Set the variables in Vercel for the **Production** environment, redeploy both projects, and sign in again after changing cookie or OAuth settings.

## Available frontend commands

Run these from `frontend/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Build the production frontend
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## License

This project is intended for personal and educational use.
