import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes, FaUserSlash, FaUserCheck, FaPlus} from 'react-icons/fa';

const ClientList = () => {
    const [clienti, setClienti] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [popupType, setPopupType] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', telefono: '' , password: '' , role: 'USER'});

    useEffect(() => {
        fetchClienti();
    }, []);

    const fetchClienti = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/users/role-USER', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClienti(res.data);
        } catch (err) {
            console.error('Errore nel recupero clienti:', err);
        }
    };


    const handleModifica = (cliente) => {
        setSelectedClient(cliente);
        setFormData({ name: cliente.name, email: cliente.email, telefono: cliente.telefono, role: cliente.role });
        setPopupType('modifica');
    };

    const handleElimina = (cliente) => {
        setSelectedClient(cliente);
        setPopupType('elimina');
    };

    const handleNuovo = () => {
        setFormData({ name: '', email: '', telefono: '', password: '', role: 'USER' });
        setPopupType('nuovo');

    };

    const closePopup = () => {
        setSelectedClient(null);
        setPopupType('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/api/users/${selectedClient.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchClienti();
            closePopup();
        } catch (error) {
            console.error('Errore durante la modifica:', error);
        }
    };

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/auth/register', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchClienti();
            closePopup();
        } catch (error) {
            console.error('Errore durante la creazione del cliente:', error);
        }
    };


    const handleToggleActive = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8080/api/users/${selectedClient.id}/status`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchClienti();
            closePopup();
        } catch (error) {
            console.error('Errore durante il cambio stato:', error);
        }
    };

    const filtered = clienti.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.telefono.includes(search)
    );

    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestione Clienti</h1>
                <button onClick={handleNuovo} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-950 px-4 py-2 rounded">
                    <FaPlus /> Nuovo Cliente
                </button>
            </div>

            <input
                type="text"
                placeholder="Cerca per nome, email o telefono..."
                className="w-full mb-6 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((cliente) => (
                    <div key={cliente.id} className="bg-white/10 p-4 rounded-lg shadow-md border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-lg font-semibold">{cliente.name}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                cliente.active ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                            }`}>
                                {cliente.active ? 'Attivo' : 'Disabilitato'}
                            </span>
                        </div>
                        <p><strong>ID:</strong> {cliente.id}</p>
                        <p><strong>Email:</strong> {cliente.email}</p>
                        <p><strong>Telefono:</strong> {cliente.telefono}</p>

                        <div className="mt-4 flex gap-4 text-xl">
                            {/*<FaEye className="cursor-pointer hover:text-blue-400" title="Visualizza" onClick={() => handleVisualizza(cliente)} />  */}
                            <FaEdit className="cursor-pointer hover:text-yellow-400" title="Modifica" onClick={() => handleModifica(cliente)} />
                            <FaTrash className="cursor-pointer hover:text-red-400" title="Elimina" onClick={() => handleElimina(cliente)} />
                        </div>
                    </div>
                ))}
            </div>

            {popupType  && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="relative bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <button className="absolute top-2 right-2 text-white text-xl" onClick={closePopup}>
                            <FaTimes />
                        </button>

                        {popupType === 'visualizza' && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4">Prenotazioni di {selectedClient.name}</h2>
                                <p className="text-center">Nessuna prenotazione effettuata</p>
                            </>
                        )}

                        {(popupType === 'modifica' || popupType === 'nuovo') && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4">{popupType === 'nuovo' ? 'Nuovo Cliente' : 'Modifica Cliente'}</h2>
                                <form className="space-y-3">
                                    <input name="name" placeholder="Nome e Cognome" onChange={handleFormChange} value={formData.name} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    <input name="email" placeholder="Email" onChange={handleFormChange} value={formData.email} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    <input name="telefono" placeholder="Telefono" onChange={handleFormChange} value={formData.telefono} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    {popupType === 'nuovo' && (
                                        <input name="password" placeholder="Password" type="password" onChange={handleFormChange} value={formData.password} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={popupType === 'nuovo' ? handleCreate : handleSave}
                                        className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Salva
                                    </button>
                                    {popupType === 'modifica' && (
                                        <button type="button" onClick={handleToggleActive} className="w-full py-2 mt-2 rounded hover:bg-gray-700 bg-gray-600">
                                            {selectedClient.active ? <><FaUserSlash className="inline" /> Disabilita</> : <><FaUserCheck className="inline" /> Abilita</>}
                                        </button>
                                    )}
                                </form>
                            </>
                        )}

                        {popupType === 'elimina' && (
                            <>
                                <h2 className="text-xl font-semibold mb-4">Sei sicuro di voler eliminare {selectedClient.name}?</h2>
                                <div className="flex justify-between mt-4">
                                    <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-600">Sì, elimina</button>
                                    <button className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600" onClick={closePopup}>Annulla</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientList;
