import React from 'react';
import clsx from 'clsx';
import {
    Home,
    CalendarCheck,
    Users,
    Scissors,
    Package,
    Clock,
    Megaphone,
    PlusSquare,
    MessageCircle,
} from 'lucide-react';

const Sidebar = ({ role, section, setSection }) => {

    {/*{ label: 'Genera Slot', value: 'slot', icon: <PlusSquare size={18} /> }, */}


    const adminItems = [
        { label: 'Dashboard', value: 'homeAdmin', icon: <Home size={18} /> },
        { label: 'Prenotazioni', value: 'prenotazioni', icon: <CalendarCheck size={18} /> },
        { label: 'Clienti', value: 'clienti', icon: <Users size={18} /> },
        { label: 'Servizi', value: 'servizi', icon: <Scissors size={18} /> },
        { label: 'Prodotti', value: 'prodotti', icon: <Package size={18} /> },
        { label: 'Orario Salone', value: 'orario', icon: <Clock size={18} /> },
        { label: 'Annunci', value: 'annunci', icon: <Megaphone size={18} /> },
    ];

    const userItems = [
        { label: 'Dashboard', value: 'homeUser', icon: <Home size={18} /> },
        { label: 'Nuova Prenotazione', value: 'newPren', icon: <PlusSquare size={18} /> },
        { label: 'Prenotazioni', value: 'prenUser', icon: <CalendarCheck size={18} /> },
        { label: 'Prodotti', value: 'prodUser', icon: <Package size={18} /> },
        { label: 'Messaggi', value: 'mesUser', icon: <MessageCircle size={18} /> },
    ];


    return (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-60 h-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white shadow-lg z-40">
            <ul className="space-y-3">

                {role === 'ADMIN' && (
                    <>
                        {adminItems.map((item) => (
                            <li key={item.value}>

                                <button
                                    onClick={() => setSection(item.value)}
                                    className={clsx(
                                        "w-full text-left px-4 py-2 rounded-md transition flex items-center gap-3",
                                        section === item.value ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                                    )}
                                >
                                    <span className="flex items-center justify-center">{item.icon}</span>
                                    <span className="whitespace-nowrap">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </>
                )}

                {role === 'USER' && (
                    <>
                        {userItems.map((item) => (
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
