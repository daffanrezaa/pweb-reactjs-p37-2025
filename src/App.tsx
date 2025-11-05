import { Routes, Route } from 'react-router-dom';

// 1. Import Layout & Halaman Auth
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 2. Import Halaman Buku (Buat file-nya nanti)
// (Kita biarkan commented dulu agar tidak error)
// import BookList from './pages/book/BookList';
// import BookDetail from './pages/book/BookDetail';
// import BookListByGenre from './pages/book/BookListByGenre'; // Halaman baru
// import AddBook from './pages/book/AddBook';

// 3. Import Halaman Genre (Buat file-nya nanti)
// import GenreList from './pages/genre/GenreList';
// import GenreDetail from './pages/genre/GenreDetail';

// 4. Import Halaman Transaksi (Buat file-nya nanti)
// import TransactionList from './pages/transaction/TransactionList';
// import TransactionDetail from './pages/transaction/TransactionDetail';
// import TransactionStats from './pages/transaction/TransactionStats'; // Halaman baru

// Placeholder sementara agar tidak error
const BookList = () => <div>Halaman Daftar Buku (Home)</div>;
const BookDetail = () => <div>Halaman Detail Buku</div>;
const BookListByGenre = () => <div>Halaman Buku Berdasarkan Genre</div>;
const AddBook = () => <div>Halaman Tambah Buku</div>;
const GenreList = () => <div>Halaman Daftar Genre</div>;
const GenreDetail = () => <div>Halaman Detail Genre</div>;
const TransactionList = () => <div>Halaman List Transaksi</div>;
const TransactionDetail = () => <div>Halaman Detail Transaksi</div>;
const TransactionStats = () => <div>Halaman Statistik Transaksi</div>;
const NotFound = () => <div>404 - Halaman Tidak Ditemukan</div>;

function App() {
  return (
    <Routes>
      {/* Rute Publik: Login & Register (Tanpa Navbar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rute Utama (Dengan Navbar, dibungkus MainLayout) */}
      <Route element={<MainLayout />}>
        {/* --- LIBRARY (BOOKS) --- */}
        <Route path="/" element={<BookList />} />
        <Route path="/books/:book_id" element={<BookDetail />} /> {/* DISESUAIKAN */}
        <Route
          path="/books/genre/:genre_id" // BARU
          element={<BookListByGenre />}
        />
        <Route
          path="/books/add" // Sesuai requirement AddBook
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />
        {/* (Rute Update & Delete buku akan ada di dalam halaman :book_id) */}

        {/* --- GENRE --- */}
        <Route path="/genre" element={<GenreList />} />
        <Route path="/genre/:genre_id" element={<GenreDetail />} /> {/* DISESUAIKAN */}

        {/* --- TRANSACTIONS --- */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/statistics" // BARU
          element={
            <ProtectedRoute>
              <TransactionStats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:transaction_id" // DISESUAIKAN
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