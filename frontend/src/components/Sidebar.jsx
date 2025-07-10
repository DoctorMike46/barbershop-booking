import React from 'react';
import clsx from 'clsx';

const Sidebar = ({ role, section, setSection }) => {
   /* const navItems = [
        { label: 'Dashboard', value: 'home' },
        { label: 'Prenotazioni', value: 'prenotazioni' },
    ];

    */

    const adminItems = [
        { label: 'Dashboard', value: 'home' },
        { label: 'Prenotazioni', value: 'prenotazioni' },
        { label: 'Clienti', value: 'clienti' },
        { label: 'Servizi', value: 'servizi' },
        { label: 'Prodotti', value: 'prodotti' },
        { label: 'Orario Salone', value: 'orario' },
    ];

    return (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-60 h-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-lg z-40">
            <ul className="space-y-3">

                {/*
                {navItems.map((item) => (
                    <li key={item.value}>
                        <button
                            onClick={() => setSection(item.value)}
                            className={clsx(
                                "w-full text-left px-4 py-2 rounded-md transition",
                                section === item.value ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                            )}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}

                */}

                {role === 'ADMIN' && (
                    <>
                        {adminItems.map((item) => (
                            <li key={item.value}>
                                <button
                                    onClick={() => setSection(item.value)}
                                    className={clsx(
                                        "w-full text-left px-4 py-2 rounded-md transition",
                                        section === item.value ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                                    )}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
