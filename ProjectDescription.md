# Project Specification: Tickets (Movie Booking System)

## 1. Project Overview
**Tickets** is a premium, full-stack movie booking platform. It features a high-end, gradient-based aesthetic and a robust MERN-stack backend. The system enables users to explore movies, view in-depth details, select specific theaters, and interact with a dynamic seat map for real-time booking.

---

## 2. Technical Stack
* **Frontend:** React.js, JavaScript, Tailwind CSS.
* **Animations:** **Framer Motion** (for layout transitions, row expansion, and page fades).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB or PostgreSQL.
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt for secure hashing.

---

## 3. Core Features & Functionality

### A. Discovery & UI Experience
* **Trending Hero Section:** High-contrast trending movie poster with a gradient overlay.
* **Dynamic Expandable Sections:** * "Now Playing" and "Coming Soon" sections show only one row initially. 
    * Clicking `(>)` triggers a **Framer Motion** animation that expands the section vertically; `(<)` collapses it.
* **Interactive Movie Cards:**
    * **Action:** Clicking any movie card redirects the user to a **Separate Movie Details Page**.
    * **Hover State:** Displays "Book Ticket" (Now Playing) or "Details" (Coming Soon).
    * **Smart Labels:** Displays Release Date or "Not Announced" if the date is missing in the DB.
    * **Metadata:** Ratings and genres fetched directly from the database.

### B. Movie Details Page (New)
* **Visuals:** High-resolution backdrop/poster of the selected movie.
* **Information:** Displays Full Description, Rating, Cast, Genres, and Duration fetched from the database.
* **Call to Action:** * If "Now Playing": Shows a "Select Theater & Time" button.
    * If "Coming Soon": Shows "Notify Me" or "Trailer" options.

### C. Booking & Seat Selection
* **Theater Hierarchy:** Support for multiple multiplexes (INOX, PVR, etc.), each with multiple screens and varying capacities (30, 60, or 90 seats).
* **3-Day Window:** Showtimes available for the current day and the next two days.
* **Interactive Seat Map:**
    * A dedicated page showing Movie Name and Showtime at the top.
    * **Visual Grid:** Interactive seat selection with color-coded states (Available, Selected, Booked).
    * **Validation:** "Confirm Booking" is disabled/shows error if no seat is selected.
* **Pricing:** Automated calculation of `(Base Price * Seats) + (₹40 * Seats)` for platform fees.

### D. Authentication & Security
* **Login/Signup:** Supports Email or Mobile number.
* **Forgot Password Logic:**
    * If account exists but password is wrong → "Password is wrong".
    * If account does not exist → "Account not found".
* **My Tickets:** User dashboard to view valid tickets and a **Cancel Ticket** option to release seats back to the pool.
* **Unique ID Generation:** Format: `[TheatreShortName]_[Screen#]_[ShowTime]_[Seat#]`.

---

## 4. UI/UX & Animation Details (Framer Motion)
* **Theme:** Aesthetic dark mode with deep gradients (e.g., #1a1a2e to #000000).
* **Page Transitions:** Smooth "Fade-in" animations when navigating from the Home page to the Movie Details page.
* **Row Expansion:** Uses `layout` prop to push content down naturally without jarring jumps.

---

## 5. Development Milestones
1.  **Phase 1:** Backend API for Auth, Movies, and Theater data.
2.  **Phase 2:** Homepage UI with Framer Motion row expansion.
3.  **Phase 3:** **Movie Details Page** development and dynamic routing (`/movie/:id`).
4.  **Phase 4:** Theater selection and Seat Map visualization.
5.  **Phase 5:** Booking confirmation, fee calculation, and Ticket ID generation.
6.  **Phase 6:** Admin Panel and Search functionality.