import React, { useEffect, useState } from 'react';
import axios from 'axios';

const giorniSettimana = [
    'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'
];

const WorkingHours = () => {
    const [orari, setOrari] = useState([]);

    useEffect(() => {
        fetchOrari();
    }, []);

    const fetchOrari = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/working-hours', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrari(res.data);
        } catch (error) {
            console.error('Errore nel recupero degli orari:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...orari];
        updated[index][field] = value;
        setOrari(updated);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8080/api/working-hours', orari, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Orari salvati con successo');
        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            alert('Errore durante il salvataggio');
        }
    };



    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Orario Settimanale</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orari.map((giorno, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20 shadow-md">
                        <h2 className="text-xl font-semibold mb-2">{giorno.dayOfWeek}</h2>

                        <label className="block mb-1">Mattina</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="time"
                                value={giorno.morningOpen}
                                disabled={giorno.closedAllDay}
                                onChange={(e) => handleChange(index, 'morningOpen', e.target.value)}
                                className="w-1/2 px-2 py-1 bg-white/10 border border-white/20 rounded"
                            />
                            <input
                                type="time"
                                value={giorno.morningClose}
                                disabled={giorno.closedAllDay}
                                onChange={(e) => handleChange(index, 'morningClose', e.target.value)}
                                className="w-1/2 px-2 py-1 bg-white/10 border border-white/20 rounded"
                            />
                        </div>

                        <label className="block mb-1">Pomeriggio</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="time"
                                value={giorno.afternoonOpen}
                                disabled={giorno.closedAllDay}
                                onChange={(e) => handleChange(index, 'afternoonOpen', e.target.value)}
                                className="w-1/2 px-2 py-1 bg-white/10 border border-white/20 rounded"
                            />
                            <input
                                type="time"
                                value={giorno.afternoonClose}
                                disabled={giorno.closedAllDay}
                                onChange={(e) => handleChange(index, 'afternoonClose', e.target.value)}
                                className="w-1/2 px-2 py-1 bg-white/10 border border-white/20 rounded"
                            />
                        </div>

                        <label className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                checked={giorno.closedAllDay}
                                onChange={(e) => handleChange(index, 'closedAllDay', e.target.checked)}
                            />
                            Giorno chiuso
                        </label>
                    </div>

                ))}


            </div>
            <button
                onClick={handleSave}
                className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
                Salva Orari
            </button>
        </div>
    );
};

export default WorkingHours;
