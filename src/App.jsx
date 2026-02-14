import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import styles from './styles/Sidebar.module.css';

function App() {
  return (
    <Router>
      <Sidebar />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/produk" element={<ProductTable />} />
          <Route path="/produk/tambah" element={<ProductForm />} />
          <Route path="/kasir" element={<h2 style={{ color: '#64748b' }}>🛒 Halaman Kasir (Coming Soon)</h2>} />
          <Route path="/kategori" element={<h2 style={{ color: '#64748b' }}>🏷️ Halaman Kategori (Coming Soon)</h2>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
