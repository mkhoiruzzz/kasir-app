import React, { useState, useEffect } from 'react';
import styles from '../styles/POSScreen.module.css';
import { supabase } from '../supabaseClient';

const POSScreen = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: prods, error: pErr } = await supabase.from('products').select('*').order('name');
            const { data: cats, error: cErr } = await supabase.from('categories').select('*').order('name');

            if (pErr) throw pErr;
            if (cErr) throw cErr;

            setProducts(prods);
            setCategories([{ id: 'All', name: 'Semua' }, ...cats]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.qty + delta);
                return { ...item, qty: newQty };
            }
            return item;
        }).filter(item => item.qty > 0));
    };

    const checkout = () => {
        if (cart.length === 0) return alert('Keranjang kosong!');
        const total = cart.reduce((sum, item) => sum + (item.selling_price * item.qty), 0);
        if (window.confirm(`Total Belanja: Rp ${total.toLocaleString('id-ID')}\nProses Pembayaran?`)) {
            // Here you would optimally save the transaction to a 'sales' table in Supabase
            alert('Pembayaran Berhasil! (Disimulasikan)');
            setCart([]);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'All' || p.category_id === activeCategory;
        return matchSearch && matchCat;
    });

    const totalAmount = cart.reduce((sum, item) => sum + (item.selling_price * item.qty), 0);

    return (
        <div className={styles.container}>
            {/* Left Panel: Product Catalog */}
            <div className={styles.leftPanel}>
                <div className={styles.searchBar}>
                    <input
                        className={styles.searchInput}
                        placeholder="🔍 Cari nama produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.categoryTabs}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className={styles.productGrid}>
                    {loading ? <p>Memuat produk...</p> : filteredProducts.map(product => (
                        <div key={product.id} className={styles.productCard} onClick={() => addToCart(product)}>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.stockLabel}>Stok: {product.stock}</div>
                            <div className={styles.productPrice}>Rp {Number(product.selling_price).toLocaleString('id-ID')}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: Cart */}
            <div className={styles.rightPanel}>
                <h2 className={styles.cartTitle}>🛒 Keranjang</h2>

                <div className={styles.cartItems}>
                    {cart.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>Keranjang kosong</p> : cart.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                                <div className={styles.itemName}>{item.name}</div>
                                <div className={styles.itemPrice}>Rp {Number(item.selling_price).toLocaleString('id-ID')} x {item.qty}</div>
                            </div>
                            <div className={styles.qtyControls}>
                                <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>-</button>
                                <span>{item.qty}</span>
                                <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.totalSection}>
                    <div className={styles.totalRow}>
                        <span>Total:</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <button className={styles.payBtn} onClick={checkout}>Bayar Sekarang</button>
                </div>
            </div>
        </div>
    );
};

export default POSScreen;
