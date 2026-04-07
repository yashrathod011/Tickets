import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Loader2, MapPin, Monitor, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TheaterCard = ({ theater, onViewShowtimes }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group overflow-hidden relative"
    >
        {/* Subtle Brand Watermark */}
        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Monitor size={160} className="text-white" />
        </div>

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-highlight transition-colors mb-2">
                        {theater.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <MapPin size={12} className="text-highlight" />
                        {theater.location}
                    </div>
                </div>
                <div className="bg-highlight/20 text-highlight border border-highlight/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest leading-none">
                    From ₹{theater.basePrice}
                </div>
            </div>

            {/* Screen Types */}
            <div className="mb-10">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.25em] mb-4">Available Experiences</p>
                <div className="flex flex-wrap gap-2">
                    {theater.screens.map(screen => (
                        <span key={screen.id} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:border-highlight/40 transition-all cursor-default">
                            {screen.type}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={() => onViewShowtimes(theater._id)}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-highlight hover:shadow-xl hover:shadow-highlight/20 transition-all uppercase tracking-widest text-xs group-hover:scale-[1.02]"
            >
                View Showtimes
                <ChevronRight size={16} />
            </button>
        </div>
    </motion.div>
);

const Theaters = () => {
    const navigate = useNavigate();
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleViewShowtimes = (id) => {
        navigate(`/theater/${id}`);
    };

    useEffect(() => {
        document.title = "Tickets | Theaters";
        const fetchTheaters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/theaters');
                setTheaters(response.data);
            } catch (err) {
                console.error('Failed to fetch theaters:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTheaters();
    }, []);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-highlight" size={48} />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs tracking-widest">Locating Cinemas...</p>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-highlight/30 pb-20">
            <Navbar />

            <main className="pt-28 px-4 md:px-8 md:px-4 md:px-12 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">The Cinema Network</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">Select your premium destination</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {theaters.map((theater, index) => (
                        <motion.div
                            key={theater._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <TheaterCard theater={theater} onViewShowtimes={handleViewShowtimes} />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Theaters;

