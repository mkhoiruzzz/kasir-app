import React, { useState, useEffect } from 'react';
import styles from '../styles/ProductForm.module.css';
import { supabase } from '../supabaseClient';

const ProductForm = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        selling_price: '',
        sachet_price: '',
        stock: '',
        category_id: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
            if (error) throw error;
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.from('products').insert([
                {
                    name: formData.name,
                    price: formData.price,
                    selling_price: formData.selling_price,
                    sachet_price: formData.sachet_price || 0,
                    stock: formData.stock,
                    category_id: formData.category_id
                }
            ]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Produk berhasil ditambahkan!' });
            setFormData({ name: '', price: '', selling_price: '', sachet_price: '', stock: '', category_id: formData.category_id });
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage({ type: 'error', text: 'Gagal menambahkan produk: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Tambah Produk Baru</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nama Produk</label>
                    <input
                        type="text"
                        name="name"
                        className={styles.input}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Teh Villa"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Harga Pokok (Rp)</label>
                    <input
                        type="number"
                        name="price"
                        className={styles.input}
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Harga Jual (Rp)</label>
                    <input
                        type="number"
                        name="selling_price"
                        className={styles.input}
                        value={formData.selling_price}
                        onChange={handleChange}
                        placeholder="0"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Harga Sachet (Rp)</label>
                    <input
                        type="number"
                        name="sachet_price"
                        className={styles.input}
                        value={formData.sachet_price}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Stok</label>
                    <input
                        type="number"
                        name="stock"
                        className={styles.input}
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Kategori</label>
                    <select
                        name="category_id"
                        className={styles.select}
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
            </form>

            {message.text && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default ProductForm;
