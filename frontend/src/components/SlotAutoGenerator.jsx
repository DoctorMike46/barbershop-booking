import React, { useState } from 'react';
import axios from 'axios';

const SlotAutoGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const generateSlots = async () => {
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/timeslots/generate/weeks?weeks=3&step=30`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Slot generati con successo per le prossime 3 settimane.");
        } catch (error) {
            setMessage("Errore nella generazione degli slot.");
        }

        setLoading(false);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white mb-4 mt-2">
            <h2 className="text-lg font-bold mb-2">Genera Slot per 3 Settimane</h2>
            <button
                onClick={generateSlots}
                disabled={loading}
                className="bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded"
            >
                {loading ? "Generazione in corso..." : "Genera Slot"}
            </button>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
    );
};

export default SlotAutoGenerator;
