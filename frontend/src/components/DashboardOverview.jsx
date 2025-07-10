import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUsers, FiScissors, FiPackage, FiSpeaker, FiCalendar } from 'react-icons/fi';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        clients: 0,
        services: 0,
        products: 0,
        announcements: 0,
        bookings: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const [clientsRes, servicesRes, productsRes, announcementsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/services', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/products', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8080/api/announcements', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats({
                    clients: clientsRes.data.length,
                    services: servicesRes.data.length,
                    products: productsRes.data.length,
                    announcements: announcementsRes.data.length,
                    bookings: 0 // Da aggiornare quando ci sarà l'API delle prenotazioni
                });
            } catch (error) {
                console.error('Errore nel caricamento delle statistiche:', error);
            }
        };

        fetchData();
    }, []);

    const cardStyle = 'bg-white/10 border border-white/20 p-4 rounded-lg shadow-sm text-white flex flex-col items-center justify-center min-h-[120px]';

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className={cardStyle}>
                <FiUsers size={28} className="mb-1" />
                <h2 className="text-base font-semibold">Clienti</h2>
                <p className="text-xl font-bold">{stats.clients}</p>
            </div>
            <div className={cardStyle}>
                <FiScissors size={28} className="mb-1" />
                <h2 className="text-base font-semibold">Servizi</h2>
                <p className="text-xl font-bold">{stats.services}</p>
            </div>
            <div className={cardStyle}>
                <FiPackage size={28} className="mb-1" />
                <h2 className="text-base font-semibold">Prodotti</h2>
                <p className="text-xl font-bold">{stats.products}</p>
            </div>
            <div className={cardStyle}>
                <FiSpeaker size={28} className="mb-1" />
                <h2 className="text-base font-semibold">Annunci</h2>
                <p className="text-xl font-bold">{stats.announcements}</p>
            </div>
            <div className={cardStyle}>
                <FiCalendar size={28} className="mb-1" />
                <h2 className="text-base font-semibold">Prenotazioni</h2>
                <p className="text-xl font-bold">{stats.bookings}</p>
            </div>
        </div>
    );
};

export default DashboardOverview;
