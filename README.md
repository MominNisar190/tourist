# ADVENTURE — Tourism Website

A full-stack tourism website with user auth, booking system, and admin panel.

---

## Requirements

- [Node.js](https://nodejs.org) (v18 or later)
- [VS Code](https://code.visualstudio.com)
- VS Code extension: **Live Server** (by Ritwick Dey)

---

## Setup Steps

### 1. Open project in VS Code
Open the folder `tourism-website-main` in VS Code.

### 2. Install backend dependencies
Open the terminal in VS Code (`Ctrl + `` ` ``) and run:
```bash
cd backend
npm install
```

### 3. Start the backend server
```bash
cd backend
node server.js
```
You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```
**Keep this terminal open** while using the site.

### 4. Open the website
- Right-click `index.html` → **Open with Live Server**
- Or press `Go Live` button at the bottom of VS Code

### 5. Open Admin Panel
- Right-click `admin.html` → **Open with Live Server**
- Login with:
  - Username: `admin`
  - Password: `nisar555`

---

## Project Structure

```
tourism-website-main/
├── index.html          # Main website
├── admin.html          # Admin dashboard
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── admin.css
├── js/
│   ├── script.js       # Main site logic
│   └── admin.js        # Admin panel logic
├── img/                # Images
└── backend/
    ├── server.js       # Express API server
    ├── .env            # Environment variables
    ├── package.json
    └── models/
        ├── User.js
        └── Message.js
```

---

## Features

- User Sign Up / Login (JWT auth)
- Admin Login (separate credentials)
- Tour Booking form (saves to MongoDB)
- Admin panel — view/delete bookings and users
- Dark/Light mode
- Photo gallery with lightbox
- Testimonials slider
- Animated stats counter

---

## Notes

- The backend must be running (`node server.js`) for login, signup, and booking to work
- If you see "Failed to fetch" — the backend is not running
- Admin credentials: `admin` / `nisar555`
