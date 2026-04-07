import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import BookingSummary from './pages/BookingSummary';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import MyTickets from './pages/MyTickets';
import Signup from './pages/Signup';
import Movies from './pages/Movies';
import Theaters from './pages/Theaters';
import TheaterDetails from './pages/TheaterDetails';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const PageTitle = ({ title, children }) => {
  React.useEffect(() => {
    document.title = title ? `${title} | Tickets` : 'Tickets';
  }, [title]);
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
      <div className="min-h-screen text-white">
        <Routes>
          <Route path="/" element={<PageTitle title="Home"><Home /></PageTitle>} />
          <Route path="/movie/:id" element={<PageTitle title="Movie Details"><MovieDetails /></PageTitle>} />
          <Route path="/book/:id" element={<PageTitle title="Seat Selection"><SeatSelection /></PageTitle>} />
          <Route path="/booking-summary" element={<PageTitle title="Booking Summary"><BookingSummary /></PageTitle>} />
          <Route path="/login" element={<PageTitle title="Login"><Login /></PageTitle>} />
          <Route path="/signup" element={<PageTitle title="Sign Up"><Signup /></PageTitle>} />
          <Route path="/my-tickets" element={<PageTitle title="My Tickets"><MyTickets /></PageTitle>} />
          <Route path="/movies" element={<PageTitle title="All Movies"><Movies /></PageTitle>} />
          <Route path="/theaters" element={<PageTitle title="Theaters"><Theaters /></PageTitle>} />
          <Route path="/theater/:id" element={<PageTitle title="Theater Showtimes"><TheaterDetails /></PageTitle>} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <PageTitle title="Admin Panel"><AdminPanel /></PageTitle>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
  );
}

export default App;
