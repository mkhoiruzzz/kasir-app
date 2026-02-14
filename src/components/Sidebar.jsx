import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/kasir', label: 'Kasir', icon: '🛒' },
        { path: '/produk', label: 'Produk', icon: '📦' },
        { path: '/kategori', label: 'Kategori', icon: '🏷️' },
    ];

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger - hidden when sidebar is open */}
            <button
                className={`${styles.hamburger} ${isOpen ? styles.hamburgerHidden : ''}`}
                onClick={() => setIsOpen(true)}
            >
                ☰
            </button>

            {/* Dark overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.logo}>
                    <span className={styles.logoText}>
                        <span className={styles.logoAccent}>Kasir</span>App
                    </span>
                    <button className={styles.closeBtn} onClick={closeSidebar}>✕</button>
                </div>
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                            }
                            end={item.path === '/'}
                            onClick={closeSidebar}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
