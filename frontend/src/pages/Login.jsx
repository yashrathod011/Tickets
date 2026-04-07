import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Ticket, Code, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, error, setError } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="bg-black min-h-screen text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-highlight/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl relative"
            >
                {/* Back button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div className="flex flex-col items-center mb-10 pt-4">
                    <div className="bg-highlight p-3 rounded-2xl mb-4 shadow-lg shadow-highlight/20">
                        <Ticket size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm font-medium">Log in to book your next cinematic experience</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest pl-4">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">Password</label>
                            <button type="button" className="text-[10px] text-highlight hover:text-white font-black uppercase tracking-widest transition-colors leading-none">Forgot?</button>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-highlight text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-highlight/20 mb-8 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <span className="relative z-10 px-4 bg-transparent text-[10px] text-gray-600 uppercase font-bold tracking-widest backdrop-blur-3xl">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold">
                        <Search size={18} /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold">
                        <Code size={18} /> GitHub
                    </button>
                </div>

                <p className="text-center text-xs text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-highlight cursor-pointer font-bold hover:underline" onClick={() => setError(null)}>Create account</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
