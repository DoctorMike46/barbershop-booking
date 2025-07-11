import React from 'react';

const CalendarModal = ({ isOpen, onClose, calendarLink }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96 max-w-full border border-white/20">
                <h2 className="text-2xl font-bold mb-4">Aggiungi al Calendario</h2>
                <p className="mb-4">La tua prenotazione è andata a buon fine! Se vuoi, puoi aggiungerla al tuo calendario:</p>
                <div className="flex justify-between">
                    <a
                        href={calendarLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white"
                    >
                        Vai al Calendario
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 text-white"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
