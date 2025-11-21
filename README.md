
# 📝 Mini Blogging Platform  
A modern full-stack blogging application with protected author dashboard, public blog listing, and an integrated AI Support Agent.



## 🚀 Overview

A complete blogging platform where:

- ✔ **Users can sign up, log in, and create their own blogs.**  
- ✔ **All published blogs are publicly visible on the homepage.**  
- ✔ **Only authors can edit or delete their own blogs.**  
- ✔ **Dashboard, blog creation, and blog management routes are fully protected.**  
- ✔ **An AI Support Agent answers user FAQs using a knowledge-base grounded prompt.**

The app uses:

- ⚡ **Zustand** — state management  
- ⚡ **React Router v6** — routing + protected routes  
- ⚡ **Custom `useApi` Hook** — uniform API layer  
- ⚡ **JWT + HTTP-only cookies** — secure authentication  
- ⚡ **Node.js / Express backend**  
- ⚡ **MongoDB / SQLite / PostgreSQL** (any supported DB)

- ### Clone Repository

git clone https://github.com/Connectgauravkaushik/mini-blog.git
cd your-repo

- ### Project run command 

**Frontend run command** - npm run dev
**Backend run command** - npm start

## 🛠️ Features

### 🔐 Authentication
- Register (Full Name, Email, Password)
- Login (Email, Password)
- Auth session stored in HTTP-only cookie
- Zustand stores user state
- Auto redirect for protected routes

### ✍️ Blog System
- Create blog: **Title + Content + Tags + Category**
- View all blogs publicly (no login required)
- Author-only operations:
  - Edit blog  
  - Delete blog  
  - View blog stats on dashboard
- Blog preview card, excerpt generation, and formatted date display

### 📦 Global State (Zustand)
Stores:
- `user`
- `blogs` (editable list)
- `allBlogs` (public)
- `authorBlogs` (dashboard-specific)
- loading + error flags
- modal states (edit, delete, settings)

All state resets automatically on logout.

### 🔌 Custom Hook — `useApi`
Handles:
- GET, POST, PATCH, DELETE requests  
- Error handling  
- Loading state  
- Auto-updating Zustand stores  
- Reusable across entire project  

### 🤖 AI Support Agent
- `/support` page on dashboard with chat-like UI
- Backend route:


## 🔐 Protected Routes (Frontend)

| Route | Access |
|-------|--------|
| `/dashboard` | **Author only** |
| `/dashboard/create-blog` | **Author only** |
| `/dashboard/manage-blog` | **Author only** |
| `/dashboard/support` | **Author only** |
| `/blog/:id` | Public |
| `/` | Public |
| `/login` | Public |

Unauthorized users ⇒ auto redirect to **/login**

---

## ⚙️ API Endpoints

### **Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user + set cookie |
| POST | `/api/auth/login` | Login + set cookie |
| POST | `/api/auth/logout` | Clear cookie |

### **Blogs**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/blogs` | Create new blog *(requires auth)* |
| GET | `/api/blogs` | Fetch all blogs (public) |
| GET | `/api/blogs/author` | Fetch author’s blogs |
| PATCH | `/api/blogs/:id` | Update blog *(author only)* |
| DELETE | `/api/blogs/:id` | Delete blog *(author only)* |

### **AI Support Agent**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/query` | Ask agent a question |







