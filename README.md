# Booking Management System

A web application for managing bookings where residents can register, log in, select services, choose a date & time slot, and confirm bookings. Admins can manage services, time slots, and view all bookings.

---

## Features

### Resident Role
- Sign up and login with email & password
- Book a service with:
  - Service Selection (dropdown)
  - Date Picker (ShadCN Calendar)
  - Time Slot Grid showing available slots
  - Booking Form with:
    - Name (required)
    - Email (validated)
    - Phone number (validated)
    - Auto-filled selected service/date/time
- Booking Confirmation Page showing booking ID and details
- My Bookings page showing all bookings in a table

### Admin Role
- Create Services
- Create Time Slots
- View all bookings in a table

---

## Screens / Pages
- Registration Page (Admin / Resident roles)
- Login Page
- Booking Page (for Residents)
- My Booking Page (for Residents)
- Service Management Page (for Admin)
- Time Slot Management Page (for Admin)
- Bookings Table Page (for Admin)
- Booking Confirmation Page

---

## Tech Stack

- Frontend:
  - **React** (Function components)
  - **Vite** (React project setup)
  - **ShadCN UI** (UI components)
  - **Tailwind CSS** (Styling)
  - **Redux** (State management)
  - **Formik** (Forms & Validation)
  - **React-Toastify** (Notifications)

- Backend:
  - **Firebase Authentication** (Sign up / Login)
  - **Firebase Firestore** (Database)

---

## Firebase Collections

### services
```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
