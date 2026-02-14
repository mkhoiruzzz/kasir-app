import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ProductTable.module.css';
import { supabase } from '../supabaseClient';

const ProductTable = () => {
    // 1. State Declarations
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [editProduct, setEditProduct] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', price: '', selling_price: '', sachet_price: '', stock: '', category_id: '' });

    // 2. Fetch Functions
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
            if (error) throw error;
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err.message);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('products')
                .select('*, categories(name)')
                .order('created_at', { ascending: false });

            if (search) {
                query = query.ilike('name', `%${search}%`);
            }
            if (filterCategory) {
                query = query.eq('category_id', filterCategory);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Flatten category name for easier display
            const formattedData = data.map(p => ({
                ...p,
                category_name: p.categories?.name
            }));

            setProducts(formattedData);
        } catch (err) {
            console.error('Error fetching products:', err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Effects
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, filterCategory]);

    // 4. Handlers
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err.message);
            alert('Gagal menghapus produk: ' + err.message);
        }
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setEditForm({
            name: product.name,
            price: product.price,
            selling_price: product.selling_price || '',
            sachet_price: product.sachet_price || '',
            stock: product.stock,
            category_id: product.category_id
        });
    };

    const handleEditSave = async () => {
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    name: editForm.name,
                    price: editForm.price === '' ? 0 : editForm.price,
                    selling_price: editForm.selling_price === '' ? 0 : editForm.selling_price,
                    sachet_price: editForm.sachet_price === '' ? 0 : editForm.sachet_price,
                    stock: editForm.stock === '' ? 0 : editForm.stock,
                    category_id: editForm.category_id
                })
                .eq('id', editProduct.id);

            if (error) throw error;

            setEditProduct(null);
            fetchProducts();
        } catch (err) {
            console.error('Error updating product:', err.message);
            alert('Gagal mengupdate produk: ' + err.message);
        }
    };

    // 5. Render
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manajemen Produk</h1>
                <Link to="/produk/tambah" className={styles.addBtn}>➕ Tambah Produk</Link>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="🔍 Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={styles.filterSelect}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className={styles.loading}>Memuat produk...</div>
                ) : products.length === 0 ? (
                    <div className={styles.empty}>Tidak ada produk ditemukan</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Produk</th>
                                <th>Harga Pokok</th>
                                <th>Harga Jual</th>
                                <th>Harga Sachet</th>
                                <th>Stok</th>
                                <th>Kategori</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p.id}>
                                    <td>{i + 1}</td>
                                    <td>{p.name}</td>
                                    <td>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                                    <td>Rp {Number(p.selling_price || 0).toLocaleString('id-ID')}</td>
                                    <td>Rp {Number(p.sachet_price || 0).toLocaleString('id-ID')}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <span className={styles.badge}>{p.category_name || '-'}</span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn} onClick={() => openEdit(p)}>✏️ Edit</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>🗑️ Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Modal */}
            {editProduct && (
                <div className={styles.modalOverlay} onClick={() => setEditProduct(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Edit Produk</h3>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Produk</label>
                            <input className={styles.input} value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Harga Pokok (Rp)</label>
                            <input className={styles.input} type="number" value={editForm.price}
                                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Harga Jual (Rp)</label>
                            <input className={styles.input} type="number" value={editForm.selling_price}
                                onChange={(e) => setEditForm({ ...editForm, selling_price: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Harga Sachet (Rp)</label>
                            <input className={styles.input} type="number" value={editForm.sachet_price}
                                onChange={(e) => setEditForm({ ...editForm, sachet_price: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Stok</label>
                            <input className={styles.input} type="number" value={editForm.stock}
                                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Kategori</label>
                            <select className={styles.select} value={editForm.category_id}
                                onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setEditProduct(null)}>Batal</button>
                            <button className={styles.saveBtn} onClick={handleEditSave}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTable;
