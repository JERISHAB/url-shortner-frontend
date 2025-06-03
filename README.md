
````markdown
# 🌐 URL Shortener Frontend

This is the **frontend** of a full-stack URL Shortener application built using **React**, **TypeScript**, and **Tailwind CSS**. It allows users to register, log in, shorten URLs, and manage them with a clean, minimal UI.

---

## 🚀 Features

- 🔐 User Authentication (Login / Register)
- 🔗 URL shortening with optional custom short codes
- 📋 View, edit, and delete shortened URLs
- 💎 Professional and minimalist dashboard UI
- 🎯 Redirect support using generated short links
- 📦 Axios integration with JWT handling
- 🚪 Logout functionality included

---

## 🧰 Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Axios
- React Router DOM
- LocalStorage for JWT management

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener/frontend
````

### 2. Install Dependencies

Make sure you have **Node.js (v16 or higher)** and **npm** installed.

```bash
npm install
```

### 3. Configure Environment (Optional)

If your backend API is not running on `http://localhost:3000`, update the base URL in `src/services/api.ts`.

```ts
// src/services/api.ts
const api = axios.create({
  baseURL: "http://localhost:3000/api", // ← Update this if needed
});
```

---

## 🧪 Running the App

To start the development server:

```bash
npm run dev
```

Visit:

```
http://localhost:5173
```

---

## 🔑 Authentication

* On login, a JWT token is saved to `localStorage`
* Axios automatically includes the token in requests using an interceptor
* Logout removes the token

---

## 🗂️ Project Structure

```
frontend/
│
├── src/
│   ├── components/       → Reusable UI components
│   ├── pages/            → Login, Register, Dashboard pages
│   ├── services/         → API request logic (authService, urlService)
│   ├── utils/            → Token utilities
│   ├── App.tsx           → App routes
│   └── main.tsx          → Entry point
│
├── public/
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 📋 Pages

| Page      | Path         | Description                     |
| --------- | ------------ | ------------------------------- |
| Login     | `/login`     | Sign in to your account         |
| Register  | `/register`  | Create a new user account       |
| Dashboard | `/dashboard` | View, create, edit, delete URLs |

---

## 🧼 UI & Design

* Built using **Tailwind CSS**
* Clean layout with responsive design
* Clear feedback for errors and actions
* Minimalist dashboard with buttons to edit URLs and short codes
* Logout button in the dashboard header

---

## ✅ Best Practices

* Only registered users can access the dashboard
* Each shortened URL is unique to the user
* Token is securely handled via local storage and Axios headers

---
