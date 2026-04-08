import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Loader2, Inbox, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const MyTickets = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/bookings/user/${user.id}`);
                setBookings(response.data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
            setCancellingId(bookingId);
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/api/bookings/${bookingId}`, {
                    headers: { 'x-auth-token': token }
                });
                // Remove from local state
                setBookings(bookings.filter(b => b._id !== bookingId));
            } catch (err) {
                console.error('Failed to cancel booking:', err);
                const errorDetail = err.response?.data?.details || err.response?.data?.message || 'Failed to cancel booking';
                alert(`Error: ${errorDetail}`);
            } finally {
                setCancellingId(null);
            }
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-black min-h-screen text-white pb-20">
            <Navbar />
            
            <main className="pt-32 px-4 md:px-8 md:px-20 max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-highlight text-xs font-black uppercase tracking-[0.3em] mb-4">User Dashboard</h2>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">My Tickets</h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{bookings.length} Total Bookings</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-highlight" size={48} />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Retrieving your tickets...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-white/10 rounded-3xl text-center px-4 md:px-8">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Inbox className="text-gray-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No tickets found</h3>
                        <p className="text-gray-500 mb-8 max-w-xs">You haven't booked any tickets yet. Start exploring the latest movies!</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="px-4 md:px-8 py-4 bg-highlight text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                        >
                            Explore Movies
                        </button>
                    </div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid gap-6"
                    >
                        {bookings.map((booking) => (
                            <motion.div 
                                key={booking._id}
                                variants={item}
                                className="group bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-highlight/5 blur-3xl -z-10 group-hover:bg-highlight/10 transition-colors" />
                                
                                {/* Poster */}
                                <div className="w-24 h-36 md:w-32 md:h-48 rounded-xl overflow-hidden shadow-2xl shrink-0">
                                    <img 
                                        src={booking.movie.poster} 
                                        alt={booking.movie.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2 group-hover:text-highlight transition-colors leading-none">
                                            {booking.movie.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin size={14} className="text-highlight" />
                                            <span className="text-xs font-bold uppercase tracking-widest">{booking.theater.name}, {booking.theater.location}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Date</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-white/40" />
                                                <span className="text-sm font-bold">{booking.date}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Time</p>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-white/40" />
                                                <span className="text-sm font-bold">{booking.time}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Seats</p>
                                            <div className="flex items-center gap-2">
                                                <Ticket size={14} className="text-white/40" />
                                                <span className="text-sm font-bold">{booking.seats.join(', ')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Paid</p>
                                            <span className="text-sm font-black text-highlight italic leading-none">₹{booking.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Tag & Actions */}
                                <div className="hidden md:flex flex-col items-end gap-3">
                                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Confirmed
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={cancellingId === booking._id}
                                            className={`p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 ${cancellingId === booking._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title="Cancel Ticket"
                                        >
                                            {cancellingId === booking._id ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={20} />
                                            )}
                                        </button>
                                        <button className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default MyTickets;
