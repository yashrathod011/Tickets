import React, { useState } from 'react';

import { motion } from 'framer-motion';
import { Star, Users, Clock, Calendar, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    navigate(`/movie/${movie._id}`);
  };


  const topCast = movie.cast ? movie.cast.slice(0, 2).map(c => c.name).join(', ') : 'N/A';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative group cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl border border-white/10 group-hover:border-highlight/50 transition-colors bg-white/5">
        {/* Shimmer Placeholder */}
        {(imgLoading || imgError || !movie.poster) && (
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-slate-800 flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center">
              <Star size={24} className="text-white/10" />
            </div>
          </motion.div>
        )}

        {movie.poster && !imgError && (
          <img
            src={movie.poster}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImgLoading(false)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
          />
        )}


        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-4 sm:p-6 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                <Star size={14} fill="currentColor" className="text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Rating</p>
                <p className="text-sm font-bold text-white leading-none">{movie.rating} / 10</p>
              </div>
            </div>

            {/* Genre */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center border border-highlight/20">
                <Info size={14} className="text-highlight" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Genre</p>
                <p className="text-sm font-bold text-white leading-none truncate max-w-[140px]">{movie.genre}</p>
              </div>
            </div>

            {/* Cast */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
                <Users size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Top Cast</p>
                <p className="text-sm font-bold text-white leading-none truncate max-w-[140px]">{topCast}</p>
              </div>
            </div>

            {/* Runtime */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center border border-green-400/20">
                <Clock size={14} className="text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Runtime</p>
                <p className="text-sm font-bold text-white leading-none">{movie.duration}</p>
              </div>
            </div>

            {/* Release Date */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
                <Calendar size={14} className="text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Release</p>
                <p className="text-sm font-bold text-white leading-none">{movie.releaseDate || 'Soon'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2 sm:top-2 sm:right-2 z-10">
          <span className={`px-2 py-1 backdrop-blur-md border text-[10px] font-bold rounded uppercase tracking-wider ${movie.status === 'Now Playing'
              ? 'bg-green-500/20 border-green-500/30 text-green-400'
              : 'bg-highlight/20 border-highlight/30 text-highlight'
            }`}>
            {movie.status}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-white font-bold truncate group-hover:text-highlight transition-colors">{movie.title}</h3>
        <p className="text-gray-400 text-xs mt-1">
          {movie.status === 'Now Playing' ? 'UA | English' : `Coming ${movie.releaseDate}`}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
