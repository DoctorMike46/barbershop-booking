import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const ViewUserBooking = () => {
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const res = await axios.get('http://localhost:8080/api/bookings/me', { headers });
        setBookings(res.data);
    };

    const handleCancel = async (id) => {
        if (window.confirm("Sei sicuro di voler annullare questa prenotazione?")) {
            await axios.delete(`http://localhost:8080/api/bookings/${id}`, { headers });
            fetchBookings();
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Le tue Prenotazioni</h1>

            {bookings.length === 0 ? (
                <p className="text-gray-400">Nessuna prenotazione trovata.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
                            <h2 className="text-xl font-semibold">{booking.service.name}</h2>
                            <p className="mt-1">{dayjs(booking.timeSlot.date).format('DD/MM/YYYY')} alle {booking.timeSlot.startTime.slice(0, 5)}</p>
                            <p className="text-sm mt-1 text-gray-300">Note: {booking.note || 'Nessuna'}</p>
                            <p className="text-sm mt-1">Stato: <span className="font-semibold">{booking.status}</span></p>

                            {/* Mostra il pulsante annulla solo se la data è futura */}
                            {dayjs(booking.timeSlot.date).isAfter(dayjs()) && (
                                <button
                                    onClick={() => handleCancel(booking.id)}
                                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                                >
                                    Annulla Prenotazione
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewUserBooking;
