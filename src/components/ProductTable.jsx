import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/ProductTable.module.css';

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
            const res = await fetch('http://localhost:5000/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('q', search);
            if (filterCategory) params.append('category', filterCategory);
            const res = await fetch(`http://localhost:5000/api/products/search?${params}`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
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
            await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (err) {
            console.error(err);
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
            await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            setEditProduct(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
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
