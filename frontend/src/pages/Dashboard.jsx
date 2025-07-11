import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUserRoleFromToken } from '../utils/auth';
import ClientList from "../components/ClientList";
import ServiceList from "../components/ServiceList";
import WorkingHours from "../components/WorkingHours";
import Announcements from "../components/Announcements";
import Products from "../components/Products";
import DashboardOverview from "../components/DashboardOverview";
import UserBooking from "../components/UserBooking";
import BookingList from "../components/BookingList";
import SlotAutoGenerator from "../components/SlotAutoGenerator";
import UserProducts from "../components/UserProducts";
import UserMyBookings from "../components/UserMyBookings";
import UserAnnouncements from "../components/UserAnnouncements";
import UserDashboard from "../components/UserDashboard";
import ViewUserBooking from "../components/ViewUserBooking";


const Dashboard = () => {
    const role = getUserRoleFromToken();
    const [section, setSection] = useState(role === 'USER' ? 'homeUser' : 'homeAdmin');

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Navbar fissa in alto */}
            <div className="fixed top-0 left-0 right-0 z-50 h-20">
                <Navbar />
            </div>

            {/* Sidebar fissa a sinistra sotto la navbar */}
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2 w-64 h-[400px] z-40">
                <Sidebar role={role} section={section} setSection={setSection} />
            </div>

            {/* Contenuto scrollabile a destra della sidebar */}
            <div className="ml-64 mt-20 h-[calc(100vh-5rem)] overflow-y-auto px-8 pt-6 transition-all duration-300">

                {section === 'homeAdmin' && <DashboardOverview />}
                {section === 'prenotazioni' && <BookingList />}
                {section === 'clienti' && <ClientList />}
                {section === 'servizi' && <ServiceList />}
                {section === 'orario' && <WorkingHours />}
                {section === 'annunci' && <Announcements />}
                {section === 'prodotti' && <Products />}
                {section === 'slot' && <SlotAutoGenerator />}

                {section === 'homeUser' && <UserDashboard />}
                {section === 'prenUser' && <UserMyBookings />}
                {section === 'newPren' && <UserBooking />}
                {section === 'prodUser' && <UserProducts />}
                {section === 'mesUser' && <UserAnnouncements />}


            </div>
        </div>
    );
};

export default Dashboard;
