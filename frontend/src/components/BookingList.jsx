import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import AdminBookingForm from "./AdminBookingForm";
import ConfirmModal from "./ConfirmModal";


const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [formData, setFormData] = useState({ note: '', service: '', timeSlot: '', user: ''});

    const [filterDate, setFilterDate] = useState('');
    const [filterService, setFilterService] = useState('');
    const [services, setServices] = useState([]);

    useEffect(() => {
        fetchBooking();
        fetchServices();
    }, []);

    const fetchBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/bookings' ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBookings(res.data);
        } catch (err) {
            console.error('Errore nel recupero delle prenotazioni:', err);
        }
    };

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(res.data);
        } catch (error) {
            console.error("Errore nel recupero dei servizi:", error);
        }
    };


    const handleElimina = (booking) => {
        setSelectedBooking(booking);
        setPopupType('elimina');
    };

    const handleNuovo = () => {
        setFormData({ note: '', service: '', timeslot: '', user: '' });
        setPopupType('nuovo');
    };

    const closePopup = () => {
        setSelectedBooking(null);
        setPopupType('');
    };


    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/bookings/${selectedBooking.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchBooking();
            closePopup();
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
        }
    };

    const filtered = bookings.filter(b => {
        const matchName = b.user?.name.toLowerCase().includes(search.toLowerCase());
        const matchDate = filterDate ? b.timeSlot?.date === filterDate : true;
        const matchService = filterService ? b.service?.id === parseInt(filterService) : true;
        return matchName && matchDate && matchService;
    });


    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestione Prenotazioni</h1>
                <button onClick={handleNuovo} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded">
                    <FaPlus /> Nuova Prenotazione
                </button>
            </div>

            <input
                type="text"
                placeholder="Cerca per cliente..."
                className="w-full mb-6 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                />
                <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                    <option value="">Tutti i servizi</option>
                    {services.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((booking) => (
                    <div key={booking.id} className="bg-white/10 p-4 rounded-lg shadow-md border border-white/10">
                        <div className="mb-3">
                            <p><strong>Nome cliente:</strong> {booking.user?.name}</p>
                            <p><strong>Email:</strong> {booking.user?.email}</p>
                            <p><strong>Telefono:</strong> {booking.user?.telefono || 'Non disponibile'}</p>
                        </div>
                        <div className="mb-3">
                            <p><strong>Servizio:</strong> {booking.service?.name}</p>
                            <p><strong>Data:</strong> {booking.timeSlot?.date}</p>
                            <p><strong>Ora:</strong> {booking.timeSlot?.startTime?.slice(0, 5)}</p>
                        </div>
                        <div className="mt-4 flex gap-4 text-xl">
                            {/* <FaEdit ... /> */}
                            <FaTrash className="cursor-pointer hover:text-red-400" title="Elimina" onClick={() => handleElimina(booking)} />
                        </div>
                    </div>
                ))}
            </div>


            {popupType && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <button className="absolute top-2 right-2 text-white text-xl" onClick={closePopup}>
                            <FaTimes />
                        </button>

                        {popupType === 'nuovo' && (
                            <AdminBookingForm
                                onSuccess={() => {
                                    fetchBooking();
                                    closePopup();
                                }}
                                onCancel={closePopup}
                            />
                        )}

                        {/*}
                        {(popupType === 'modifica' || popupType === 'nuovo') && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4">{popupType === 'nuovo' ? 'Nuova Prenotazione' : 'Modifica Prenotazione'}</h2>
                                <form className="space-y-3">
                                    <input name="name" placeholder="Nome" onChange={handleFormChange} value={formData.name} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    <input name="duration" placeholder="Durata (minuti)" type="number" onChange={handleFormChange} value={formData.duration} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    <input name="price" placeholder="Prezzo (€)" type="number" step="0.01" onChange={handleFormChange} value={formData.price} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    <button
                                        type="button"
                                        onClick={popupType === 'nuovo' ? handleCreate : handleSave}
                                        className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Salva
                                    </button>
                                </form>
                            </>
                        )}
                        */}

                        {popupType === 'elimina' && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Sei sicuro di voler eliminare la prenotazione {selectedBooking.id} di {selectedBooking.user?.name}?</h2>
                                <div className="flex justify-between mt-4">
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">Sì, elimina</button>
                                    <button onClick={closePopup} className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">Annulla</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default BookingList;
