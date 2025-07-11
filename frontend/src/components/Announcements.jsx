import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Announcements = () => {
    const [annunci, setAnnunci] = useState([]);
    const [newAnnuncio, setNewAnnuncio] = useState({ title: '', content: '', imageUrl: '' });
    const [editing, setEditing] = useState(null);

    const fetchAnnunci = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/announcements', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAnnunci(res.data);
    };

    useEffect(() => {
        fetchAnnunci();
    }, []);

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8080/api/announcements', newAnnuncio, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewAnnuncio({ title: '', content: '', imageUrl: '' });
        fetchAnnunci();
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/announcements/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAnnunci();
    };

    const handleEditSave = async () => {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8080/api/announcements/${editing.id}`, editing, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditing(null);
        fetchAnnunci();
    };

    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Annunci</h1>

            {/* Nuovo Annuncio */}
            <div className="mb-6 bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Nuovo Annuncio</h2>
                <input
                    type="text"
                    placeholder="Titolo"
                    value={newAnnuncio.title}
                    onChange={(e) => setNewAnnuncio({ ...newAnnuncio, title: e.target.value })}
                    className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg"
                />
                <textarea
                    placeholder="Contenuto"
                    value={newAnnuncio.content}
                    onChange={(e) => setNewAnnuncio({ ...newAnnuncio, content: e.target.value })}
                    className="w-full px-3 py-2 mb-2 bg-white/10 border border-white/20 rounded-lg"
                />
                <input
                    type="text"
                    placeholder="URL Immagine (opzionale)"
                    value={newAnnuncio.imageUrl}
                    onChange={(e) => setNewAnnuncio({ ...newAnnuncio, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 mb-4 bg-white/10 border border-white/20 rounded-lg"
                />
                <button
                    onClick={handleAdd}
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-950 rounded-lg font-medium"
                >
                    Aggiungi Annuncio
                </button>
            </div>

            {/* Lista Annunci */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {annunci.map((annuncio) => (
                    <div key={annuncio.id} className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 shadow-lg">
                        <h2 className="text-xl font-semibold">{annuncio.title}</h2>
                        {annuncio.imageUrl && (
                            <img src={annuncio.imageUrl} alt="annuncio" className="w-full h-40 object-cover mt-2 rounded-lg" />
                        )}
                        <p className="mt-2">{annuncio.content}</p>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => setEditing(annuncio)}
                                className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                            >
                                Modifica
                            </button>
                            <button
                                onClick={() => handleDelete(annuncio.id)}
                                className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded-lg"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Popup Modifica */}
            {editing && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/10 text-white p-6 rounded-xl border border-white/20 w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Modifica Annuncio</h2>
                        <input
                            type="text"
                            value={editing.title}
                            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                            className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <textarea
                            value={editing.content}
                            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                            className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <input
                            type="text"
                            value={editing.imageUrl || ''}
                            onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 mb-4 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditing(null)}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                                Salva
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
