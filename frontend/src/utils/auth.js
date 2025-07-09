import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded?.role || null;
    } catch (err) {
        console.error("Errore nella decodifica del token:", err);
        return null;
    }
};
