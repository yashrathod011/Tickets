import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Ticket } from 'lucide-react';

const Hero = ({ id, title, description, backdrop, trailerUrl }) => {
  const navigate = useNavigate();
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-end">
      {/* Background Image with Slow Zoom Animation */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
          src={backdrop}
          alt={title}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
        />
        {/* Richer Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-highlight/10 mix-blend-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-24 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col items-start gap-3 mb-6"
          >
            <div>
              <span className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/40 text-amber-400 text-xs md:text-sm font-black rounded-lg tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                Trending #1
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 bg-highlight/20 border border-highlight/30 text-highlight text-[10px] font-black rounded-lg tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_0_15px_rgba(233,69,96,0.3)]">
                Now Showing
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                Featured Premiere
              </span>
            </div>
          </motion.div>

          {/* Dynamic Typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1] italic uppercase drop-shadow-2xl">
            {title}
          </h1>

          <div className="border-l-4 border-highlight pl-5 mb-10">
            <p className="text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl line-clamp-3">
              {description}
            </p>
          </div>

          {/* Responsive Buttons with Microinteractions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/book/${id}`)}
              className="w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-4 bg-highlight text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-highlight hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(233,69,96,0.4)] hover:shadow-[0_0_30px_rgba(233,69,96,0.6)]"
            >
              <Ticket size={20} />
              Book Tickets
            </button>
            <button
              onClick={() => trailerUrl ? window.open(trailerUrl, '_blank') : alert('Trailer not available')}
              className="w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-4 bg-white/5 text-white font-bold tracking-widest uppercase text-sm rounded-xl backdrop-blur-md hover:bg-white/10 transition-all border border-white/10 hover:border-white/30"
            >
              <Play size={20} fill="currentColor" />
              Watch Trailer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
