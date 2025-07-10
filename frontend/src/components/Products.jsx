import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/products', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
    };

    const handleAdd = async () => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8080/api/products', newProduct, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
        fetchProducts();
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
    };

    const handleEditSave = async () => {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:8080/api/products/${editing.id}`, editing, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditing(null);
        fetchProducts();
    };

    return (
        <div className="px-8 pt-6 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Prodotti</h1>

            <div className="mb-6 bg-white/10 p-4 rounded-lg border border-white/20 shadow-md">
                <h2 className="text-xl font-semibold mb-2">Nuovo Prodotto</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-2 py-1 mb-2 bg-white/10 border border-white/20 rounded"
                />
                <textarea
                    placeholder="Descrizione"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-2 py-1 mb-2 bg-white/10 border border-white/20 rounded"
                />
                <input
                    type="number"
                    placeholder="Prezzo in Euro"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-2 py-1 mb-2 bg-white/10 border border-white/20 rounded"
                />
                <input
                    type="text"
                    placeholder="URL Immagine (opzionale)"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="w-full px-2 py-1 mb-2 bg-white/10 border border-white/20 rounded"
                />
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                    Aggiungi Prodotto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white/10 p-4 rounded-lg border border-white/20 shadow-md">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        {product.imageUrl && (
                            <img src={product.imageUrl} alt="prodotto" className="w-full h-40 object-cover mt-2 rounded" />
                        )}
                        <p className="mt-2">{product.description}</p>
                        <p className="mt-1 font-bold">{parseFloat(product.price).toFixed(2)} €</p>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => setEditing(product)}
                                className="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                            >
                                Modifica
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded"
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editing && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/10 text-white p-6 rounded-xl border border-white/20 w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Modifica Prodotto</h2>
                        <input
                            type="text"
                            value={editing.name}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                            placeholder="Nome"
                            className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <textarea
                            value={editing.description}
                            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                            placeholder="Descrizione"
                            className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <input
                            type="number"
                            value={editing.price}
                            onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                            placeholder="Prezzo in Euro"
                            className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20 rounded-lg"
                        />
                        <input
                            type="text"
                            value={editing.imageUrl || ''}
                            onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                            placeholder="URL Immagine (opzionale)"
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

export default Products;
