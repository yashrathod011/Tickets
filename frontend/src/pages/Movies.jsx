import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { Loader2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        document.title = "Tickets | Movies";
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/movies`);
                setMovies(response.data);
            } catch (err) {
                console.error('Failed to fetch movies:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || movie.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-highlight" size={48} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Casting the blockbusters...</p>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-highlight/30 pb-20">
            <Navbar />

            <main className="pt-28 px-4 md:px-8 md:px-4 md:px-12 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">The Gallery</h1>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">Explore the latest cinematic masterpieces</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-highlight transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search titles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-highlight/30 transition-all w-64"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                            {['All', 'Now Playing', 'Coming Soon'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${filter === f ? 'bg-highlight text-white shadow-lg shadow-highlight/20' : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Movie Grid */}
                <AnimatePresence mode="wait">
                    {filteredMovies.length > 0 ? (
                        <motion.div
                            key={filter + searchQuery}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                        >
                            {filteredMovies.map((movie, index) => (
                                <motion.div
                                    key={movie._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <MovieCard movie={movie} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center"
                        >
                            <p className="text-gray-500 font-bold uppercase tracking-widest italic">No movies found matching your criteria</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Movies;
