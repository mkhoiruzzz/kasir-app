import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalProducts: 0, totalCategories: 0, lowStock: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Products
            const { data: products, error: prodError } = await supabase
                .from('products')
                .select('*, categories(name)')
                .order('created_at', { ascending: false });

            if (prodError) throw prodError;

            // Fetch Categories count (using head: true for count only)
            const { count: catCount, error: catError } = await supabase
                .from('categories')
                .select('*', { count: 'exact', head: true });

            if (catError) throw catError;

            setStats({
                totalProducts: products.length,
                totalCategories: catCount,
                lowStock: products.filter(p => p.stock < 10).length
            });

            // Flatten category name for recent products
            const formattedRecent = products.slice(0, 5).map(p => ({
                ...p,
                category_name: p.categories?.name
            }));

            setRecentProducts(formattedRecent);
        } catch (error) {
            console.error('Error fetching dashboard data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Memuat data...</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Selamat datang di KasirApp</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.iconBlue}`}>📦</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.totalProducts}</h3>
                        <p>Total Produk</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.iconGreen}`}>🏷️</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.totalCategories}</h3>
                        <p>Total Kategori</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.iconOrange}`}>⚠️</div>
                    <div className={styles.statInfo}>
                        <h3>{stats.lowStock}</h3>
                        <p>Stok Rendah (&lt;10)</p>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <Link to="/produk" className={`${styles.actionBtn} ${styles.btnPrimary}`}>
                    ➕ Tambah Produk
                </Link>
                <Link to="/kasir" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
                    🛒 Buka Kasir
                </Link>
            </div>

            <div className={styles.recentProducts}>
                <h2 className={styles.sectionTitle}>Produk Terbaru</h2>
                <table className={styles.productTable}>
                    <thead>
                        <tr>
                            <th>Nama Produk</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Kategori</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles.badgeBlue}`}>
                                        {product.category_name}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
