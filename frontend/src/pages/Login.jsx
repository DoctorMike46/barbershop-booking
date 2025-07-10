import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password,
            });

            const token = res.data.token;
            localStorage.setItem('token', token);
            alert('Login effettuato con successo!');
            navigate('/dashboard');
        } catch (err) {
            setError('Email o password errati');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

                {error && (
                    <div className="text-red-400 text-sm text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-white text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder="Inserisci la tua email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded transition duration-200"
                    >
                        Accedi
                    </button>
                </form>

                <p className="text-sm text-white/70 text-center mt-5">
                    Non hai ancora un account?{' '}
                    <Link to="/register" className="text-white underline hover:text-gray-200">
                        Registrati
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
