import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(res.data);
            } catch (err) {
                console.error("Errore nel recupero dei prodotti", err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="p-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Prodotti disponibili</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white/10 border border-white/20 rounded-xl p-4">
                        {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                        )}
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p className="text-sm text-gray-300">{product.description}</p>
                        <p className="mt-2 font-bold">€{product.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProducts;
