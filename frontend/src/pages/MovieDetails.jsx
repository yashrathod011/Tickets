import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, ChevronLeft, Loader2, AlertCircle, Ticket } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(response.data);
            } catch (err) {
                console.error('Failed to fetch movie details:', err);
                setError('Movie not found or server error.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);


    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-highlight" size={48} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs tracking-widest">Loading Cinema...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-8 text-center">
                <AlertCircle size={64} className="text-red-500 mb-6 opacity-30" />
                <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Movie Not Found</h1>
                <p className="text-gray-400 mb-12 max-w-md">We couldn't find the blockbuster you're looking for. It might have been delisted or moved.</p>
                <button 
                    onClick={() => navigate('/')}
                    className="px-12 py-4 bg-highlight text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl shadow-highlight/20"
                >
                    Back to Catalog
                </button>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-highlight/30 pb-20">
            <Navbar />
            
            <main className="pt-24 relative overflow-hidden">
                {/* Cinematic Backdrop */}
                <div className="absolute top-0 left-0 right-0 h-[60vh] overflow-hidden -z-0">
                    <img 
                        src={movie.backdrop || movie.poster} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover blur-3xl opacity-30 scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group bg-white/5 w-fit px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-3xl"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={16} /> 
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Gallery</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">
                        {/* Poster Column - Significantly reduced size (max-w-xs) */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-[320px] aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 mx-auto lg:mx-0 group"
                        >
                            {(imgLoading || imgError || !movie.poster) && (
                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                    <Star size={32} className="text-white/10 animate-pulse" />
                                </div>
                            )}
                            {movie.poster && !imgError && (
                                <img 
                                    src={movie.poster} 
                                    alt={movie.title} 
                                    referrerPolicy="no-referrer"
                                    onLoad={() => setImgLoading(false)}
                                    onError={() => setImgError(true)}
                                    className={`w-full h-full object-cover transition-opacity duration-700 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        {/* Details Column */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col"
                        >
                            {/* Tags Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-highlight/20 text-highlight border border-highlight/30 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest leading-none">
                                    {movie.status}
                                </span>
                                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-md">
                                    <Star size={12} fill="#fbbf24" className="text-yellow-400" />
                                    <span className="text-xs font-black italic">{movie.rating}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-md">
                                    <Clock size={12} className="text-gray-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{movie.duration}</span>
                                </div>
                            </div>

                            {/* Title - Reduced size for sophistication */}
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic leading-[0.95] text-white">
                                {movie.title}
                            </h1>
                            
                            {/* Genre & Info */}
                            <div className="flex flex-wrap items-center gap-2 mb-10">
                                {movie.genre.split(' / ').map(g => (
                                    <span key={g} className="px-3 py-1.5 bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-default">
                                        {g}
                                    </span>
                                ))}
                                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                                <div className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                                    <Calendar size={12} />
                                    <span>{movie.releaseDate}</span>
                                </div>
                            </div>

                            {/* Description - Reduced font size for better flow */}
                            <div className="mb-12 max-w-2xl">
                                <h3 className="text-[10px] font-black mb-4 text-highlight uppercase tracking-[0.3em] opacity-80">Synopsis</h3>
                                <p className="text-gray-400 text-base md:text-lg leading-relaxed font-medium italic">
                                    {movie.fullDescription || movie.description}
                                </p>
                            </div>

                            {/* Cast - Compacted cards */}
                            <div className="mb-12">
                                <h3 className="text-[10px] font-black mb-6 text-highlight uppercase tracking-[0.3em] opacity-80">Featured Cast</h3>
                                <div className="flex flex-wrap gap-4">
                                    {movie.cast?.map(c => (
                                        <div key={c.name} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-2.5 pr-6 hover:bg-white/10 transition-all group cursor-default">
                                            <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center font-black text-white text-base border border-white/5 shadow-inner group-hover:scale-105 transition-transform uppercase">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-xs uppercase tracking-tight">{c.name}</p>
                                                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{c.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons - More refined and sharp */}
                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                <button 
                                    onClick={() => navigate(`/book/${movie._id}`)}
                                    className="flex items-center gap-2.5 px-10 py-4 bg-highlight text-white font-black rounded-2xl hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-highlight/10 uppercase tracking-[0.15em] text-xs h-fit"
                                >
                                    <Ticket size={18} />
                                    {movie.status === 'Now Playing' ? 'Secure Tickets' : 'Join the Waitlist'}
                                </button>
                                <button 
                                    onClick={() => movie.trailerUrl ? window.open(movie.trailerUrl, '_blank') : alert('Trailer not available')}
                                    className="flex items-center gap-2.5 px-10 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.15em] text-xs group h-fit"
                                >
                                    <Play size={16} fill="white" className="group-hover:scale-110 transition-transform" />
                                    Watch Trailer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MovieDetails;
