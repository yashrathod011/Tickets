import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import axios from 'axios';
import { Loader2 } from 'lucide-react';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Tickets | Home";
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);
        setMovies(response.data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Failed to load movies. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-highlight" size={48} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Casting the blockbusters...</p>
      </div>
    );
  }

  const nowPlaying = movies.filter(m => m.status === 'Now Playing');
  const comingSoon = movies.filter(m => m.status === 'Coming Soon');
  const heroMovie = movies.find(m => m.title === "Oppenheimer") || movies[0];

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-highlight/30">
      <Navbar />

      <main className="pt-[72px]">
        {/* Hero Section featuring established movie */}
        {heroMovie && (
          <Hero
            id={heroMovie._id}
            title={heroMovie.title}
            description={heroMovie.description}
            backdrop={heroMovie.backdrop}
            trailerUrl={heroMovie.trailerUrl}
          />
        )}

        {/* Dynamic Movie Rows */}
        <div className="relative z-20 -mt-20 bg-black/50 backdrop-blur-3xl rounded-t-[40px] border-t border-white/10 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.8)]">
          <MovieRow title="Now Playing" movies={nowPlaying} />
          <MovieRow title="Coming Soon" movies={comingSoon} />

          {/* Additional Premium Section (Trending) */}
          <div className="px-12 py-12">
            <div className="rounded-3xl p-12 bg-gradient-to-br from-secondary to-accent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity bg-slate-800">
                {heroMovie && (
                  <img
                    src={heroMovie.poster}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-150 rotate-12"
                  />
                )}
              </div>

              <div className="relative z-10 max-w-xl">
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Exclusive Membership</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Join the Tickets premium circle and get 20% off on every booking,
                  exclusive early access to blockbusters, and free popcorn refills.
                </p>
                <button className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-white/90 transition-all uppercase tracking-widest text-sm shadow-xl shadow-black/20">
                  Join the Club
                </button>
              </div>
            </div>
          </div>

          <footer className="px-12 py-12 border-t border-white/5 text-center text-gray-500 text-sm">
            <p>© 2026 Tickets Movie Booking. All Rights Reserved.</p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Support</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Home;
