import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUserRoleFromToken } from '../utils/auth';
import ClientList from "../components/ClientList";

const Dashboard = () => {
    const role = getUserRoleFromToken();
    const [section, setSection] = useState('home');

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Navbar fissa in alto */}
            <div className="fixed top-0 left-0 right-0 z-50 h-20">
                <Navbar />
            </div>

            {/* Sidebar fissa a sinistra sotto la navbar */}
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-64 h-[400px] z-40">
                <Sidebar role={role} section={section} setSection={setSection} />
            </div>

            {/* Contenuto scrollabile a destra della sidebar */}
            <div className="ml-64 mt-20 h-[calc(100vh-5rem)] overflow-y-auto px-8 pt-6 transition-all duration-300">
                {section === 'home' && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                        <p>Benvenuto nella tua area personale come <strong>{role}</strong>.</p>
                    </>
                )}

                {section === 'clienti' && <ClientList />}
            </div>
        </div>
    );
};

export default Dashboard;
