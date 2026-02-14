import React, { useState, useEffect } from 'react';
import styles from '../styles/ProductTable.module.css'; // Reusing table styles
import { supabase } from '../supabaseClient';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Fetch categories with product count
            const { data, error } = await supabase
                .from('categories')
                .select('*, products(count)')
                .order('name', { ascending: true });

            if (error) throw error;

            // Format data to get clean count
            const formattedData = data.map(cat => ({
                ...cat,
                product_count: cat.products ? cat.products[0]?.count : 0 // Adjust based on Supabase return structure for count
                // Note: supabase .select('*, products(count)') usually returns array of objects with count
            }));

            // Correct way to get count in supabase is distinct, but for simplicity let's just fetch categories first
            // and maybe separate count query if needed, or use the length of products array if we select ids.
            // efficient way: .select('*, products(count)') -> returns { ..., products: [{ count: 5 }] }

            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const { error } = await supabase.from('categories').insert([{ name: newCategory }]);
            if (error) throw error;
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            alert('Gagal menambah kategori: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus kategori ini? Produk di kategori ini akan kehilangan kategorinya.')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchCategories();
        } catch (error) {
            alert('Gagal menghapus: ' + error.message);
        }
    };

    const startEdit = (cat) => {
        setEditingCategory(cat.id);
        setEditName(cat.name);
    };

    const saveEdit = async () => {
        try {
            const { error } = await supabase
                .from('categories')
                .update({ name: editName })
                .eq('id', editingCategory);
            if (error) throw error;
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            alert('Gagal update: ' + error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manajemen Kategori</h1>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAdd} className={styles.toolbar} style={{ gap: '10px' }}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Nama Kategori Baru..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button type="submit" className={styles.addBtn} disabled={!newCategory.trim()}>
                    ➕ Tambah
                </button>
            </form>

            <div className={styles.tableWrapper}>
                {loading ? <div className={styles.loading}>Memuat...</div> : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Kategori</th>
                                <th style={{ width: '200px' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr key={cat.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {editingCategory === cat.id ? (
                                            <input
                                                className={styles.searchInput}
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                autoFocus
                                            />
                                        ) : (
                                            cat.name
                                        )}
                                    </td>
                                    <td className={styles.actions}>
                                        {editingCategory === cat.id ? (
                                            <>
                                                <button className={styles.saveBtn} onClick={saveEdit}>✅</button>
                                                <button className={styles.cancelBtn} onClick={() => setEditingCategory(null)}>❌</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className={styles.editBtn} onClick={() => startEdit(cat)}>✏️ Edit</button>
                                                <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id)}>🗑️ Hapus</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
