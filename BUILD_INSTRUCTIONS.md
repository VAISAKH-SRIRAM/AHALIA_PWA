# AHALIA APP - Build & Deployment Instructions

## ⚠️ Important Notice
This app is built with **React (Node.js)** and cannot run directly on XAMPP (PHP environment).

---

## Option 1: Run in Development Mode (Current Setup)

### Prerequisites:
- Node.js 16+ and Yarn installed
- MongoDB running (optional - app works with localStorage)

### Steps:
```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies (if not already installed)
yarn install

# Start development server
yarn start

# App will run at http://localhost:3000
```

---

## Option 2: Build Static Files for Apache (XAMPP)

### Step 1: Build Production Files
```bash
cd /app/frontend
yarn build
```

This creates optimized static files in `/app/frontend/build/` directory.

### Step 2: Copy to XAMPP htdocs
```bash
# Copy build folder to XAMPP
cp -r /app/frontend/build/* /path/to/xampp/htdocs/ahalia-app/
```

### Step 3: Configure Apache .htaccess
Create `/path/to/xampp/htdocs/ahalia-app/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /ahalia-app/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /ahalia-app/index.html [L]
</IfModule>
```

### Step 4: Access App
Open browser: `http://localhost/ahalia-app/`

### ⚠️ Limitations with Static Hosting:
- No backend API (works with mock data + localStorage only)
- No real Odoo integration
- No server-side processing

---

## Option 3: Full Stack Deployment (Recommended for Production)

### Frontend (React):
- Deploy to **Vercel**, **Netlify**, or **AWS S3 + CloudFront**
- Build command: `yarn build`
- Output directory: `build/`

### Backend (FastAPI - if needed):
- Deploy to **Heroku**, **AWS EC2**, **DigitalOcean**, or **Railway**
- Requirements: Python 3.8+, MongoDB connection

### Environment Variables:
```env
# Frontend (.env)
REACT_APP_BACKEND_URL=https://your-api-domain.com

# Backend (.env)
MONGO_URL=mongodb://your-mongo-connection
DB_NAME=ahalia_camp
```

---

## File Structure (For Reference)

```
ahalia-app/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js
│   │   │   ├── FlashNews.js
│   │   │   └── ui/ (shadcn)
│   │   ├── contexts/
│   │   │   ├── ThemeContext.js
│   │   │   ├── NetworkContext.js
│   │   │   └── DataContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Registration.js
│   │   │   ├── Queue.js
│   │   │   ├── ProcedureBilling.js
│   │   │   ├── PharmacyBilling.js
│   │   │   └── Sync.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── hooks/
│   │   │   └── use-toast.js
│   │   ├── mock.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── craco.config.js
│
└── backend/ (optional)
    ├── server.py
    ├── requirements.txt
    └── .env
```

---

## Quick Commands Reference

### Development:
```bash
# Frontend dev server
cd /app/frontend && yarn start

# Backend dev server (if needed)
cd /app/backend && uvicorn server:app --reload
```

### Production Build:
```bash
# Build frontend
cd /app/frontend && yarn build

# Output in: /app/frontend/build/
```

### Testing:
```bash
# Frontend
cd /app/frontend && yarn test

# Backend
cd /app/backend && pytest
```

---

## Need Help?
- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:8001
- All data stored in browser localStorage
- No database required for frontend-only deployment
