import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('manage-movies');

    // Movie Form State
    const [movieForm, setMovieForm] = useState({
        title: '',
        description: '',
        fullDescription: '',
        genre: '',
        rating: '',
        duration: '',
        releaseDate: '',
        poster: '',
        backdrop: '',
        trailerUrl: '',
        status: 'Now Playing',
        cast: [{ name: '', role: '' }]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentMovieId, setCurrentMovieId] = useState(null);

    // Bookings & Users State
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState({
        movieId: '',
        date: '',
        time: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMovies();
        if (activeTab === 'view-bookings') {
            fetchBookings();
        } else if (activeTab === 'manage-users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchMovies = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/movies');
            setMovies(res.data);
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    };

    const handleEditClick = (movie) => {
        setMovieForm({
            title: movie.title,
            description: movie.description,
            fullDescription: movie.fullDescription,
            genre: movie.genre,
            rating: movie.rating,
            duration: movie.duration,
            releaseDate: movie.releaseDate,
            poster: movie.poster,
            backdrop: movie.backdrop,
            trailerUrl: movie.trailerUrl || '',
            status: movie.status,
            cast: movie.cast.length > 0 ? movie.cast : [{ name: '', role: '' }]
        });
        setIsEditing(true);
        setCurrentMovieId(movie._id);
        setMessage({ type: '', text: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentMovieId(null);
        setMovieForm({
            title: '',
            description: '',
            fullDescription: '',
            genre: '',
            rating: '',
            duration: '',
            releaseDate: '',
            poster: '',
            backdrop: '',
            trailerUrl: '',
            status: 'Now Playing',
            cast: [{ name: '', role: '' }]
        });
    };

    const handleDeleteMovie = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/movies/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setMessage({ type: 'success', text: 'Movie deleted successfully!' });
                fetchMovies();
                if (currentMovieId === id) {
                    handleCancelEdit();
                }
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Error deleting movie' });
            }
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: { 'x-auth-token': token }
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? All their associated data might be affected.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setMessage({ type: 'success', text: 'User deleted successfully!' });
                fetchUsers();
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Error deleting user' });
            }
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking? This will free up the seats.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setMessage({ type: 'success', text: 'Booking cancelled successfully!' });
                fetchBookings();
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Error cancelling booking' });
            }
        }
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { movieId, date, time } = filter;
            let url = `http://localhost:5000/api/bookings/admin/all?`;
            if (movieId) url += `movieId=${movieId}&`;
            if (date) url += `date=${date}&`;
            if (time) url += `time=${time}&`;

            const res = await axios.get(url, {
                headers: { 'x-auth-token': token }
            });
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const sanitizedForm = { ...movieForm };
            delete sanitizedForm._id;
            delete sanitizedForm.__v;

            // Clean cast members
            if (sanitizedForm.cast) {
                sanitizedForm.cast = sanitizedForm.cast.map(m => ({
                    name: m.name,
                    role: m.role
                }));
            }

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/movies/${currentMovieId}`, sanitizedForm, {
                    headers: { 'x-auth-token': token }
                });
                setMessage({ type: 'success', text: 'Movie updated successfully!' });
            } else {
                await axios.post('http://localhost:5000/api/movies', sanitizedForm, {
                    headers: { 'x-auth-token': token }
                });
                setMessage({ type: 'success', text: 'Movie added successfully!' });
            }

            handleCancelEdit();
            fetchMovies();
        } catch (err) {
            const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Error processing movie';
            setMessage({ type: 'error', text: errorMsg });
            console.error('Submission error:', err.response?.data);
        }
    };

    const handleCastChange = (index, field, value) => {
        const newCast = [...movieForm.cast];
        newCast[index][field] = value;
        setMovieForm({ ...movieForm, cast: newCast });
    };

    const addCastMember = () => {
        setMovieForm({ ...movieForm, cast: [...movieForm.cast, { name: '', role: '' }] });
    };

    const removeCastMember = (index) => {
        const newCast = movieForm.cast.filter((_, i) => i !== index);
        setMovieForm({ ...movieForm, cast: newCast });
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 font-serif w-full max-w-[100vw] overflow-hidden">
            {/* Sidebar */}
            <div className="w-full lg:w-64 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 shadow-sm z-10 lg:h-screen lg:sticky top-0">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight cursor-pointer" onClick={() => window.location.href = '/'}>
                    Admin <span className="text-indigo-600">Panel</span>
                </h1>

                <nav className="flex flex-row lg:flex-col gap-2 lg:gap-4 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
                    <button
                        onClick={() => setActiveTab('manage-movies')}
                        className={`shrink-0 whitespace-nowrap flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'manage-movies' ? 'bg-indigo-50 text-indigo-600 border border-slate-200 shadow-lg shadow-sm' : 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600'}`}
                    >
                        <span>🎬</span> Manage Movies
                    </button>
                    <button
                        onClick={() => setActiveTab('view-bookings')}
                        className={`shrink-0 whitespace-nowrap flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'view-bookings' ? 'bg-indigo-50 text-indigo-600 border border-slate-200 shadow-lg shadow-sm' : 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600'}`}
                    >
                        <span>📅</span> View Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('manage-users')}
                        className={`shrink-0 whitespace-nowrap flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'manage-users' ? 'bg-indigo-50 text-indigo-600 border border-slate-200 shadow-lg shadow-sm' : 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600'}`}
                    >
                        <span>👥</span> Manage Users
                    </button>
                </nav>

                <div className="hidden lg:block mt-auto p-4 bg-indigo-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-indigo-500 uppercase font-bold mb-1 tracking-widest">Logged in as</p>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full min-w-0 max-w-full">
                {activeTab === 'manage-movies' && (
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 items-start">
                            {/* Form Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="mb-4">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">
                                        {isEditing ? 'Edit Movie' : 'Add New Movie'}
                                    </h2>
                                    <p className="text-indigo-500 font-medium">
                                        {isEditing ? `Modifying: ${movieForm.title}` : 'Fill in the details to add a new movie to the catalog.'}
                                    </p>
                                </div>

                                {message.text && (
                                    <div className={`p-4 mb-6 rounded-xl border animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleMovieSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white p-4 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-indigo-600 uppercase tracking-widest">Movie Title</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                                            placeholder="e.g. Inception"
                                            value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Genre</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="e.g. Sci-Fi, Action"
                                            value={movieForm.genre} onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-600">Short Description</label>
                                        <textarea
                                            required rows="2"
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="Brief hook for the movie cards..."
                                            value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-600">Full Description</label>
                                        <textarea
                                            required rows="4"
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="Detailed synopsis for the movie details page..."
                                            value={movieForm.fullDescription} onChange={(e) => setMovieForm({ ...movieForm, fullDescription: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Poster URL</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="Link to poster image"
                                            value={movieForm.poster} onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Backdrop URL</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="Link to backdrop image"
                                            value={movieForm.backdrop} onChange={(e) => setMovieForm({ ...movieForm, backdrop: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Duration (e.g. 2h 28m)</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Rating (e.g. 8.8)</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={movieForm.rating} onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Release Date</label>
                                        <input
                                            type="text" required
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="e.g. 16 July 2010"
                                            value={movieForm.releaseDate} onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-slate-600">Status</label>
                                        <select
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            value={movieForm.status} onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                                        >
                                            <option value="Now Playing">Now Playing</option>
                                            <option value="Coming Soon">Coming Soon</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-600">Trailer URL (YouTube Link)</label>
                                        <input
                                            type="text"
                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                                            value={movieForm.trailerUrl} onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                                        />
                                    </div>

                                    {/* Cast Section */}
                                    <div className="md:col-span-2 mt-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
                                            <label className="text-sm font-medium text-slate-600 uppercase tracking-wider text-xs">Movie Cast</label>
                                            <button
                                                type="button"
                                                onClick={addCastMember}
                                                className="text-[10px] uppercase font-bold bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-indigo-700/30 transition-all"
                                            >
                                                + Add Member
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {movieForm.cast.map((member, index) => (
                                                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <input
                                                            type="text" placeholder="Name"
                                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                            value={member.name} onChange={(e) => handleCastChange(index, 'name', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <input
                                                            type="text" placeholder="Role"
                                                            className="bg-white border border-slate-200 rounded-lg p-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                            value={member.role} onChange={(e) => handleCastChange(index, 'role', e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCastMember(index)}
                                                        className="bg-rose-500/10 text-rose-600 p-3 rounded-lg hover:bg-rose-500/20 transition-all"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all shadow-lg shadow-sm active:scale-95"
                                        >
                                            {isEditing ? 'Update Movie Info' : 'Publish Movie'}
                                        </button>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="px-8 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl border border-slate-200 transition-all active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Movie List Section */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight text-xs text-slate-500">Existing Movies</h3>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-h-[800px] overflow-y-auto custom-scrollbar">
                                    <div className="flex flex-col divide-y divide-slate-100">
                                        {movies.map(movie => (
                                            <div key={movie._id} className={`p-4 flex gap-4 items-center group hover:bg-indigo-50 transition-all cursor-default ${currentMovieId === movie._id ? 'bg-indigo-50 border-l-2 border-indigo-600' : ''}`}>
                                                <img src={movie.poster} alt={movie.title} className="w-12 h-16 rounded-md object-cover shadow-md grayscale group-hover:grayscale-0 transition-all" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-900 truncate">{movie.title}</h4>
                                                    <p className="text-xs text-indigo-500 font-medium">{movie.genre}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(movie)}
                                                        className="p-2.5 bg-slate-100 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMovie(movie._id)}
                                                        className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'view-bookings' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">Theater Bookings</h2>
                                <p className="text-indigo-500 font-medium tracking-tight">Monitor all ticket sales and customer bookings.</p>
                            </div>
                            <button
                                onClick={fetchBookings}
                                className="bg-slate-100 hover:bg-slate-200 text-indigo-600 px-4 py-2 rounded-lg border border-slate-200 transition-all font-bold text-sm"
                            >
                                🔄 Refresh Report
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Filter by Movie</label>
                                <select
                                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none"
                                    value={filter.movieId} onChange={(e) => setFilter({ ...filter, movieId: e.target.value })}
                                >
                                    <option value="">All Movies</option>
                                    {movies.map(m => (
                                        <option key={m._id} value={m._id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Filter by Date</label>
                                <input
                                    type="text" placeholder="e.g. 7 Apr"
                                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none"
                                    value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Filter by Time</label>
                                <input
                                    type="text" placeholder="e.g. 02:30 PM"
                                    className="bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none"
                                    value={filter.time} onChange={(e) => setFilter({ ...filter, time: e.target.value })}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={fetchBookings}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-lg transition-all uppercase text-xs tracking-widest shadow-lg shadow-sm"
                                >
                                    Filter Report
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">ID</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">Movie</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">Showtime</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">Seats</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">Amount</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {bookings.length > 0 ? bookings.map(booking => (
                                            <tr key={booking._id} className="hover:bg-slate-50 transition-all">
                                                <td className="p-4 font-mono text-xs text-slate-600">{booking._id.substring(0, 8)}...</td>
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">{booking.movie.title}</div>
                                                    <div className="text-xs text-slate-500">{booking.theater.name}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    <div>{booking.date}</div>
                                                    <div className="text-indigo-600">{booking.time}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    <span className="bg-white border border-slate-200 px-2 py-1 rounded text-xs">
                                                        {booking.seats.join(', ')}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm font-bold text-emerald-400">₹{booking.totalPrice}</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="p-2 bg-rose-500/10 text-rose-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all text-xs font-bold"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="p-12 text-center text-slate-500">
                                                    No bookings found for the selected criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'manage-users' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">User Management</h2>
                            <p className="text-indigo-500 font-medium tracking-tight">Review and manage platform users.</p>
                        </div>

                        {message.text && (
                            <div className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                {message.text}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">User</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest text-center">Role</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest">Joined</th>
                                            <th className="p-4 text-xs font-black text-indigo-600 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map(u => (
                                            <tr key={u._id} className="hover:bg-slate-50 transition-all">
                                                <td className="p-4">
                                                    <div className="font-medium text-slate-900">{u.name}</div>
                                                    <div className="text-xs text-slate-500">{u.email}</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        disabled={u._id === user?.id}
                                                        className={`p-2 bg-rose-500/10 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all text-xs font-bold ${u._id === user?.id ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
