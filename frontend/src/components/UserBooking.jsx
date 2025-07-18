import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import CalendarModal from './CalendarModal';

const UserBooking = () => {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [note, setNote] = useState('');

    const [calendarLink, setCalendarLink] = useState(null);

    const fetchServices = useCallback(async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/services', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setServices(res.data);
    }, []);

    const fetchSlots = useCallback(async () => {
        if (!selectedService) return;

        const token = localStorage.getItem('token');
        const selected = services.find(s => s.id === parseInt(selectedService));
        const duration = selected ? selected.duration : 30;

        const res = await axios.get(`http://localhost:8080/api/timeslots/available?date=${date}&duration=${duration}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSlots(res.data);
    }, [date, selectedService, services]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    useEffect(() => {
        if (selectedService) {
            fetchSlots();
        }
    }, [fetchSlots]);

    const handleBooking = async () => {

        const token = localStorage.getItem('token');

        if (!selectedService || !selectedSlot) {
            alert("Seleziona un servizio e uno slot.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:8080/api/bookings', {
                serviceId: selectedService,
                timeSlotId: selectedSlot,
                note: note
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const booking = res.data;
            setCalendarLink(booking.calendarLink);

            setSelectedService('');
            setSelectedSlot(null);
            setNote('');
            setSlots([]);
        } catch (err) {
            console.error("Errore nella prenotazione utente:", err);
            alert("Errore durante la prenotazione.");
        }
    };


    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Prenota un Servizio</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block mb-1 font-semibold">Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Servizio</label>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="mb-3 w-full p-2 rounded bg-white/10 border border-white/20 max-h-40 overflow-y-auto"

                    >
                        <option value="">Seleziona un servizio</option>
                        {services.map(service => (
                            <option key={service.id} value={service.id}>
                                {service.name} - {service.duration} min - €{service.price.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedService && (
                <div className="mb-6">
                    <label className="block mb-2 font-semibold">Slot Disponibili</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.length > 0 ? (
                            slots.map(slot => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`p-3 rounded-lg border transition ${
                                        selectedSlot === slot.id
                                            ? 'bg-green-600 border-green-700'
                                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                                    }`}
                                >
                                    {slot.startTime.slice(0, 5)}
                                </button>
                            ))
                        ) : (
                            <p>Nessuno slot disponibile per questa data e servizio.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <label className="block mb-1 font-semibold">Note (opzionale)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
                    rows={3}
                />
            </div>

            <button
                onClick={handleBooking}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                disabled={!selectedService || !selectedSlot}
            >
                Prenota
            </button>

            <CalendarModal
                isOpen={!!calendarLink}
                onClose={() => setCalendarLink(null)}
                calendarLink={calendarLink}
            />

        </div>
    );
};

export default UserBooking;
