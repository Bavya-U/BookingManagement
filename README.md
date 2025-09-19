# Booking Management System

A web application for managing bookings where residents can register, log in, select services, choose a date & time slot, and confirm bookings. Admins can manage services, time slots, and view all bookings.

---

## 🚀 Tech Stack

**Frontend:**
- React (Vite setup, function components)
- ShadCN UI (Reusable UI components)
- Tailwind CSS (Styling)
- Redux (State management)
- Formik + Yup (Forms & Validation)
- React-Toastify (Notifications)

**Backend:**
- Firebase Authentication (Sign up / Login)
- Firebase Firestore (Database)

---

## ⚡ Features

### Resident Role
- Register and Login with email & password  
- Book a service with:
  - Service selection (dropdown)
  - Date picker (ShadCN Calendar)
  - Time slot grid (shows only available slots)
  - Booking form:
    - Name (required)
    - Email (validated)
    - Phone number (validated)
    - Auto-filled service/date/time  
- Booking confirmation page (with booking ID + details)  
- My Bookings page (view all past & upcoming bookings)

### Admin Role
- Create & manage services  
- Create & manage time slots  
- View all resident bookings in a table  

---

## 📂 Screens / Pages
- Registration Page (Admin / Resident roles)
- Login Page
- Booking Page (Residents)
- My Bookings Page (Residents)
- Service Management Page (Admin)
- Time Slot Management Page (Admin)
- All Bookings Table Page (Admin)
- Booking Confirmation Page

---

## ⚙️ Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/booking-management-system.git
   cd booking-management-system
2. **Install dependencies:**
     npm install
3. **Setup Firebase:**

   Create a Firebase project at Firebase Console

   Enable Authentication (Email/Password)

   Create a Cloud Firestore database

   Copy your Firebase config keys

 4. **Add Firebase config:**
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
  
5. **npm run dev:**
   npm run dev

## Firebase Schema
○ user → {uid,email,role}
○ services → { id, name, description }
○ time_slots → { id, service_id, date, slot, isBooked }
○ bookings → { id, user_id, service_id, date, slot, customerName, email, phone }
  

## Deployment  
 Deployed on: Vercel
 Link : https://booking-management-theta.vercel.app

## git 
Repo: https://github.com/Bavya-U/BookingManagement