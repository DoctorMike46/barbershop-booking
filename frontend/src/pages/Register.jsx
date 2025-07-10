import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        telefono: '',
        role: 'USER'
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:8080/api/auth/register', form);
            alert('Registrazione effettuata con successo!');
            navigate('/login');
        } catch (err) {
            setError('Errore durante la registrazione.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-10 w-full max-w-md shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Registrati</h2>

                {error && (
                    <div className="text-red-400 text-sm text-center mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-white text-sm mb-1">Nome e Cognome</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder=""
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder="email@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white text-sm mb-1">Telefono</label>
                        <input
                            type="text"
                            name="telefono"
                            className="w-full p-2 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                            placeholder=""
                            value={form.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Se vuoi permettere la selezione del ruolo */}
                    {/* <div>
            <label className="block text-white text-sm mb-1">Ruolo</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="USER">Utente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div> */}

                    <button
                        type="submit"
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded transition duration-200"
                    >
                        Registrati
                    </button>
                </form>

                <p className="text-sm text-white/70 text-center mt-5">
                    Hai già un account?{' '}
                    <Link to="/login" className="text-white underline hover:text-gray-200">
                        Accedi
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
