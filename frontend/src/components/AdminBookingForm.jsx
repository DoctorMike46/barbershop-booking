import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const AdminBookingForm = ({ onSuccess, onCancel }) => {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [formData, setFormData] = useState({
        userId: '',
        serviceId: '',
        timeSlotId: '',
        note: ''
    });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchUsers();
        fetchServices();
    }, []);

    useEffect(() => {
        if (formData.serviceId) {
            fetchSlots();
        }
    }, [date, formData.serviceId]);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:8080/api/users', { headers });
        setUsers(res.data);
    };

    const fetchServices = async () => {
        const res = await axios.get('http://localhost:8080/api/services', { headers });
        setServices(res.data);
    };

    const fetchSlots = async () => {
        const selectedService = services.find(s => s.id === parseInt(formData.serviceId));
        const duration = selectedService ? selectedService.duration : 30; // fallback se mancante

        const res = await axios.get(`http://localhost:8080/api/timeslots/available?date=${date}&duration=${duration}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSlots(res.data);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.userId || !formData.serviceId || !formData.timeSlotId) {
            alert("Compila tutti i campi obbligatori.");
            return;
        }

        try {
            const res = await axios.post('http://localhost:8080/api/bookings/admin', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Errore nella prenotazione admin:", err);
            alert("Errore durante la prenotazione.");
        }
    };


    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">Nuova Prenotazione</h2>

            <label className="block mb-1">Cliente</label>
            <select name="userId" value={formData.userId} onChange={handleChange} className="mb-3 w-full p-2 rounded bg-white/10 border border-white/20 max-h-40 overflow-y-auto"
            >
                <option value="">Seleziona un cliente</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
            </select>

            <label className="block mb-1">Servizio</label>
            <select name="serviceId" value={formData.serviceId} onChange={handleChange} className="mb-3 w-full p-2 rounded bg-white/10 border border-white/20 max-h-40 overflow-y-auto"
            >
                <option value="">Seleziona un servizio</option>
                {services.map(service => (
                    <option key={service.id} value={service.id}>
                        {service.name} - {service.duration} min - €{service.price}
                    </option>
                ))}
            </select>

            <label className="block mb-1">Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-3 w-full p-2 rounded bg-white/10 border border-white/20" />

            <label className="block mb-1">Slot Disponibile</label>
            <select name="timeSlotId" value={formData.timeSlotId} disabled={!formData.serviceId} onChange={handleChange} className="mb-3 w-full p-2 rounded bg-white/10 border border-white/20 max-h-40 overflow-y-auto"
            >
                <option value="">Seleziona uno slot</option>
                {slots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                        {slot.startTime.slice(0, 5)}
                    </option>
                ))}
            </select>

            <label className="block mb-1">Note</label>
            <textarea name="note" value={formData.note} onChange={handleChange} rows="3" className="mb-4 w-full p-2 rounded bg-white/10 border border-white/20" />

            <div className="flex justify-between">
                <button onClick={handleSubmit} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Conferma</button>
                <button onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">Annulla</button>
            </div>

        </div>
    );
};



export default AdminBookingForm;
