import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Initial row shows 2-4 movies based on screen size, but we'll use 4 for desktop for now
  const initialMovies = movies.slice(0, 4);
  const remainingMovies = movies.slice(4);

  return (
    <div className="px-12 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-4">
            <span className="w-2 h-8 bg-highlight rounded-full" />
            {title}
        </h2>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-highlight transition-colors uppercase tracking-widest"
        >
          {isExpanded ? 'Collapse' : 'Explore All'}
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Grid Layout with Framer Motion */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
      >
        {/* Initially visible movies */}
        {movies.map((movie, index) => {
           if (!isExpanded && index >= 6) return null; // Show up to 6 on one row or something
           return (
            <motion.div 
              key={movie._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
           );
        })}
      </motion.div>
    </div>
  );
};

export default MovieRow;
