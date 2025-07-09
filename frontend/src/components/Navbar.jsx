import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiSettings, FiLogOut } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import { GiRazor } from 'react-icons/gi';

const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="mx-4 mt-4 rounded-2xl px-6 h-20 bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between text-white shadow-lg z-50 relative">
            {/* Logo + Icona */}
            <div className="flex items-center gap-3">
                <GiRazor className="text-4xl text-white animate-spin-slow" />
                <span className="text-xl font-semibold tracking-wide">La barberia di Luca</span>
            </div>

            {/* Profilo */}
            <div className="relative">
                <FaUserCircle
                    className="text-3xl cursor-pointer hover:text-white/80 transition"
                    onClick={() => setShowMenu(!showMenu)}
                />

                {showMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white/10 backdrop-blur-md rounded-md shadow-lg border border-white/10 z-50">
                        <ul className="py-2 text-sm">
                            <li className="px-4 py-2 hover:bg-white/20 flex items-center gap-2 cursor-pointer">
                                <BsPerson /> Profilo
                            </li>
                            <li className="px-4 py-2 hover:bg-white/20 flex items-center gap-2 cursor-pointer">
                                <FiSettings /> Impostazioni
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-red-500/40 flex items-center gap-2 cursor-pointer text-red-300"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }}
                            >
                                <FiLogOut /> Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
