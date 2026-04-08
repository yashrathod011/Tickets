import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Loader2 } from 'lucide-react';
import { getBookingDays, SHOW_SLOTS } from '../utils/dummyData';
import Navbar from '../components/Navbar';
import SeatGrid from '../components/SeatGrid';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || `${API_URL}`;
const SeatSelection = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Parse query params for pre-selection
    const qTheaterId = searchParams.get('theater');
    const qTime = searchParams.get('time');
    const qScreen = searchParams.get('screen');

    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getBookingDays()[0].fullDate);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [selectedTime, setSelectedTime] = useState(qTime || SHOW_SLOTS[0]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Initial data fetch: Movie and Theaters
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, theatersRes] = await Promise.all([
                    axios.get(`${API_URL}/api/movies/${id}`),
                    axios.get(`${API_URL}/api/theaters`)
                ]);
                setMovie(movieRes.data);
                setTheaters(theatersRes.data);
                
                // Handle pre-selection from query params
                if (qTheaterId) {
                    const matchedTheater = theatersRes.data.find(t => t._id === qTheaterId);
                    if (matchedTheater) {
                        setSelectedTheater(matchedTheater);
                    } else if (theatersRes.data.length > 0) {
                        setSelectedTheater(theatersRes.data[0]);
                    }
                } else if (theatersRes.data.length > 0) {
                    setSelectedTheater(theatersRes.data[0]);
                }
            } catch (err) {
                console.error('Failed to fetch seat selection data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, qTheaterId]);


    // Fetch occupied seats for specific showtime
    useEffect(() => {
        const fetchOccupiedSeats = async () => {
            if (!movie || !selectedTheater) return;
            setBookingLoading(true);
            try {
                const response = await axios.get(`${API_URL}/api/bookings/occupied`, {
                    params: {
                        movieId: movie._id,
                        theaterId: selectedTheater._id || selectedTheater.id,
                        date: selectedDate,
                        time: selectedTime
                    }
                });
                setOccupiedSeats(response.data);
            } catch (err) {
                console.error('Failed to fetch occupied seats:', err);
                setOccupiedSeats([]);
            } finally {
                setBookingLoading(false);
            }
        };

        fetchOccupiedSeats();
        setSelectedSeats([]);
    }, [movie, selectedTheater, selectedDate, selectedTime]);

    if (loading) {
        return (
            <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-highlight" size={48} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Preparing the house...</p>
            </div>
        );
    }

    if (!movie || theaters.length === 0) return null;

    const bookingDays = getBookingDays();
    const feePerSeat = 40;
    const totalPrice = (selectedSeats.length * (selectedTheater?.basePrice || 0)) + (selectedSeats.length > 0 ? feePerSeat * selectedSeats.length : 0);

    const handleProceed = () => {
        navigate('/booking-summary', {
            state: {
                movie,
                theater: selectedTheater,
                date: selectedDate,
                time: selectedTime,
                seats: selectedSeats,
                totalPrice,
                basePrice: selectedTheater.basePrice,
                feePerSeat
            }
        });
    };

    return (
        <div className="bg-black min-h-screen text-white pb-32">
            <Navbar />
            
            <main className="pt-24 px-4 md:px-8 md:px-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase">{movie.title}</h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                             {selectedTheater?.name} | <span className="text-highlight">{selectedTime}</span>
                        </p>
                    </div>

                    <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
                        {bookingDays.map(day => (
                            <button
                                key={day.fullDate}
                                onClick={() => setSelectedDate(day.fullDate)}
                                className={`flex flex-col items-center px-6 py-3 rounded-xl transition-all duration-300 ${
                                    selectedDate === day.fullDate 
                                    ? 'bg-highlight text-white shadow-lg shadow-highlight/20 scale-105' 
                                    : 'hover:bg-white/5 text-gray-400'
                                }`}
                            >
                                <span className="text-[10px] uppercase font-bold tracking-widest mb-1">{day.label}</span>
                                <span className="text-lg font-black">{day.date}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1 space-y-8">
                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-highlight mb-6">Select Theater</h3>
                            <div className="space-y-4">
                                {theaters.map(theater => (
                                    <button
                                        key={theater._id}
                                        onClick={() => setSelectedTheater(theater)}
                                        className={`w-full text-left p-5 rounded-2xl border transition-all ${
                                            selectedTheater?._id === theater._id
                                            ? 'bg-accent/40 border-highlight shadow-lg shadow-highlight/5'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-60'
                                        }`}
                                    >
                                        <p className="font-bold">{theater.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{theater.location}</p>
                                        <p className="text-xs text-highlight font-bold mt-2 italic">₹{theater.basePrice} onwards</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-highlight mb-6">Available Slots</h3>
                            <div className="flex flex-wrap gap-3">
                                {SHOW_SLOTS.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`px-5 py-3 rounded-xl border text-sm font-bold transition-all ${
                                            selectedTime === slot
                                            ? 'bg-white text-black border-white shadow-lg'
                                            : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-400'
                                        }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4 text-blue-400 text-sm italic">
                            <Info size={20} className="shrink-0" />
                            <p>Seats are released if not booked within 10 minutes of selection.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 relative">
                        {bookingLoading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-3xl flex items-center justify-center">
                                <Loader2 className="animate-spin text-highlight" size={48} />
                            </div>
                        )}
                        <SeatGrid 
                            rows={selectedTheater?.screens[0]?.rows || 10} 
                            cols={selectedTheater?.screens[0]?.cols || 12}
                            occupiedSeats={occupiedSeats}
                            onSeatSelect={(seats) => setSelectedSeats(seats)}
                        />
                    </div>
                </div>
            </main>

            <motion.footer 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 py-6 px-4 md:px-8 md:px-20 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-between items-center z-50"
            >
                <div className="flex items-center gap-8">
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Seats Selected</p>
                        <p className="text-white font-black">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None Selection'}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Grand Total</p>
                        <p className="text-highlight text-2xl font-black italic tracking-tighter">₹{totalPrice}</p>
                    </div>
                </div>

                <button 
                    disabled={selectedSeats.length === 0 || loading}
                    onClick={handleProceed}
                    className={`px-4 md:px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${
                        selectedSeats.length > 0 && !loading
                        ? 'bg-highlight text-white hover:scale-105 shadow-xl shadow-highlight/20 cursor-pointer' 
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Proceed to Summary
                </button>
            </motion.footer>
        </div>
    );
};

export default SeatSelection;
