import { Routes, Route } from 'react-router-dom';

// 1. Import Layout & Halaman Auth
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 2. Import Halaman Buku (Kita biarkan placeholder)
// import BookList from './pages/book/BookList';
// import BookDetail from './pages/book/BookDetail';
// import BookListByGenre from './pages/book/BookListByGenre';
// import AddBook from './pages/book/AddBook';

// 3. Import Halaman Genre (Kita biarkan placeholder)
// import GenreList from './pages/genre/GenreList';
// import GenreDetail from './pages/genre/GenreDetail';

// 4. Import Halaman Transaksi
import TransactionList from './pages/transaction/TransactionList';
import TransactionDetail from './pages/transaction/TransactionDetail';
import Checkout from './pages/transaction/Checkout';
// import TransactionStats from './pages/transaction/TransactionStats'; // Biarkan dulu jika belum dibuat

// Placeholder yang TIDAK DIGUNAKAN untuk Transaksi Dihapus
const BookList = () => <div>Halaman Daftar Buku (Home)</div>;
const BookDetail = () => <div>Halaman Detail Buku</div>;
const BookListByGenre = () => <div>Halaman Buku Berdasarkan Genre</div>;
const AddBook = () => <div>Halaman Tambah Buku</div>;
const GenreList = () => <div>Halaman Daftar Genre</div>;
const GenreDetail = () => <div>Halaman Detail Genre</div>;
// const TransactionList = () => <div>Halaman List Transaksi</div>; // DIHAPUS, DIGANTI IMPORT ASLI
// const TransactionDetail = () => <div>Halaman Detail Transaksi</div>; // DIHAPUS, DIGANTI IMPORT ASLI
const TransactionStats = () => <div>Halaman Statistik Transaksi</div>; // Biarkan placeholder jika belum dibuat
const NotFound = () => <div>404 - Halaman Tidak Ditemukan</div>;


function App() {
  return (
    <Routes>
      {/* Rute Publik: Login & Register (Tanpa Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rute Utama (Dengan Navbar, dibungkus MainLayout) */}
      <Route element={<MainLayout />}>
        
        {/* --- LIBRARY (BOOKS) --- (Tetap menggunakan placeholder) */}
        <Route path="/" element={<BookList />} />
        <Route path="/books/:book_id" element={<BookDetail />} /> 
        <Route
          path="/books/genre/:genre_id" 
          element={<BookListByGenre />}
        />
        <Route
          path="/books/add"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />

        {/* --- GENRE --- (Tetap menggunakan placeholder) */}
        <Route path="/genre" element={<GenreList />} />
        <Route path="/genre/:genre_id" element={<GenreDetail />} />

        {/* --- TRANSACTIONS --- (KOMPONEN ANDA YANG SUDAH JADI) */}
        
        {/* Rute 1: Checkout (Membuat Transaksi) */}
        <Route
          path="/checkout" // <-- RUTE BARU UNTUK CHECKOUT
          element={
            <ProtectedRoute>
              <Checkout /> {/* <-- Menggunakan Komponen Checkout ASLI */}
            </ProtectedRoute>
          }
        />
        
        {/* Rute 2: List Transaksi (Riwayat) */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionList />
            </ProtectedRoute>
          }
        />
        
        {/* Rute 3: Statistik Transaksi (Biarkan placeholder/komponen teman) */}
        <Route
          path="/transactions/statistics" 
          element={
            <ProtectedRoute>
              <TransactionStats /> 
            </ProtectedRoute>
          }
        />
        
        {/* Rute 4: Detail Transaksi */}
        <Route
          path="/transactions/:transaction_id" 
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