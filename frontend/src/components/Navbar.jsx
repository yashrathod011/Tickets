import React, { useState } from 'react';
import { Search, User, Ticket, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-highlight p-1.5 rounded-lg">
          <Ticket className="text-white" size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tighter text-white">TICKETS</span>
      </Link>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for movies, theaters..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <Link to="/movies" className="text-xs md:text-sm font-bold text-gray-300 hover:text-white transition-all uppercase tracking-widest md:px-2">Movies</Link>
        <Link to="/theaters" className="text-xs md:text-sm font-bold text-gray-300 hover:text-white transition-all uppercase tracking-widest md:px-2">Theaters</Link>

        
        <div className="relative">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all group"
              >
                <div className="h-8 w-8 rounded-full bg-highlight font-bold flex items-center justify-center text-xs text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Logged in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link 
                      to="/my-tickets"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    >
                      <LayoutDashboard size={18} className="group-hover:text-highlight transition-colors" />
                      My Tickets
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={18} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="h-8 w-8 rounded-full bg-accent flex items-center justify-center border border-white/20 cursor-pointer hover:scale-105 transition-transform">
              <User size={18} className="text-white" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
