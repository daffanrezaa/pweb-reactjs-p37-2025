import { Routes, Route } from 'react-router-dom';

// 1. Import Layout & Halaman Auth
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 2. Import Halaman Buku
import BookList from './pages/book/BookList';
import BookDetail from './pages/book/BookDetail';
import AddBook from './pages/book/AddBook';

// 3. Import Halaman Transaksi
import TransactionList from './pages/transaction/TransactionList';
import TransactionDetail from './pages/transaction/TransactionDetail';
import Checkout from './pages/transaction/Checkout';

// Placeholder components
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
    <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
    <p style={{ fontSize: '1.25rem', color: '#666' }}>Page Not Found</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Rute Publik: Login & Register (Tanpa Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rute Utama (Dengan Navbar, dibungkus MainLayout) */}
      <Route element={<MainLayout />}>
        
        {/* --- BOOKS MANAGEMENT --- */}
        {/* Public: Anyone can view books */}
        <Route path="/" element={<BookList />} />
        <Route path="/books/:book_id" element={<BookDetail />} /> 
        
        {/* Protected: Only authenticated users can add books */}
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />

        {/* --- TRANSACTIONS & CHECKOUT --- */}
        
        {/* Shopping Cart (Checkout - Membuat Transaksi) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        
        {/* Transaction List - CHANGED FROM /history to /transactions */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionList />
            </ProtectedRoute>
          }
        />
        
        {/* Transaction Detail - CHANGED FROM /history/:transaction_id to /transactions/:id */}
        <Route
          path="/transactions/:id"
          element={
            <ProtectedRoute>
              <TransactionDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Rute 404 (Halaman tidak ditemukan) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;