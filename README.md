# MERN Advanced Booking Application

A full‑stack **MERN (MongoDB/MySQL, Express, React, Node.js)** based booking application. The application focuses on real‑world CRUD operations, authentication, role‑based access control, and deployment, with a scalable architecture ready for real‑time features using **Socket.IO** (planned).

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User **Signup & Login** with secure authentication
* **Role‑based access control** (Admin / User)
* Admin can update user roles

### 🧑‍💼 Admin Features

* Create, Edit, Update, and Delete listings/events
* Manage all bookings
* Control user roles (Admin/User)

### 👤 User Features

* View available events/listings
* Book events/tickets
* View booking history

### 🧩 APIs Implemented

* Authentication APIs (Login / Signup)
* User Profile APIs (Create / Update / Fetch)
* Admin Dashboard APIs
* Listing CRUD APIs
* Booking APIs

### 🌐 Deployment

* **Frontend** deployed on **Netlify**
* **Backend** deployed on **Render**
* Database configured for production environment

---

## 🛠️ Tech Stack

**Frontend**

* React.js
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* REST APIs

**Database**

* MySQL

**Deployment**

* Netlify (Frontend)
* Render (Backend)

---


## ⚙️ Environment Variables

Create a `.env` file in the backend folder:

```
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```

---

## ▶️ Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---


## 📌 Future Enhancements

* Full Socket.IO integration
* Payment gateway integration
* Admin analytics dashboard
* Email notifications

---

⭐ If you find this project useful, feel free to star the repository!
