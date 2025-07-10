import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import config from "tailwindcss/defaultConfig";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [formData, setFormData] = useState({ name: '', duration: '', price: '' });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/services');
            setServices(res.data);
        } catch (err) {
            console.error('Errore nel recupero dei servizi:', err);
        }
    };

    const handleModifica = (service) => {
        setSelectedService(service);
        setFormData({ name: service.name, duration: service.duration, price: service.price });
        setPopupType('modifica');
    };

    const handleElimina = (service) => {
        setSelectedService(service);
        setPopupType('elimina');
    };

    const handleNuovo = () => {
        setFormData({ name: '', duration: '', price: '' });
        setPopupType('nuovo');
    };

    const closePopup = () => {
        setSelectedService(null);
        setPopupType('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/services/${selectedService.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchServices();
            closePopup();
        } catch (error) {
            console.error('Errore durante la modifica:', error);
        }
    };


    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/services', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchServices();
            closePopup();
        } catch (error) {
            console.error('Errore durante la creazione del servizio:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/services/${selectedService.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchServices();
            closePopup();
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error);
        }
    };

    const filtered = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestione Servizi</h1>
                <button onClick={handleNuovo} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded">
                    <FaPlus /> Nuovo Servizio
                </button>
            </div>

            <input
                type="text"
                placeholder="Cerca per nome..."
                className="w-full mb-6 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((service) => (
                    <div key={service.id} className="bg-white/10 p-4 rounded-lg shadow-md border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-lg font-semibold">{service.name}</p>
                        </div>
                        <p><strong>ID:</strong> {service.id}</p>
                        <p><strong>Durata:</strong> {service.duration} min</p>
                        <p><strong>Prezzo:</strong> €{service.price}</p>

                        <div className="mt-4 flex gap-4 text-xl">
                            <FaEdit className="cursor-pointer hover:text-yellow-400" title="Modifica" onClick={() => handleModifica(service)} />
                            <FaTrash className="cursor-pointer hover:text-red-400" title="Elimina" onClick={() => handleElimina(service)} />
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

                        {(popupType === 'modifica' || popupType === 'nuovo') && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4">{popupType === 'nuovo' ? 'Nuovo Servizio' : 'Modifica Servizio'}</h2>
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

                        {popupType === 'elimina' && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Sei sicuro di voler eliminare {selectedService.name}?</h2>
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

export default ServiceList;
