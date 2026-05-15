# PollSync

![PollSync Banner](https://img.shields.io/badge/Status-Production--Ready-brightgreen)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248)

PollSync is a high-performance, real-time polling and live analytics platform designed for seamless audience engagement. Engineered with a modern decoupled architecture, it enables instant vote synchronization, detailed data visualization, and secure participant management.

---

## 🏗 System Architecture

PollSync is built on a distributed architecture ensuring low-latency updates and high availability. The system is split into a reactive frontend SPA and a scalable event-driven backend.

### Frontend Stack (Deployed on Vercel)

The frontend is a modern React-based application optimized for performance and real-time reactivity.

| Technology | Rationale & Problem Solved | Impact on PollSync |
| :--- | :--- | :--- |
| **React** | Selected for its **component-based SPA architecture**. It solves the problem of complex UI state management and provides a **scalable UI system**. | Enables **real-time UI rendering** where poll results and participant lists update instantly without page refreshes. |
| **Vite** | Chosen as the build tool for its **extremely fast development server** and modern ESM-based HMR. | Drastically reduces iteration time and produces **optimized production builds** for superior load times on Vercel. |
| **Redux Toolkit** | Implements **centralized state management**. It solves the "prop drilling" problem and ensures a **predictable frontend state**. | Facilitates **easier real-time synchronization** by serving as the "single source of truth" for incoming socket data. |
| **React Redux** | The official binding that **connects the Redux store with React components** cleanly and efficiently. | Minimizes boilerplate and ensures components only re-render when their specific slice of poll data changes. |
| **React Router DOM** | Handles **client-side routing** and **SPA navigation** without full browser reloads. | Provides a seamless transition between the dashboard, poll creation, and the live voting booth. |
| **Axios** | Provides a **structured API communication** layer with support for **request interceptors**. | Ensures **cleaner backend integration** with automated token handling for secure poll management routes. |
| **Socket.IO Client** | Enables **real-time bi-directional communication** between the client and server. | Powers **instant vote synchronization** and live analytics updates, allowing users to see results as they happen. |
| **Tailwind CSS** | A **utility-first styling** framework that enables **rapid UI development** without leaving the HTML. | Powers a **modern SaaS-style design system** that is fully responsive and consistently themed across the platform. |
| **QRCode React** | Generates dynamic QR codes for **poll sharing** and audience participation. | Simplifies the bridge between physical events and digital voting, making it **mobile-friendly** for any audience. |
| **NProgress** | Implements **top loading indicators** to provide visual feedback during async operations. | Enhances the **UX during API requests**, making the application feel faster and more responsive. |
| **ESLint** | Enforces **code quality** and **consistent project standards** across the development team. | Prevents common bugs and ensures the codebase remains maintainable as the project scales. |
| **PostCSS + Autoprefixer** | Automates **browser compatibility** by adding necessary vendor prefixes to CSS rules. | Ensures the PollSync UI looks and behaves identically across all modern web browsers. |

---

### Backend Stack (Deployed on Render)

The backend is an event-driven Node.js server designed for high concurrency and real-time data integrity.

| Technology | Rationale & Problem Solved | Impact on PollSync |
| :--- | :--- | :--- |
| **Node.js** | Utilizes a **non-blocking, event-driven architecture** ideal for I/O intensive tasks. | Perfect for **real-time applications** where hundreds of concurrent votes need to be processed simultaneously. |
| **Express.js** | A **lightweight backend framework** that provides a **modular API architecture**. | Enables **scalable route handling** for poll management, authentication, and analytical data retrieval. |
| **MongoDB** | A NoSQL database with **flexible schema design**, ideal for handling **dynamic poll structures**. | Allows for complex poll types (multiple choice, open-ended) without the rigidity of traditional SQL tables. |
| **Mongoose** | Provides an elegant **schema validation** and modeling layer over MongoDB. | Ensures a **structured backend architecture** with strict data types and robust middleware for poll logic. |
| **Socket.IO** | The core engine for **real-time websocket communication**. | Implements the **vote broadcasting system**, pushing updates to all connected clients the moment a vote is cast. |
| **JWT** | Implements **scalable stateless authentication**, removing the need for server-side session storage. | Secures **protected routes** for poll masters while maintaining high performance and cross-origin compatibility. |
| **Passport.js** | A comprehensive **authentication strategy manager** for Node.js. | Handles complex flows like **Google OAuth support**, allowing users to sign up with a single click. |
| **Express Session** | Manages temporary state for **anonymous vote tracking** and participation gating. | Provides a **session-based protection system** to prevent double-voting without requiring a full account. |
| **Joi** | Adds a **strong validation layer** for incoming request payloads. | Ensures **backend data integrity** by rejecting malformed poll data before it reaches the database. |
| **bcryptjs** | A reliable library for **secure password hashing**. | Protects user credentials with industry-standard salted hashing algorithms. |
| **dotenv** | Manages **environment variables** securely across different environments. | Separates secrets from code, ensuring configuration for MongoDB and OAuth remains private. |
| **CORS** | Configures **secure frontend-backend communication** across different origins. | Restricts API access to authorized domains (e.g., your Vercel deployment), preventing unauthorized use. |
| **Cookie-Parser** | Parses and manages cookies for **auth and session flows**. | Enables secure, HTTP-only cookie handling for persistent user sessions and authentication tokens. |

---

## 🚀 Deployment & Infrastructure

### Frontend Deployment: Vercel
PollSync's frontend is hosted on **Vercel**, benefiting from:
- **Optimized React Hosting**: Automatic performance optimizations and edge caching.
- **Continuous Deployment**: Every push to `main` triggers an automatic production build.
- **Global CDN**: Ensuring low-latency UI delivery to users worldwide.

### Backend Deployment: Render
The API and WebSocket server reside on **Render**, providing:
- **Persistent API Hosting**: Reliable Node.js runtime with managed scaling.
- **Websocket Support**: Native support for Socket.IO's persistent connections.
- **Auto-Deploys**: Synchronized builds with the backend repository.

### Database: MongoDB Atlas
Our data layer is powered by **MongoDB Atlas**, a cloud-hosted infrastructure that offers:
- **Scalable Hosting**: Multi-region clusters for high availability.
- **Automated Backups**: Ensuring poll data and user accounts are always protected.
- **Performance Monitoring**: Real-time insights into query performance and database health.

---

## ⚙️ Configuration & Environment

To maintain security and operational clarity, PollSync uses strict environment separation.

### Production Environment Variables
The following must be configured in your deployment dashboards:

**Backend (Render):**
- `MONGO_URI`: Connection string for MongoDB Atlas.
- `JWT_SECRET`: High-entropy key for token signing.
- `GOOGLE_CLIENT_ID` / `SECRET`: OAuth credentials.
- `CORS_ORIGIN`: Set to your Vercel URL.

**Frontend (Vercel):**
- `VITE_API_URL`: The full URL of your Render backend.
- `VITE_SOCKET_URL`: The base URL for WebSocket connections.

### Deployment Workflow
1. **Local Development**: Code is validated against ESLint and tested locally.
2. **Staging**: Changes are pushed to a feature branch for review.
3. **Production**: Merging into `main` triggers a simultaneous deployment to Vercel and Render.
4. **Synchronization**: The Socket.IO CORS configuration ensures only the production frontend can initiate WebSocket handshakes with the production backend.

---

## 🛠 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZemonGst/Poll-App.git
   ```

2. **Install Dependencies**
   ```bash
   # Root directory
   npm install
   # or navigate to subfolders
   cd pollsync-frontend && npm install
   cd ../server && npm install
   ```

3. **Run Locally**
   ```bash
   # Start Backend
   cd server && npm run dev
   # Start Frontend
   cd pollsync-frontend && npm run dev
   ```

---

*PollSync is maintained as a production-ready, open-source project. For contributions or enterprise inquiries, please open a GitHub Issue.*
