import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/announcements', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnnouncements(res.data);
            } catch (err) {
                console.error("Errore nel recupero degli annunci", err);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Annunci</h1>
            <div className="space-y-4">
                {announcements.map(announcement => (
                    <div key={announcement.id} className="bg-white/10 border border-white/20 p-4 rounded-xl shadow">
                        <h2 className="text-xl font-semibold">{announcement.title}</h2>
                        <p className="text-gray-300 mt-1">{announcement.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserAnnouncements;
