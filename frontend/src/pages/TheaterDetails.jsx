import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Loader2, MapPin, Calendar, Clock, Ticket, ChevronLeft, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const TheaterDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [theater, setTheater] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheaterDetails = async () => {
            try {
                // Fetch theater info
                const theaterRes = await axios.get(`${API_URL}/api/theaters`);
                const currentTheater = theaterRes.data.find(t => t._id === id);
                setTheater(currentTheater);

                // Fetch showtimes for this theater
                const showtimesRes = await axios.get(`${API_URL}/api/theaters/${id}/showtimes`);
                setShowtimes(showtimesRes.data);
            } catch (err) {
                console.error('Failed to fetch theater details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTheaterDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-highlight" size={48} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs tracking-widest">Opening the curtains...</p>
            </div>
        );
    }

    if (!theater) return <div className="text-white">Theater not found</div>;

    // Group showtimes by movie
    const groupedShowtimes = showtimes.reduce((acc, show) => {
        const movieId = show.movie._id;
        if (!acc[movieId]) {
            acc[movieId] = {
                details: show.movie,
                slots: []
            };
        }
        acc[movieId].slots.push(show);
        return acc;
    }, {});

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-highlight/30 pb-20">
            <Navbar />
            
            <main className="pt-24 relative overflow-hidden">
                {/* Visual Header */}
                <div className="absolute top-0 left-0 right-0 h-[40vh] overflow-hidden -z-0">
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-highlight/10 via-transparent to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-4 md:px-12">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group bg-white/5 w-fit px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-3xl"
                    >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={16} /> 
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Cinemas</span>
                    </button>

                    {/* Theater Brand Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-highlight rounded-2xl shadow-lg shadow-highlight/20">
                                <Monitor size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                                    {theater.name}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">
                                    <MapPin size={14} className="text-highlight" />
                                    {theater.location}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Movie Schedule */}
                    <div className="space-y-12">
                        <h2 className="text-[10px] font-black text-highlight uppercase tracking-[0.4em] mb-8 opacity-80 pl-2 border-l-2 border-highlight">Today's Schedule</h2>
                        
                        {Object.values(groupedShowtimes).map((group, idx) => (
                            <motion.div 
                                key={group.details._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row p-6 gap-8 hover:bg-white/[0.07] transition-all"
                            >
                                {/* Movie Preview */}
                                <div className="w-full md:w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl border border-white/10 flex-shrink-0">
                                    <img 
                                        src={group.details.poster} 
                                        alt={group.details.title} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <h3 className="text-2xl font-black uppercase italic tracking-tight text-white leading-none">{group.details.title}</h3>
                                        <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-bold">{group.details.genre.split(' / ')[0]}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-8 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {group.details.duration}
                                        </div>
                                    </div>

                                    {/* Showtime Chips */}
                                    <div className="flex flex-wrap gap-4">
                                        {group.slots.map((slot) => (
                                            <button 
                                                key={slot._id}
                                                onClick={() => navigate(`/book/${group.details._id}?theater=${theater._id}&time=${slot.startTime}&screen=${slot.screen}`)}
                                                className="group relative bg-white/5 border border-white/10 px-6 py-4 rounded-2xl hover:border-highlight/50 hover:bg-highlight/10 transition-all text-center min-w-[120px]"
                                            >
                                                <p className="text-xl font-black text-white group-hover:text-highlight transition-colors">{slot.startTime}</p>
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{slot.screen}</p>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Ticket size={12} className="text-highlight" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {Object.keys(groupedShowtimes).length === 0 && (
                            <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                <p className="text-gray-500 font-bold uppercase tracking-widest italic">No shows scheduled for today at this venue.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TheaterDetails;
