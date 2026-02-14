import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import POSScreen from './components/POSScreen';
import CategoryManager from './components/CategoryManager';
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
          <Route path="/kasir" element={<POSScreen />} />
          <Route path="/kategori" element={<CategoryManager />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
