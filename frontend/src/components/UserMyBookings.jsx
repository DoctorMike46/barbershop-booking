import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import ConfirmModal from './ConfirmModal';

const UserMyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const token = localStorage.getItem('token');

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bookings/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            console.error("Errore nel recupero delle prenotazioni", err);
        }
    };

    const confirmCancel = (id) => {
        setBookingToCancel(id);
        setShowConfirm(true);
    };

    const handleCancel = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/bookings/${bookingToCancel}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowConfirm(false);
            setBookingToCancel(null);
            fetchBookings(); // aggiorna la lista
        } catch (err) {
            console.error("Errore nella cancellazione", err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Le mie Prenotazioni</h1>

            <div className="space-y-4">
                {bookings.length === 0 && (
                    <p className="text-gray-400">Non hai ancora prenotazioni attive.</p>
                )}

                {bookings.map(booking => (
                    <div key={booking.id} className="bg-white/10 border border-white/20 p-4 rounded-xl shadow">
                        <h2 className="text-xl font-semibold">{booking.service.name}</h2>
                        <p>{dayjs(booking.timeSlot.date).format("DD/MM/YYYY")} alle {booking.timeSlot.startTime.slice(0, 5)}</p>

                        {booking.note && (
                            <p className="text-sm text-gray-400 mt-1">📝 {booking.note}</p>
                        )}
                        <p className="text-sm text-gray-400 mt-1">📌 Stato: {booking.status}</p>
                        <button
                            onClick={() => confirmCancel(booking.id)}
                            className="mt-3 px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                            Cancella
                        </button>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleCancel}
                message="Sei sicuro di voler cancellare questa prenotazione?"
            />
        </div>
    );
};

export default UserMyBookings;
