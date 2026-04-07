# Tickets: Technical Framework & Architecture

## 1. Project Directory Structure
A clean separation between the frontend (React) and backend (Node.js).

```text
Tickets/
├── backend/
│   ├── config/             # Database connection & Environment variables
│   ├── controllers/        # Logic for Auth, Movies, Bookings
│   ├── middleware/         # JWT Auth & Error Handling
│   ├── models/             # Mongoose/SQL Schemas (User, Movie, Show, Ticket)
│   ├── routes/             # Express Route definitions
│   └── server.js           # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/         # Images & Global Gradients
│       ├── components/     # Reusable UI (Navbar, MovieCard, SeatGrid)
│       ├── context/        # State management (User & Booking Context)
│       ├── pages/          # Home, Login, SeatSelection, Payment, Admin
│       ├── utils/          # API helpers & Unique ID Generator
│       └── App.js
└── ProjectDescription.md