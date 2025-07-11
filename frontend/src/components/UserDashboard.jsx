import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { getDecodedToken } from '../utils/auth';


const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [products, setProducts] = useState([]);


    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };



    useEffect(() => {

        const fetchAll = async () => {
            if (!token) return;

            const decoded = getDecodedToken();
            setUser(decoded);

            try {

                // Solo dopo che abbiamo il profilo utente, eseguiamo il resto
                const [bookingsRes, announcementsRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/bookings/me', { headers }),
                    axios.get('http://localhost:8080/api/announcements', { headers }),
                    axios.get('http://localhost:8080/api/products', { headers }),
                ]);

                setBookings(bookingsRes.data);
                setAnnouncements(announcementsRes.data);
                setProducts(productsRes.data);
            } catch (err) {
                console.error("Errore durante il fetch dei dati:", err);
            }
        };

        fetchAll();
    }, [token]);


    const latestBooking = bookings.length > 0 ? bookings[bookings.length - 1] : null;
    const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

    return (
        <div className="p-8 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Ciao {user?.name || "Utente"} 👋</h1>

            {/* Sezione Prenotazione */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">📅 Prossima Prenotazione</h2>
                {latestBooking ? (
                    <div className="bg-white/10 p-4 rounded-lg">
                        <p className="font-bold">{latestBooking.service.name}</p>
                        <p>{dayjs(latestBooking.timeSlot.date).format("DD/MM/YYYY")} alle {latestBooking.timeSlot.startTime.slice(0, 5)}</p>
                        <p className="text-sm text-gray-300">Note: {latestBooking.note || "Nessuna"}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">Nessuna prenotazione trovata.</p>
                )}
            </div>

            {/* Sezione Annuncio */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">📢 Ultimo Annuncio</h2>
                {latestAnnouncement ? (
                    <div className="bg-white/10 p-4 rounded-lg">
                        <p className="font-bold">{latestAnnouncement.title}</p>
                        <p className="text-sm text-gray-300 mt-1">{latestAnnouncement.description}</p>
                    </div>
                ) : (
                    <p className="text-gray-400">Nessun annuncio pubblicato.</p>
                )}
            </div>

            {/* Sezione Prodotti */}
            <div>
                <h2 className="text-2xl font-semibold mb-2">🧴 Prodotti Consigliati</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 3).map(p => (
                        <div key={p.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-sm text-gray-300 mt-1">{p.description}</p>
                            <p className="text-sm mt-2 font-semibold">€{p.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Visualizza tutti</button>
            </div>
        </div>
    );
};

export default UserDashboard;
