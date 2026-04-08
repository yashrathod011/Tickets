import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, MapPin, CreditCard, CheckCircle2, Ticket, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const BookingSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const booking = location.state;

    if (!booking) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center">
                <p>No booking details found.</p>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-highlight rounded-xl text-white">Back to Home</button>
            </div>
        );
    }

    const { movie, theater, date, time, seats, totalPrice, basePrice, feePerSeat } = booking;
    const ticketFare = seats.length * basePrice;
    const totalFees = seats.length * feePerSeat;

    const handleConfirm = async () => {
        if (!user) {
            // Redirect to login if not logged in
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const bookingData = {
                user: user.id,
                movie: {
                    title: movie.title,
                    poster: movie.poster,
                    id: movie._id
                },
                theater: {
                    name: theater.name,
                    location: theater.location,
                    id: theater._id
                },
                date,
                time,
                seats,
                totalPrice
            };

            await axios.post(`${API_URL}/api/bookings`, bookingData);
            setIsConfirmed(true);
        } catch (err) {
            console.error('Booking failed:', err);
            setError('Failed to confirm booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isConfirmed) {
        return (
            <div className="bg-black min-h-screen text-white overflow-hidden">
                <Navbar />
                <main className="pt-32 flex flex-col items-center justify-center px-4 md:px-8 text-center max-w-lg mx-auto">
                    <motion.div 
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="w-24 h-24 bg-highlight rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-highlight/40"
                    >
                        <CheckCircle2 size={48} className="text-white" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-black italic uppercase tracking-tighter mb-4"
                    >
                        Booking Confirmed
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 mb-12"
                    >
                        Your tickets for <span className="text-white font-bold">{movie.title}</span> have been booked successfully. Explore your dashboard to see your tickets.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="w-full space-y-4"
                    >
                        <button 
                            onClick={() => navigate('/my-tickets')}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform shadow-xl shadow-white/10"
                        >
                            View My Tickets
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
                        >
                            Home
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pb-20">
            <Navbar />
            
            <main className="pt-24 px-4 md:px-8 md:px-20 max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold"
                    >
                        <AlertCircle size={20} /> {error}
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-2 gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div>
                            <h2 className="text-highlight text-xs font-black uppercase tracking-[0.3em] mb-4">Final Summary</h2>
                            <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-6 leading-none">{movie.title}</h1>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                        <MapPin className="text-highlight" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-0.5">{theater.name}</p>
                                        <p className="text-white font-bold">{theater.location}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                            <Calendar className="text-highlight" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-0.5">Date</p>
                                            <p className="text-white font-bold">{date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                            <Clock className="text-highlight" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-0.5">Time</p>
                                            <p className="text-white font-bold">{time}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                                        <Ticket className="text-highlight" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-0.5">Seats ({seats.length})</p>
                                        <p className="text-white font-bold">{seats.join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 h-fit lg:sticky lg:top-32"
                    >
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                            <CreditCard size={16} /> Bill Details
                        </h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-gray-400">
                                <span>Ticket Fare ({seats.length} Tickets)</span>
                                <span className="font-bold text-white">₹{ticketFare}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="flex items-center gap-2">Platform Fees</span>
                                <span className="font-bold text-white">₹{totalFees}</span>
                            </div>
                            <div className="h-px bg-white/10 my-4" />
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Total Amount</p>
                                    <p className="text-white text-3xl font-black">₹{totalPrice}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Inclusive of all taxes</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full py-6 bg-highlight text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-highlight/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default BookingSummary;
