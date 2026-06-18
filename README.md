# FullStack Insight - Analytics Dashboard Platform

FullStack Insight is a production-ready, feature-rich Full Stack MERN (MongoDB, Express, React, Node) analytics application. It allows businesses to collect, process, and visualize transactional sales and CRM customer profiles, providing key insights through interactive charts, dynamic filters, and custom exported reports.

---

## Technical Stack

### Frontend
- **React (Vite)**: Fast SPA rendering
- **Tailwind CSS**: Modern typography, harmonious spacing, custom dark-mode
- **Chart.js & React-Chartjs-2**: High-performance line, bar, and doughnut charts
- **React Router DOM**: Single Page Application client-side routing
- **Axios**: Promised-based client with custom token injection interceptors
- **Context API**: Clean state management for session auth and light/dark theme toggles
- **React Icons**: Clean iconography (Feather icons subset)

### Backend
- **Node.js & Express.js**: RESTful API design with clean modular architecture
- **JWT (JsonWebToken)**: Standardized route protection and auth session lifecycle
- **bcryptjs**: Secure one-way password hashing
- **express-validator**: Rigid request body checking middleware
- **dotenv & cors**: Dynamic CORS permissions and environment configurations
- **Mongoose**: Schematized modeling for MongoDB queries

---

## Folder Structure

```text
analytics-app/
├── backend/
│   ├── config/              # Database connection scripts
│   ├── controllers/         # Request handling logic (Auth, Sales, CRM, Analytics)
│   ├── middleware/          # Route guards and validator validation checks
│   ├── models/              # Mongoose schemas (User, Sale, Customer)
│   ├── routes/              # Express route definitions
│   ├── utils/               # DB reset & data seeding scripts
│   ├── .env.example         # Template environment variables
│   ├── package.json         # Node scripts & dependencies
│   └── server.js            # Express entry file
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Sidebar, Spinner, Cards, Toast)
│   │   ├── context/         # React Contexts (AuthContext, ThemeContext)
│   │   ├── pages/           # View layouts (Login, Register, Sales, Customers, Products, Reports, Profile)
│   │   ├── utils/           # Axios instance, formatting helpers
│   │   ├── App.jsx          # Route paths
│   │   ├── index.css        # Tailwind classes and glassmorphic styles
│   │   └── main.jsx         # Render context bootstrap
│   ├── postcss.config.js    # Postcss rules
│   ├── tailwind.config.js   # Tailwinds design tokens
│   ├── vercel.json          # Vercel fallback router
│   ├── vite.config.js       # Vite bundler options
│   └── package.json         # Scripts and dependencies
└── README.md                # System documentation
```

---

## Local Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) installed locally (v18+ recommended)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running on port `27017` or a MongoDB Atlas URI

### 1. Backend Configuration
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying the template:
   ```bash
   cp .env.example .env
   ```
4. Verify environment values in `.env`:
   - `PORT=5000`
   - `MONGO_URI=mongodb://127.0.0.1:27017/fullstack_insight`
   - `JWT_SECRET=supersecretjwtkeyforfullstackinsightapp123!`
   - `FRONTEND_URL=http://localhost:5173`
   - `NODE_ENV=development`
5. Seed the database with mock records (creates default user, sales, and customers):
   ```bash
   npm run seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React app:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:5173`

---

## Seeding Details & Credentials

Running `npm run seed` in the backend inserts:
- **Default Admin User**:
  - Email: `admin@fullstackinsight.com`
  - Password: `AdminPass123!`
- **CRM Customer List**: 20+ profiles distributed across 8 US cities.
- **Sales Data**: 30+ transactions spanning 12 calendar months in Categories (Electronics, Clothing, Office Supplies, Home & Kitchen), ensuring trend charts display realistic timelines.

---

## API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Create user. Request: `{ name, email, password }`
- `POST /api/auth/login` - Authenticate session. Request: `{ email, password }`
- `GET /api/auth/profile` - Fetch current user (JWT header required)

### Analytics Aggregations
- `GET /api/analytics/dashboard` - Return KPI card aggregates
- `GET /api/analytics/revenue` - Return revenue timeline statistics (Line chart)
- `GET /api/analytics/sales` - Return category value splits (Bar/Donut chart)
- `GET /api/analytics/customers` - Return geographical density lists
- `GET /api/analytics/products` - Return top gross items

### Sales CRUD
- `GET /api/sales` - Fetch paginated logs (Supports `search`, `category`, `startDate`, `endDate`, `sortBy`, `page`)
- `POST /api/sales` - Record transaction. Request: `{ productName, category, quantity, revenue, saleDate }`
- `PUT /api/sales/:id` - Update transaction details.
- `DELETE /api/sales/:id` - Delete transaction log.

### Customers CRUD
- `GET /api/customers` - Fetch paginated CRM entries (Supports `search`, `city`, `sortBy`, `page`)
- `POST /api/customers` - Add client. Request: `{ customerName, email, city, createdAt }`
- `PUT /api/customers/:id` - Edit client profile.
- `DELETE /api/customers/:id` - Remove client profile.

---

## GitHub & Production Deployment Guide

Follow these steps to deploy FullStack Insight to production.

### 1. Push Code to GitHub
1. Initialize git in the root directory:
   ```bash
   git init
   ```
2. Create a `.gitignore` file in the root to ignore node modules and active environment keys:
   ```text
   # Node files
   node_modules/
   .env
   dist/
   .DS_Store
   ```
3. Stage and commit files:
   ```bash
   git add .
   git commit -m "feat: initial commit FullStack Insight platform"
   ```
4. Create a new repository on GitHub and link the remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 2. Set Up MongoDB Atlas
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared Cluster (select a cloud provider and region).
3. Under **Database Access**, create a database user (e.g., username `appuser` and select a strong password).
4. Under **Network Access**, whitelist connection requests. For development ease, choose **Allow Access from Anywhere** (`0.0.0.0/0`) or select specific IPs.
5. In **Database Clusters**, click **Connect** → **Drivers** to fetch your MongoDB connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/fullstack_insight?retryWrites=true&w=majority
   ```
   *(Be sure to replace `<username>` and `<password>` with your database user credentials)*

### 3. Deploy Backend to Render
1. Create an account on [Render](https://render.com/).
2. Click **New +** → **Web Service** and connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `fullstack-insight-api`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Expand the **Advanced / Environment Variables** section to add your configurations:
   - `PORT` = `10000` (Render defaults to this)
   - `MONGO_URI` = *(Insert your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(Generate a secure string)*
   - `FRONTEND_URL` = *(Insert your Vercel URL, e.g. `https://your-app.vercel.app` once deployed)*
   - `NODE_ENV` = `production`
5. Click **Create Web Service**. Wait for the logs to declare the service active and copy your live backend URL (e.g., `https://fullstack-insight-api.onrender.com`).

### 4. Deploy Frontend to Vercel
1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New** → **Project** and import your GitHub repository.
3. Configure the build parameters:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite` (automatic)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand the **Environment Variables** section and register your production API endpoint:
   - `VITE_API_URL` = `https://fullstack-insight-api.onrender.com/api`
     *(Insert the Render URL you copied in the previous step)*
5. Click **Deploy**. Vercel will build your bundle and deploy.
6. Once completed, visit your live app URL! Enjoy your FullStack Insight Platform.
