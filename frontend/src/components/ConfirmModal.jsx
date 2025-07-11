import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Conferma</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                        Annulla
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
                        Conferma
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
