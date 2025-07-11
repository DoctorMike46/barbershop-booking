import { jwtDecode } from 'jwt-decode';
import {useEffect} from "react";
import axios from "axios";

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


export const getDecodedToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (err) {
        console.error("Token decoding failed:", err);
        return null;
    }
};
